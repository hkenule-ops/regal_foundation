from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import get_settings

settings = get_settings()

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.volunteers.create_index("email")
    await db.donations.create_index("reference", unique=True)
    await db.missions.create_index([("status", 1), ("start_date", -1)])
    await db.nominations.create_index([("status", 1), ("created_at", -1)])
    await db.stories.create_index([("published", 1), ("created_at", -1)])


async def close_mongo_connection() -> None:
    global client
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return db
