from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.models.schemas import (
    NominationCreate,
    NominationUpdate,
    NominationResponse,
    NominationStatus,
    MessageResponse,
)
from app.core.security import get_current_admin
from app.core.database import get_database

router = APIRouter(prefix="/nominations", tags=["Community Nominations"])


def serialize_nomination(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "community_name": doc["community_name"],
        "state": doc["state"],
        "lga": doc["lga"],
        "estimated_population": doc.get("estimated_population"),
        "primary_challenges": doc.get("primary_challenges", []),
        "description": doc.get("description"),
        "submitter_name": doc["submitter_name"],
        "submitter_role": doc["submitter_role"],
        "submitter_phone": doc["submitter_phone"],
        "submitter_email": doc.get("submitter_email"),
        "status": doc.get("status", "pending"),
        "admin_notes": doc.get("admin_notes"),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


@router.post("", response_model=NominationResponse, status_code=status.HTTP_201_CREATED)
async def submit_nomination(nomination_in: NominationCreate):
    """Public: nominate a community for outreach."""
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = nomination_in.model_dump()
    if doc.get("submitter_email"):
        doc["submitter_email"] = doc["submitter_email"].lower()
    doc["status"] = NominationStatus.PENDING.value
    doc["admin_notes"] = None
    doc["created_at"] = now
    doc["updated_at"] = now

    result = await db.nominations.insert_one(doc)
    doc["_id"] = result.inserted_id
    return NominationResponse(**serialize_nomination(doc))


@router.get("", response_model=List[NominationResponse])
async def list_nominations(
    status_filter: Optional[NominationStatus] = Query(None, alias="status"),
    state: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_admin: dict = Depends(get_current_admin),
):
    """Admin: nominations queue."""
    db = get_database()
    query = {}
    if status_filter:
        query["status"] = status_filter.value
    if state:
        query["state"] = {"$regex": state, "$options": "i"}

    cursor = db.nominations.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(NominationResponse(**serialize_nomination(doc)))
    return results


@router.get("/{nomination_id}", response_model=NominationResponse)
async def get_nomination(
    nomination_id: str,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(nomination_id):
        raise HTTPException(status_code=400, detail="Invalid nomination ID")
    doc = await db.nominations.find_one({"_id": ObjectId(nomination_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Nomination not found")
    return NominationResponse(**serialize_nomination(doc))


@router.patch("/{nomination_id}", response_model=NominationResponse)
async def update_nomination(
    nomination_id: str,
    update_in: NominationUpdate,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(nomination_id):
        raise HTTPException(status_code=400, detail="Invalid nomination ID")

    update_data = {
        "status": update_in.status.value,
        "updated_at": datetime.now(timezone.utc),
    }
    if update_in.admin_notes is not None:
        update_data["admin_notes"] = update_in.admin_notes

    result = await db.nominations.find_one_and_update(
        {"_id": ObjectId(nomination_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Nomination not found")
    return NominationResponse(**serialize_nomination(result))
