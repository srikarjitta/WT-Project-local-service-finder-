from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.models.models import User, Provider, ServiceRequest, UserRole, VerificationStatus, RequestStatus
from app.schemas.schemas import AnalyticsOut
from app.auth.auth import require_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def get_users(
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    users = db.query(User).filter(User.role == UserRole.user).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "phone": u.phone,
            "location": u.location,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@router.post("/users/{user_id}/toggle")
def toggle_user(
    user_id: int,
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"is_active": user.is_active}


@router.get("/providers")
def get_providers(
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    providers = db.query(Provider).options(
        joinedload(Provider.user), joinedload(Provider.service_category)
    ).order_by(Provider.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "business_name": p.business_name,
            "experience": p.experience,
            "verification_status": p.verification_status.value,
            "availability_status": p.availability_status.value,
            "rating": p.rating,
            "total_ratings": p.total_ratings,
            "total_earnings": p.total_earnings,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "user": {
                "name": p.user.name if p.user else None,
                "email": p.user.email if p.user else None,
                "phone": p.user.phone if p.user else None,
                "is_active": p.user.is_active if p.user else True,
            } if p.user else None,
            "service_category": {
                "name": p.service_category.name if p.service_category else "N/A",
            } if p.service_category else None,
        }
        for p in providers
    ]


@router.post("/providers/{provider_id}/approve")
def approve_provider(
    provider_id: int,
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider.verification_status = VerificationStatus.approved
    db.commit()
    return {"verification_status": "approved"}


@router.post("/providers/{provider_id}/reject")
def reject_provider(
    provider_id: int,
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.id == provider_id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider.verification_status = VerificationStatus.rejected
    db.commit()
    return {"verification_status": "rejected"}


@router.post("/providers/{provider_id}/toggle")
def toggle_provider(
    provider_id: int,
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).options(joinedload(Provider.user)).filter(Provider.id == provider_id).first()
    if not provider or not provider.user:
        raise HTTPException(status_code=404, detail="Provider not found")
    provider.user.is_active = not provider.user.is_active
    db.commit()
    return {"is_active": provider.user.is_active}


@router.get("/requests")
def get_all_requests(
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    requests = db.query(ServiceRequest).options(
        joinedload(ServiceRequest.user),
        joinedload(ServiceRequest.provider).joinedload(Provider.user),
        joinedload(ServiceRequest.service_category),
    ).order_by(ServiceRequest.created_at.desc()).limit(200).all()
    return [
        {
            "id": r.id,
            "status": r.status.value,
            "description": r.description,
            "location": r.location,
            "estimated_amount": r.estimated_amount,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None,
            "user_name": r.user.name if r.user else "N/A",
            "provider_name": r.provider.business_name if r.provider else "N/A",
            "category_name": r.service_category.name if r.service_category else "N/A",
        }
        for r in requests
    ]


@router.get("/analytics")
def get_analytics(
    current_user=Depends(require_role(UserRole.admin)),
    db: Session = Depends(get_db),
):
    total_users = db.query(User).filter(User.role == UserRole.user).count()
    total_providers = db.query(Provider).count()
    active_providers = db.query(Provider).filter(
        Provider.availability_status == "online",
        Provider.verification_status == "approved",
    ).count()
    pending_providers = db.query(Provider).filter(Provider.verification_status == "pending").count()
    total_requests = db.query(ServiceRequest).count()
    completed = db.query(ServiceRequest).filter(ServiceRequest.status == RequestStatus.service_completed).count()
    cancelled = db.query(ServiceRequest).filter(ServiceRequest.status == RequestStatus.cancelled).count()
    searching = db.query(ServiceRequest).filter(ServiceRequest.status == RequestStatus.searching).count()
    active = db.query(ServiceRequest).filter(
        ServiceRequest.status.in_([RequestStatus.accepted, RequestStatus.provider_arriving, RequestStatus.service_started])
    ).count()

    # Revenue
    from sqlalchemy import func
    revenue_result = db.query(func.sum(ServiceRequest.estimated_amount)).filter(
        ServiceRequest.status == RequestStatus.service_completed
    ).scalar()
    revenue = float(revenue_result or 0)

    return {
        "total_users": total_users,
        "total_providers": total_providers,
        "active_providers": active_providers,
        "pending_providers": pending_providers,
        "total_requests": total_requests,
        "completed_services": completed,
        "cancelled_services": cancelled,
        "searching_requests": searching,
        "active_requests": active,
        "total_revenue": revenue,
    }
