from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.models.schemas import UserCreate, UserLogin, Token, UserResponse, MessageResponse
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_admin,
    get_current_user,
)
from app.core.database import get_database

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_admin(user_in: UserCreate, current_admin: dict = Depends(get_current_admin)):
    """Register a new admin user. Only existing admins can create accounts."""
    db = get_database()
    existing = await db.users.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "email": user_in.email.lower(),
        "hashed_password": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "role": user_in.role.value,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(user_doc)
    user_doc["id"] = str(result.inserted_id)
    return UserResponse(
        id=user_doc["id"],
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        role=user_doc["role"],
        is_active=user_doc["is_active"],
        created_at=user_doc["created_at"],
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is inactive")

    access_token = create_access_token(data={"sub": str(user["_id"]), "role": user["role"]})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        is_active=current_user.get("is_active", True),
        created_at=current_user["created_at"],
    )


@router.post("/bootstrap", response_model=MessageResponse)
async def bootstrap_superadmin(user_in: UserCreate):
    """
    Create the very first superadmin account.
    This endpoint only works when no users exist in the database.
    Disable or protect this in production after initial setup.
    """
    db = get_database()
    count = await db.users.count_documents({})
    if count > 0:
        raise HTTPException(
            status_code=403,
            detail="Bootstrap is only available when no users exist. Use /register with an admin token.",
        )

    user_doc = {
        "email": user_in.email.lower(),
        "hashed_password": get_password_hash(user_in.password),
        "full_name": user_in.full_name,
        "role": "superadmin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(user_doc)
    return MessageResponse(message="Superadmin account created successfully. You can now log in.")
