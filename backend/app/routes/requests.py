from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_
from typing import List, Optional
from datetime import datetime
from app.database.database import get_db
from app.models.models import (
    ServiceRequest, Provider, ProviderService, User, UserRole, RequestStatus,
    AvailabilityStatus, VerificationStatus
)
from app.schemas.schemas import ServiceRequestCreate, ServiceRequestOut
from app.auth.auth import get_current_user, require_role
from app.services.notification_service import create_notification, notify_nearby_providers
import random

router = APIRouter(prefix="/requests", tags=["requests"])

CATEGORY_PRICE_MAP = {
    1: (300, 800),   # Electrician
    2: (200, 600),   # Plumber
    3: (400, 1200),  # Carpenter
    4: (500, 1500),  # Cleaning
    5: (500, 2000),  # AC Repair
    6: (200, 800),   # Appliance Repair
    7: (300, 1000),  # Computer Repair
    8: (200, 700),   # Mobile Repair
    9: (300, 1500),  # Vehicle Service
    10: (200, 600),  # Home Maintenance
    11: (300, 1000), # Tutor
    12: (150, 500),  # Other
}


def _serialize_request(r: ServiceRequest) -> dict:
    provider_data = None
    if r.provider:
        provider_data = {
            "id": r.provider.id,
            "user_id": r.provider.user_id,
            "business_name": r.provider.business_name,
            "rating": r.provider.rating,
            "experience": r.provider.experience,
            "description": r.provider.description,
            "verification_status": r.provider.verification_status.value,
            "availability_status": r.provider.availability_status.value,
            "latitude": r.provider.latitude,
            "longitude": r.provider.longitude,
            "user": {
                "id": r.provider.user.id if r.provider.user else None,
                "name": r.provider.user.name if r.provider.user else None,
                "phone": r.provider.user.phone if r.provider.user else None,
                "profile_image": r.provider.user.profile_image if r.provider.user else None,
            } if r.provider.user else None,
        }
    return {
        "id": r.id,
        "user_id": r.user_id,
        "provider_id": r.provider_id,
        "service_category_id": r.service_category_id,
        "description": r.description,
        "location": r.location,
        "latitude": r.latitude,
        "longitude": r.longitude,
        "preferred_date": r.preferred_date,
        "preferred_time": r.preferred_time,
        "additional_notes": r.additional_notes,
        "status": r.status.value,
        "estimated_amount": r.estimated_amount,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "accepted_at": r.accepted_at.isoformat() if r.accepted_at else None,
        "completed_at": r.completed_at.isoformat() if r.completed_at else None,
        "user": {
            "id": r.user.id if r.user else None,
            "name": r.user.name if r.user else None,
            "phone": r.user.phone if r.user else None,
            "location": r.user.location if r.user else None,
            "profile_image": r.user.profile_image if r.user else None,
        } if r.user else None,
        "provider": provider_data,
        "service_category": {
            "id": r.service_category.id if r.service_category else None,
            "name": r.service_category.name if r.service_category else None,
            "icon": r.service_category.icon if r.service_category else None,
        } if r.service_category else None,
    }


@router.post("")
def create_request(
    data: ServiceRequestCreate,
    current_user: User = Depends(require_role(UserRole.user)),
    db: Session = Depends(get_db),
):
    price_range = CATEGORY_PRICE_MAP.get(data.service_category_id, (200, 500))
    estimated = random.randint(*price_range)

    req = ServiceRequest(
        user_id=current_user.id,
        service_category_id=data.service_category_id,
        description=data.description,
        location=data.location,
        latitude=data.latitude,
        longitude=data.longitude,
        preferred_date=data.preferred_date,
        preferred_time=data.preferred_time,
        additional_notes=data.additional_notes,
        status=RequestStatus.searching,
        estimated_amount=estimated,
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # Notify user
    create_notification(
        db,
        message="Your service request has been submitted. Searching for nearby providers...",
        notification_type="request_submitted",
        user_id=current_user.id,
        request_id=req.id,
    )

    # Notify nearby providers
    notify_nearby_providers(db, req, data.service_category_id)

    # Reload with relationships
    req = db.query(ServiceRequest).options(
        joinedload(ServiceRequest.user),
        joinedload(ServiceRequest.provider).joinedload(Provider.user),
        joinedload(ServiceRequest.service_category),
    ).filter(ServiceRequest.id == req.id).first()

    return _serialize_request(req)


@router.get("")
def get_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.user:
        requests = db.query(ServiceRequest).options(
            joinedload(ServiceRequest.user),
            joinedload(ServiceRequest.provider).joinedload(Provider.user),
            joinedload(ServiceRequest.service_category),
        ).filter(ServiceRequest.user_id == current_user.id).order_by(ServiceRequest.created_at.desc()).all()
    else:
        # Provider: see searching requests matching ANY of their services + their own accepted
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if not provider:
            return []
        # Collect all service_category_ids the provider offers
        ps_cat_ids = [ps.service_category_id for ps in provider.provider_services]
        if provider.service_category_id and provider.service_category_id not in ps_cat_ids:
            ps_cat_ids.append(provider.service_category_id)

        requests = db.query(ServiceRequest).options(
            joinedload(ServiceRequest.user),
            joinedload(ServiceRequest.provider).joinedload(Provider.user),
            joinedload(ServiceRequest.service_category),
        ).filter(
            or_(
                # Searching requests in any of provider's categories
                (
                    (ServiceRequest.status == RequestStatus.searching) &
                    (ServiceRequest.service_category_id.in_(ps_cat_ids))
                ),
                # Their own assigned requests
                (ServiceRequest.provider_id == provider.id)
            )
        ).order_by(ServiceRequest.created_at.desc()).all()

    return [_serialize_request(r) for r in requests]


@router.get("/{request_id}")
def get_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ServiceRequest).options(
        joinedload(ServiceRequest.user),
        joinedload(ServiceRequest.provider).joinedload(Provider.user),
        joinedload(ServiceRequest.service_category),
    ).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return _serialize_request(req)


