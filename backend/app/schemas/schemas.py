from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ─── Enums ───────────────────────────────────────────────────────────────────

class UserRole(str, Enum):
    user = "user"
    provider = "provider"

class VerificationStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class AvailabilityStatus(str, Enum):
    online = "online"
    offline = "offline"
    busy = "busy"

class RequestStatus(str, Enum):
    searching = "searching"
    accepted = "accepted"
    provider_arriving = "provider_arriving"
    service_started = "service_started"
    service_completed = "service_completed"
    cancelled = "cancelled"
    no_provider_found = "no_provider_found"
    rejected = "rejected"


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    confirm_password: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v


class ProviderRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    confirm_password: str
    business_name: Optional[str] = None
    service_category_id: Optional[int] = None
    services_offered: Optional[str] = None
    experience: Optional[int] = 0
    service_location: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v


class LoginRequest(BaseModel):
    email_or_phone: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: str
    email: str
    phone: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserOut(UserBase):
    id: int
    role: UserRole
    is_active: bool
    profile_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Service Category Schemas ─────────────────────────────────────────────────

class ServiceCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None

class ServiceCategoryCreate(ServiceCategoryBase):
    pass

class ServiceCategoryOut(ServiceCategoryBase):
    id: int
    is_active: bool
    is_custom: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Provider Schemas ─────────────────────────────────────────────────────────

class ProviderBase(BaseModel):
    business_name: Optional[str] = None
    service_category_id: Optional[int] = None
    services_offered: Optional[str] = None
    experience: Optional[int] = 0
    description: Optional[str] = None
    service_location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ProviderUpdate(ProviderBase):
    pass

class ProviderOut(ProviderBase):
    id: int
    user_id: int
    verification_status: VerificationStatus
    availability_status: AvailabilityStatus
    rating: float
    total_ratings: int
    total_earnings: float
    created_at: datetime
    user: Optional[UserOut] = None
    service_category: Optional[ServiceCategoryOut] = None

    class Config:
        from_attributes = True

class AvailabilityUpdate(BaseModel):
    status: AvailabilityStatus


# ─── Service Request Schemas ──────────────────────────────────────────────────

class ServiceRequestCreate(BaseModel):
    service_category_id: int
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    additional_notes: Optional[str] = None

class ServiceRequestOut(BaseModel):
    id: int
    user_id: int
    provider_id: Optional[int] = None
    service_category_id: int
    description: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_date: Optional[str] = None
    preferred_time: Optional[str] = None
    additional_notes: Optional[str] = None
    status: RequestStatus
    estimated_amount: Optional[float] = None
    created_at: datetime
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    user: Optional[UserOut] = None
    provider: Optional[ProviderOut] = None
    service_category: Optional[ServiceCategoryOut] = None

    class Config:
        from_attributes = True


# ─── Review Schemas ───────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    request_id: int
    rating: int
    review: Optional[str] = None

    @validator("rating")
    def rating_range(cls, v):
        if not 1 <= v <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return v

class ReviewOut(BaseModel):
    id: int
    request_id: int
    user_id: int
    provider_id: int
    rating: int
    review: Optional[str] = None
    created_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ─── Notification Schemas ─────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    provider_id: Optional[int] = None
    request_id: Optional[int] = None
    message: str
    notification_type: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Admin Schemas ────────────────────────────────────────────────────────────

class AnalyticsOut(BaseModel):
    total_users: int
    total_providers: int
    active_providers: int
    pending_providers: int
    total_requests: int
    completed_services: int
    cancelled_services: int
    searching_requests: int
    active_requests: int
