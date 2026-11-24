"""
Seed script: create initial impact metrics and a sample upcoming mission.
Run after MongoDB is up and the superadmin has been bootstrapped.

Usage:
  python -m scripts.seed
"""
import asyncio
from datetime import datetime, timezone, date, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import get_settings

settings = get_settings()


async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]

    # Impact metrics
    await db.settings.update_one(
        {"key": "impact_metrics"},
        {
            "$set": {
                "value": {
                    "communities_reached": 12,
                    "patients_treated": 3840,
                    "meals_served": 9200,
                    "children_supported": 1450,
                },
                "updated_at": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )
    print("✓ Impact metrics seeded")

    # Sample upcoming mission
    existing = await db.missions.find_one({"title": "Rivers State Rural Outreach – Q1 2027"})
    if not existing:
        start = date.today() + timedelta(days=45)
        await db.missions.insert_one(
            {
                "title": "Rivers State Rural Outreach – Q1 2027",
                "description": (
                    "Three-day medical outreach covering general consultations, "
                    "eye checks, dental care, maternal wellness, free pharmacy, "
                    "feeding drive, and school kit distribution."
                ),
                "target_state": "Rivers",
                "target_lga": "Emohua",
                "start_date": start.isoformat(),
                "end_date": (start + timedelta(days=2)).isoformat(),
                "planned_services": [
                    "General consultations",
                    "Eye & dental checks",
                    "Maternal care",
                    "Free pharmacy",
                    "Hot meal drive",
                    "School kits",
                ],
                "fundraising_goal": 2500000,
                "fundraising_raised": 0,
                "status": "upcoming",
                "cover_image": None,
                "gallery": [],
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
        )
        print("✓ Sample upcoming mission created")
    else:
        print("• Sample mission already exists")

    client.close()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
