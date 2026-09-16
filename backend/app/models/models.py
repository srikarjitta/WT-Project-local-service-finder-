from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database.database import Base


class UserRole(str, enum.Enum):
    user = "user"
    provider = "provider"


class VerificationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class AvailabilityStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    busy = "busy"


class RequestStatus(str, enum.Enum):
    searching = "searching"
    accepted = "accepted"
    provider_arriving = "provider_arriving"
    service_started = "service_started"
    service_completed = "service_completed"
    cancelled = "cancelled"
    no_provider_found = "no_provider_found"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.user)
    location = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    profile_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    service_requests = relationship("ServiceRequest", back_populates="user", foreign_keys="ServiceRequest.user_id")
    notifications = relationship("Notification", back_populates="user", foreign_keys="Notification.user_id")
    reviews_given = relationship("Review", back_populates="user", foreign_keys="Review.user_id")
    provider_profile = relationship("Provider", back_populates="user", uselist=False)


class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_custom = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    providers = relationship("Provider", back_populates="service_category")
    service_requests = relationship("ServiceRequest", back_populates="service_category")
    provider_services = relationship("ProviderService", back_populates="service_category")


class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    service_category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=True)
    business_name = Column(String(255), nullable=True)
    experience = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    services_offered = Column(Text, nullable=True)
    service_location = Column(String(500), nullable=True)
    id_verification = Column(String(500), nullable=True)
    # Auto-approved — no admin needed
    verification_status = Column(SAEnum(VerificationStatus), default=VerificationStatus.approved)
    availability_status = Column(SAEnum(AvailabilityStatus), default=AvailabilityStatus.offline)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="provider_profile")
    service_category = relationship("ServiceCategory", back_populates="providers")
    service_requests = relationship("ServiceRequest", back_populates="provider", foreign_keys="ServiceRequest.provider_id")
    reviews = relationship("Review", back_populates="provider", foreign_keys="Review.provider_id")
    notifications = relationship("Notification", back_populates="provider", foreign_keys="Notification.provider_id")
    # Many-to-many via ProviderService
    provider_services = relationship("ProviderService", back_populates="provider", cascade="all, delete-orphan")


class ProviderService(Base):
    """Links a provider to the services they offer (including custom ones)."""
    __tablename__ = "provider_services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    service_category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    provider = relationship("Provider", back_populates="provider_services")
    service_category = relationship("ServiceCategory", back_populates="provider_services")


class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=True)
    service_category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    preferred_date = Column(String(50), nullable=True)
    preferred_time = Column(String(50), nullable=True)
    additional_notes = Column(Text, nullable=True)
    status = Column(SAEnum(RequestStatus), default=RequestStatus.searching)
    estimated_amount = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="service_requests", foreign_keys=[user_id])
    provider = relationship("Provider", back_populates="service_requests", foreign_keys=[provider_id])
    service_category = relationship("ServiceCategory", back_populates="service_requests")
    review = relationship("Review", back_populates="service_request", uselist=False)
    notifications = relationship("Notification", back_populates="service_request")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    review = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    service_request = relationship("ServiceRequest", back_populates="review")
    user = relationship("User", back_populates="reviews_given", foreign_keys=[user_id])
    provider = relationship("Provider", back_populates="reviews", foreign_keys=[provider_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=True)
    request_id = Column(Integer, ForeignKey("service_requests.id"), nullable=True)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications", foreign_keys=[user_id])
    provider = relationship("Provider", back_populates="notifications", foreign_keys=[provider_id])
    service_request = relationship("ServiceRequest", back_populates="notifications")
