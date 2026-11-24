from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.models.schemas import (
    MissionCreate,
    MissionUpdate,
    MissionResponse,
    MissionStatus,
    MessageResponse,
)
from app.core.security import get_current_admin
from app.core.database import get_database

router = APIRouter(prefix="/missions", tags=["Missions"])


def serialize_mission(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc.get("description"),
        "target_state": doc["target_state"],
        "target_lga": doc.get("target_lga"),
        "start_date": doc["start_date"],
        "end_date": doc.get("end_date"),
        "planned_services": doc.get("planned_services", []),
        "fundraising_goal": doc.get("fundraising_goal"),
        "fundraising_raised": doc.get("fundraising_raised", 0.0),
        "status": doc.get("status", "upcoming"),
        "cover_image": doc.get("cover_image"),
        "patients_consulted": doc.get("patients_consulted"),
        "meals_distributed": doc.get("meals_distributed"),
        "school_kits_handed": doc.get("school_kits_handed"),
        "field_notes": doc.get("field_notes"),
        "gallery": doc.get("gallery", []),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


@router.get("", response_model=List[MissionResponse])
async def list_missions(
    status_filter: Optional[MissionStatus] = Query(None, alias="status"),
    year: Optional[int] = None,
    state: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Public: list missions with optional filters."""
    db = get_database()
    query = {}
    if status_filter:
        query["status"] = status_filter.value
    if year:
        query["start_date"] = {
            "$gte": datetime(year, 1, 1).date().isoformat(),
            "$lte": datetime(year, 12, 31).date().isoformat(),
        }
    if state:
        query["target_state"] = {"$regex": state, "$options": "i"}

    cursor = db.missions.find(query).sort("start_date", -1).skip(skip).limit(limit)
    missions = []
    async for doc in cursor:
        # Convert date strings back if stored as strings
        if isinstance(doc.get("start_date"), str):
            doc["start_date"] = datetime.fromisoformat(doc["start_date"]).date()
        if doc.get("end_date") and isinstance(doc["end_date"], str):
            doc["end_date"] = datetime.fromisoformat(doc["end_date"]).date()
        missions.append(MissionResponse(**serialize_mission(doc)))
    return missions


@router.get("/upcoming", response_model=List[MissionResponse])
async def upcoming_missions(limit: int = Query(5, ge=1, le=20)):
    db = get_database()
    cursor = (
        db.missions.find({"status": MissionStatus.UPCOMING.value})
        .sort("start_date", 1)
        .limit(limit)
    )
    missions = []
    async for doc in cursor:
        if isinstance(doc.get("start_date"), str):
            doc["start_date"] = datetime.fromisoformat(doc["start_date"]).date()
        if doc.get("end_date") and isinstance(doc["end_date"], str):
            doc["end_date"] = datetime.fromisoformat(doc["end_date"]).date()
        missions.append(MissionResponse(**serialize_mission(doc)))
    return missions


@router.get("/{mission_id}", response_model=MissionResponse)
async def get_mission(mission_id: str):
    db = get_database()
    if not ObjectId.is_valid(mission_id):
        raise HTTPException(status_code=400, detail="Invalid mission ID")
    doc = await db.missions.find_one({"_id": ObjectId(mission_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Mission not found")
    if isinstance(doc.get("start_date"), str):
        doc["start_date"] = datetime.fromisoformat(doc["start_date"]).date()
    if doc.get("end_date") and isinstance(doc["end_date"], str):
        doc["end_date"] = datetime.fromisoformat(doc["end_date"]).date()
    return MissionResponse(**serialize_mission(doc))


@router.post("", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
async def create_mission(
    mission_in: MissionCreate,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = mission_in.model_dump()
    # Store dates as ISO strings for MongoDB simplicity
    doc["start_date"] = doc["start_date"].isoformat()
    if doc.get("end_date"):
        doc["end_date"] = doc["end_date"].isoformat()
    doc["status"] = doc["status"].value if hasattr(doc["status"], "value") else doc["status"]
    doc["created_at"] = now
    doc["updated_at"] = now
    doc["gallery"] = []
    result = await db.missions.insert_one(doc)
    doc["_id"] = result.inserted_id
    # Restore date objects for response
    doc["start_date"] = mission_in.start_date
    if mission_in.end_date:
        doc["end_date"] = mission_in.end_date
    return MissionResponse(**serialize_mission(doc))


@router.patch("/{mission_id}", response_model=MissionResponse)
async def update_mission(
    mission_id: str,
    mission_in: MissionUpdate,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(mission_id):
        raise HTTPException(status_code=400, detail="Invalid mission ID")

    update_data = {k: v for k, v in mission_in.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    if "start_date" in update_data and update_data["start_date"]:
        update_data["start_date"] = update_data["start_date"].isoformat()
    if "end_date" in update_data and update_data["end_date"]:
        update_data["end_date"] = update_data["end_date"].isoformat()
    if "status" in update_data and hasattr(update_data["status"], "value"):
        update_data["status"] = update_data["status"].value

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.missions.find_one_and_update(
        {"_id": ObjectId(mission_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Mission not found")

    if isinstance(result.get("start_date"), str):
        result["start_date"] = datetime.fromisoformat(result["start_date"]).date()
    if result.get("end_date") and isinstance(result["end_date"], str):
        result["end_date"] = datetime.fromisoformat(result["end_date"]).date()
    return MissionResponse(**serialize_mission(result))


@router.delete("/{mission_id}", response_model=MessageResponse)
async def delete_mission(
    mission_id: str,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(mission_id):
        raise HTTPException(status_code=400, detail="Invalid mission ID")
    result = await db.missions.delete_one({"_id": ObjectId(mission_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mission not found")
    return MessageResponse(message="Mission deleted successfully")
