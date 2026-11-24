from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.models.schemas import (
    VolunteerCreate,
    VolunteerResponse,
    VolunteerRole,
    BaseLocation,
    MessageResponse,
)
from app.core.security import get_current_admin
from app.core.database import get_database

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


def serialize_volunteer(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "full_name": doc["full_name"],
        "email": doc["email"],
        "phone": doc["phone"],
        "role": doc["role"],
        "base_location": doc["base_location"],
        "license_number": doc.get("license_number"),
        "specialty": doc.get("specialty"),
        "availability_notes": doc.get("availability_notes"),
        "experience_years": doc.get("experience_years"),
        "is_verified": doc.get("is_verified", False),
        "created_at": doc["created_at"],
    }


@router.post("", response_model=VolunteerResponse, status_code=status.HTTP_201_CREATED)
async def register_volunteer(volunteer_in: VolunteerCreate):
    """Public: volunteer registration form."""
    db = get_database()
    existing = await db.volunteers.find_one({"email": volunteer_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A volunteer with this email is already registered. Contact us if you need to update your details.",
        )

    now = datetime.now(timezone.utc)
    doc = volunteer_in.model_dump()
    doc["email"] = doc["email"].lower()
    doc["role"] = doc["role"].value
    doc["base_location"] = doc["base_location"].value
    doc["is_verified"] = False
    doc["created_at"] = now
    doc["updated_at"] = now

    result = await db.volunteers.insert_one(doc)
    doc["_id"] = result.inserted_id
    return VolunteerResponse(**serialize_volunteer(doc))


@router.get("", response_model=List[VolunteerResponse])
async def list_volunteers(
    role: Optional[VolunteerRole] = None,
    location: Optional[BaseLocation] = None,
    verified_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_admin: dict = Depends(get_current_admin),
):
    """Admin: volunteer roster with filters."""
    db = get_database()
    query = {}
    if role:
        query["role"] = role.value
    if location:
        query["base_location"] = location.value
    if verified_only:
        query["is_verified"] = True

    cursor = db.volunteers.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(VolunteerResponse(**serialize_volunteer(doc)))
    return results


@router.patch("/{volunteer_id}/verify", response_model=VolunteerResponse)
async def verify_volunteer(
    volunteer_id: str,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(volunteer_id):
        raise HTTPException(status_code=400, detail="Invalid volunteer ID")
    result = await db.volunteers.find_one_and_update(
        {"_id": ObjectId(volunteer_id)},
        {"$set": {"is_verified": True, "updated_at": datetime.now(timezone.utc)}},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return VolunteerResponse(**serialize_volunteer(result))


@router.get("/stats")
async def volunteer_stats(current_admin: dict = Depends(get_current_admin)):
    db = get_database()
    total = await db.volunteers.count_documents({})
    verified = await db.volunteers.count_documents({"is_verified": True})
    by_role = []
    async for row in db.volunteers.aggregate(
        [{"$group": {"_id": "$role", "count": {"$sum": 1}}}]
    ):
        by_role.append({"role": row["_id"], "count": row["count"]})
    return {"total": total, "verified": verified, "by_role": by_role}
