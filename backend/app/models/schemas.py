from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
from typing import Optional, List, Any
from datetime import datetime, date
from enum import Enum
from bson import ObjectId


class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info=None):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")


# ---------- Enums ----------
class UserRole(str, Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    EDITOR = "editor"


class VolunteerRole(str, Enum):
    DOCTOR = "doctor"
    NURSE = "nurse"
    PHARMACIST = "pharmacist"
    LAB_TECH = "lab_tech"
    EDUCATION_MENTOR = "education_mentor"
    FOOD_LOGISTICS = "food_logistics"
    MEDIA = "media"
    GENERAL = "general"


class DonationCategory(str, Enum):
    WHERE_NEEDED = "where_needed"
    MEDICAL_SUPPLIES = "medical_supplies"
    FEEDING_DRIVE = "feeding_drive"
    CHILD_EDUCATION = "child_education"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    ABANDONED = "abandoned"


class MissionStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class NominationStatus(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    APPROVED = "approved"
    REJECTED = "rejected"


class BaseLocation(str, Enum):
    PORT_HARCOURT = "port_harcourt"
    ABUJA = "abuja"
    WILLING_TO_TRAVEL = "willing_to_travel"


# ---------- Auth ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str
    role: UserRole = UserRole.ADMIN


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Impact Metrics ----------
class ImpactMetrics(BaseModel):
    communities_reached: int = 0
    patients_treated: int = 0
    meals_served: int = 0
    children_supported: int = 0
    last_updated: Optional[datetime] = None


# ---------- Missions ----------
class MissionBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_state: str
    target_lga: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    planned_services: List[str] = []
    fundraising_goal: Optional[float] = None
    fundraising_raised: float = 0.0
    status: MissionStatus = MissionStatus.UPCOMING
    cover_image: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_state: Optional[str] = None
    target_lga: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    planned_services: Optional[List[str]] = None
    fundraising_goal: Optional[float] = None
    fundraising_raised: Optional[float] = None
    status: Optional[MissionStatus] = None
    cover_image: Optional[str] = None
    # Post-mission stats
    patients_consulted: Optional[int] = None
    meals_distributed: Optional[int] = None
    school_kits_handed: Optional[int] = None
    field_notes: Optional[str] = None
    gallery: Optional[List[str]] = None


class MissionResponse(MissionBase):
    id: str
    patients_consulted: Optional[int] = None
    meals_distributed: Optional[int] = None
    school_kits_handed: Optional[int] = None
    field_notes: Optional[str] = None
    gallery: List[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Donations ----------
class DonationInitiate(BaseModel):
    amount: float = Field(..., gt=0)
    currency: str = "NGN"
    category: DonationCategory = DonationCategory.WHERE_NEEDED
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    is_anonymous: bool = False
    message: Optional[str] = None
    gateway: str = Field(default="paystack", pattern="^(paystack|flutterwave)$")


class DonationResponse(BaseModel):
    id: str
    reference: str
    amount: float
    currency: str
    category: DonationCategory
    donor_name: str
    donor_email: EmailStr
    is_anonymous: bool
    status: PaymentStatus
    gateway: str
    created_at: datetime
    paid_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DonationPublic(BaseModel):
    """Safe public view of recent donations (no email/phone)."""
    amount: float
    currency: str
    category: DonationCategory
    donor_name: str
    is_anonymous: bool
    message: Optional[str] = None
    paid_at: Optional[datetime] = None


# ---------- Volunteers ----------
class VolunteerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    role: VolunteerRole
    base_location: BaseLocation
    license_number: Optional[str] = None  # for clinical roles
    specialty: Optional[str] = None
    availability_notes: Optional[str] = None
    experience_years: Optional[int] = None
    emergency_contact: Optional[str] = None


class VolunteerResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    role: VolunteerRole
    base_location: BaseLocation
    license_number: Optional[str] = None
    specialty: Optional[str] = None
    availability_notes: Optional[str] = None
    experience_years: Optional[int] = None
    is_verified: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Nominations ----------
class NominationCreate(BaseModel):
    community_name: str
    state: str
    lga: str
    estimated_population: Optional[int] = None
    primary_challenges: List[str] = []  # healthcare_access, malnutrition, out_of_school
    description: Optional[str] = None
    submitter_name: str
    submitter_role: str  # village head, youth leader, local NGO, etc.
    submitter_phone: str
    submitter_email: Optional[EmailStr] = None
    local_contact_name: Optional[str] = None
    local_contact_phone: Optional[str] = None


class NominationUpdate(BaseModel):
    status: NominationStatus
    admin_notes: Optional[str] = None


class NominationResponse(BaseModel):
    id: str
    community_name: str
    state: str
    lga: str
    estimated_population: Optional[int] = None
    primary_challenges: List[str] = []
    description: Optional[str] = None
    submitter_name: str
    submitter_role: str
    submitter_phone: str
    submitter_email: Optional[EmailStr] = None
    status: NominationStatus
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Stories ----------
class StoryCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    mission_id: Optional[str] = None
    published: bool = False
    tags: List[str] = []


class StoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    mission_id: Optional[str] = None
    published: Optional[bool] = None
    tags: Optional[List[str]] = None


class StoryResponse(BaseModel):
    id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    mission_id: Optional[str] = None
    published: bool
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Contact ----------
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class ContactResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    subject: str
    message: str
    is_read: bool = False
    created_at: datetime


# ---------- In-kind / Corporate ----------
class InKindPledge(BaseModel):
    organization_name: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: str
    pledge_type: str  # medications, food, school_supplies, logistics, other
    description: str
    estimated_value: Optional[float] = None
    preferred_delivery_date: Optional[date] = None
    notes: Optional[str] = None


class InKindResponse(BaseModel):
    id: str
    organization_name: str
    contact_name: str
    contact_email: EmailStr
    pledge_type: str
    description: str
    status: str = "pending"
    created_at: datetime


# ---------- Generic ----------
class MessageResponse(BaseModel):
    message: str
    detail: Optional[Any] = None


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
    pages: int
