from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
import re
from app.models.schemas import StoryCreate, StoryUpdate, StoryResponse, MessageResponse
from app.core.security import get_current_admin
from app.core.database import get_database

router = APIRouter(prefix="/stories", tags=["Field Stories"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:80]


def serialize_story(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "slug": doc["slug"],
        "content": doc["content"],
        "excerpt": doc.get("excerpt"),
        "cover_image": doc.get("cover_image"),
        "mission_id": doc.get("mission_id"),
        "published": doc.get("published", False),
        "tags": doc.get("tags", []),
        "created_at": doc["created_at"],
        "updated_at": doc["updated_at"],
    }


@router.get("", response_model=List[StoryResponse])
async def list_stories(
    published_only: bool = True,
    tag: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
):
    """Public: published stories. Admin can pass published_only=false with auth if needed."""
    db = get_database()
    query = {}
    if published_only:
        query["published"] = True
    if tag:
        query["tags"] = tag

    cursor = db.stories.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(StoryResponse(**serialize_story(doc)))
    return results


@router.get("/{slug_or_id}", response_model=StoryResponse)
async def get_story(slug_or_id: str):
    db = get_database()
    query = {"published": True}
    if ObjectId.is_valid(slug_or_id):
        query["_id"] = ObjectId(slug_or_id)
    else:
        query["slug"] = slug_or_id

    doc = await db.stories.find_one(query)
    if not doc:
        raise HTTPException(status_code=404, detail="Story not found")
    return StoryResponse(**serialize_story(doc))


@router.post("", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(
    story_in: StoryCreate,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    now = datetime.now(timezone.utc)
    slug = story_in.slug or slugify(story_in.title)

    # Ensure unique slug
    existing = await db.stories.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{int(now.timestamp())}"

    doc = story_in.model_dump()
    doc["slug"] = slug
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.stories.insert_one(doc)
    doc["_id"] = result.inserted_id
    return StoryResponse(**serialize_story(doc))


@router.patch("/{story_id}", response_model=StoryResponse)
async def update_story(
    story_id: str,
    story_in: StoryUpdate,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(story_id):
        raise HTTPException(status_code=400, detail="Invalid story ID")

    update_data = {k: v for k, v in story_in.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.stories.find_one_and_update(
        {"_id": ObjectId(story_id)},
        {"$set": update_data},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Story not found")
    return StoryResponse(**serialize_story(result))


@router.delete("/{story_id}", response_model=MessageResponse)
async def delete_story(
    story_id: str,
    current_admin: dict = Depends(get_current_admin),
):
    db = get_database()
    if not ObjectId.is_valid(story_id):
        raise HTTPException(status_code=400, detail="Invalid story ID")
    result = await db.stories.delete_one({"_id": ObjectId(story_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Story not found")
    return MessageResponse(message="Story deleted")
