from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.models.schemas import (
    ContactMessage,
    ContactResponse,
    InKindPledge,
    InKindResponse,
    ImpactMetrics,
    MessageResponse,
)
from app.core.security import get_current_admin
from app.core.database import get_database

router = APIRouter(tags=["Public"])


@router.get("/impact", response_model=ImpactMetrics)
async def get_impact_metrics():
    """
    Live impact counter for the homepage.
    Aggregates from completed missions + stored overrides.
    """
    db = get_database()

    # Try stored metrics first (admin can set baseline)
    stored = await db.settings.find_one({"key": "impact_metrics"})
    if stored and stored.get("value"):
        metrics = stored["value"]
        return ImpactMetrics(
            communities_reached=metrics.get("communities_reached", 0),
            patients_treated=metrics.get("patients_treated", 0),
            meals_served=metrics.get("meals_served", 0),
            children_supported=metrics.get("children_supported", 0),
            last_updated=stored.get("updated_at"),
        )

    # Aggregate from completed missions
    pipeline = [
        {"$match": {"status": "completed"}},
        {
            "$group": {
                "_id": None,
                "patients": {"$sum": {"$ifNull": ["$patients_consulted", 0]}},
                "meals": {"$sum": {"$ifNull": ["$meals_distributed", 0]}},
                "kits": {"$sum": {"$ifNull": ["$school_kits_handed", 0]}},
                "communities": {"$sum": 1},
            }
        },
    ]
    result = await db.missions.aggregate(pipeline).to_list(1)
    if result:
        row = result[0]
        return ImpactMetrics(
            communities_reached=row.get("communities", 0),
            patients_treated=row.get("patients", 0),
            meals_served=row.get("meals", 0),
            children_supported=row.get("kits", 0),
            last_updated=datetime.now(timezone.utc),
        )
    return ImpactMetrics()


@router.put("/impact", response_model=ImpactMetrics)
async def set_impact_metrics(
    metrics: ImpactMetrics,
    current_admin: dict = Depends(get_current_admin),
):
    """Admin: set or override the live impact counters."""
    db = get_database()
    now = datetime.now(timezone.utc)
    value = metrics.model_dump(exclude={"last_updated"})
    await db.settings.update_one(
        {"key": "impact_metrics"},
        {"$set": {"value": value, "updated_at": now}},
        upsert=True,
    )
    return ImpactMetrics(**value, last_updated=now)


@router.post("/contact", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(message_in: ContactMessage):
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = message_in.model_dump()
    doc["email"] = doc["email"].lower()
    doc["is_read"] = False
    doc["created_at"] = now
    await db.contact_messages.insert_one(doc)
    # TODO: send notification email to foundation staff
    return MessageResponse(
        message="Thank you for reaching out. The Regal Foundation team will respond shortly."
    )


@router.get("/contact/messages", response_model=list[ContactResponse])
async def list_contact_messages(
    unread_only: bool = False,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    query = {"is_read": False} if unread_only else {}
    cursor = db.contact_messages.find(query).sort("created_at", -1).limit(100)
    results = []
    async for doc in cursor:
        results.append(
            ContactResponse(
                id=str(doc["_id"]),
                name=doc["name"],
                email=doc["email"],
                subject=doc["subject"],
                message=doc["message"],
                is_read=doc.get("is_read", False),
                created_at=doc["created_at"],
            )
        )
    return results


@router.post("/partner", response_model=InKindResponse, status_code=status.HTTP_201_CREATED)
async def submit_inkind_pledge(pledge_in: InKindPledge):
    """Public: in-kind / corporate sponsorship intake."""
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = pledge_in.model_dump()
    doc["contact_email"] = doc["contact_email"].lower()
    if doc.get("preferred_delivery_date"):
        doc["preferred_delivery_date"] = doc["preferred_delivery_date"].isoformat()
    doc["status"] = "pending"
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.inkind_pledges.insert_one(doc)
    return InKindResponse(
        id=str(result.inserted_id),
        organization_name=doc["organization_name"],
        contact_name=doc["contact_name"],
        contact_email=doc["contact_email"],
        pledge_type=doc["pledge_type"],
        description=doc["description"],
        status="pending",
        created_at=now,
    )


@router.get("/partner/pledges")
async def list_inkind_pledges(current_admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.inkind_pledges.find({}).sort("created_at", -1).limit(100)
    results = []
    async for doc in cursor:
        results.append(
            {
                "id": str(doc["_id"]),
                "organization_name": doc["organization_name"],
                "contact_name": doc["contact_name"],
                "contact_email": doc["contact_email"],
                "contact_phone": doc.get("contact_phone"),
                "pledge_type": doc["pledge_type"],
                "description": doc["description"],
                "estimated_value": doc.get("estimated_value"),
                "status": doc.get("status", "pending"),
                "created_at": doc["created_at"],
            }
        )
    return results