@router.post("/{request_id}/accept")
def accept_request(
    request_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    # No admin-approval check — providers are auto-approved
    if provider.availability_status != AvailabilityStatus.online:
        raise HTTPException(status_code=400, detail="Provider must be online to accept requests")

    # Lock row with for_update to prevent race conditions
    req = db.query(ServiceRequest).filter(
        ServiceRequest.id == request_id,
        ServiceRequest.status == RequestStatus.searching,
    ).with_for_update().first()

    if not req:
        raise HTTPException(status_code=400, detail="Request is no longer available")

    req.status = RequestStatus.accepted
    req.provider_id = provider.id
    req.accepted_at = datetime.utcnow()
    provider.availability_status = AvailabilityStatus.busy
    db.commit()

    # Notify user
    create_notification(
        db,
        message=f"Great news! {current_user.name} has accepted your service request.",
        notification_type="request_accepted",
        user_id=req.user_id,
        request_id=req.id,
    )

    req = db.query(ServiceRequest).options(
        joinedload(ServiceRequest.user),
        joinedload(ServiceRequest.provider).joinedload(Provider.user),
        joinedload(ServiceRequest.service_category),
    ).filter(ServiceRequest.id == request_id).first()

    return _serialize_request(req)


@router.post("/{request_id}/reject")
def reject_request(
    request_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    # Just acknowledge, don't change the request status (another provider can still accept)
    return {"message": "Request rejected"}


@router.post("/{request_id}/arriving")
def provider_arriving(
    request_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    req = db.query(ServiceRequest).filter(
        ServiceRequest.id == request_id,
        ServiceRequest.provider_id == provider.id,
        ServiceRequest.status == RequestStatus.accepted,
    ).first()
    if not req:
        raise HTTPException(status_code=400, detail="Cannot update this request")
    req.status = RequestStatus.provider_arriving
    db.commit()
    create_notification(
        db,
        message="Your service provider is on the way!",
        notification_type="provider_arriving",
        user_id=req.user_id,
        request_id=req.id,
    )
    return {"status": req.status.value}


@router.post("/{request_id}/start")
def start_service(
    request_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    req = db.query(ServiceRequest).filter(
        ServiceRequest.id == request_id,
        ServiceRequest.provider_id == provider.id,
        ServiceRequest.status == RequestStatus.provider_arriving,
    ).first()
    if not req:
        raise HTTPException(status_code=400, detail="Cannot update this request")
    req.status = RequestStatus.service_started
    db.commit()
    create_notification(
        db,
        message="Service has started!",
        notification_type="service_started",
        user_id=req.user_id,
        request_id=req.id,
    )
    return {"status": req.status.value}


@router.post("/{request_id}/complete")
def complete_service(
    request_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    req = db.query(ServiceRequest).filter(
        ServiceRequest.id == request_id,
        ServiceRequest.provider_id == provider.id,
        ServiceRequest.status == RequestStatus.service_started,
    ).first()
    if not req:
        raise HTTPException(status_code=400, detail="Cannot update this request")
    req.status = RequestStatus.service_completed
    req.completed_at = datetime.utcnow()
    provider.total_earnings += req.estimated_amount or 0
    provider.availability_status = AvailabilityStatus.online
    db.commit()
    create_notification(
        db,
        message="Service completed! Please rate your experience.",
        notification_type="service_completed",
        user_id=req.user_id,
        request_id=req.id,
    )
    return {"status": req.status.value}


@router.post("/{request_id}/cancel")
def cancel_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status in [RequestStatus.service_completed, RequestStatus.cancelled]:
        raise HTTPException(status_code=400, detail="Cannot cancel this request")

    # Verify ownership
    if current_user.role == UserRole.user and req.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Free provider if assigned
    if req.provider_id:
        provider = db.query(Provider).filter(Provider.id == req.provider_id).first()
        if provider and provider.availability_status == AvailabilityStatus.busy:
            provider.availability_status = AvailabilityStatus.online

    req.status = RequestStatus.cancelled
    db.commit()

    if req.provider_id:
        create_notification(
            db,
            message="The service request has been cancelled by the customer.",
            notification_type="request_cancelled",
            provider_id=req.provider_id,
            request_id=req.id,
        )

    return {"status": "cancelled"}
