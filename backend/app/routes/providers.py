from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import math
from app.database.database import get_db
from app.models.models import Provider, User, UserRole, AvailabilityStatus, VerificationStatus
from app.schemas.schemas import ProviderOut, ProviderUpdate, AvailabilityUpdate
from app.auth.auth import get_current_user, require_role

router = APIRouter(prefix="/providers", tags=["providers"])


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


@router.get("", response_model=List[ProviderOut])
def get_providers(
    category_id: Optional[int] = None,
    verification_status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Provider).options(joinedload(Provider.user), joinedload(Provider.service_category))
    if category_id:
        query = query.filter(Provider.service_category_id == category_id)
    if verification_status:
        query = query.filter(Provider.verification_status == verification_status)
    return query.all()


@router.get("/nearby")
def get_nearby_providers(
    lat: float,
    lon: float,
    category_id: Optional[int] = None,
    radius_km: float = 20.0,
    db: Session = Depends(get_db),
):
    query = db.query(Provider).options(joinedload(Provider.user), joinedload(Provider.service_category)).filter(
        Provider.availability_status == AvailabilityStatus.online,
        Provider.verification_status == VerificationStatus.approved,
    )
    if category_id:
        query = query.filter(Provider.service_category_id == category_id)

    providers = query.all()
    nearby = []
    for p in providers:
        if p.latitude and p.longitude:
            dist = haversine(lat, lon, p.latitude, p.longitude)
            if dist <= radius_km:
                nearby.append({"provider": p, "distance_km": round(dist, 2)})

    nearby.sort(key=lambda x: x["distance_km"])
    return [
        {
            "id": item["provider"].id,
            "user_id": item["provider"].user_id,
            "business_name": item["provider"].business_name,
            "rating": item["provider"].rating,
            "experience": item["provider"].experience,
            "distance_km": item["distance_km"],
            "availability_status": item["provider"].availability_status.value,
            "verification_status": item["provider"].verification_status.value,
            "user": {
                "name": item["provider"].user.name,
                "phone": item["provider"].user.phone,
                "profile_image": item["provider"].user.profile_image,
            } if item["provider"].user else None,
            "service_category": {
                "name": item["provider"].service_category.name,
                "icon": item["provider"].service_category.icon,
            } if item["provider"].service_category else None,
        }
        for item in nearby
    ]


@router.get("/{provider_id}")
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    p = db.query(Provider).options(
        joinedload(Provider.user), joinedload(Provider.service_category)
    ).filter(Provider.id == provider_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Provider not found")
    return p


@router.put("/availability", status_code=200)
def update_availability(
    data: AvailabilityUpdate,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    provider.availability_status = data.status
    db.commit()
    return {"availability_status": provider.availability_status.value}


@router.put("/profile", status_code=200)
def update_provider_profile(
    data: ProviderUpdate,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    for k, v in data.dict(exclude_none=True).items():
        setattr(provider, k, v)
    db.commit()
    return {"message": "Profile updated"}


@router.get("/{provider_id}/reviews")
def get_provider_reviews(provider_id: int, db: Session = Depends(get_db)):
    from app.models.models import Review
    reviews = db.query(Review).options(joinedload(Review.user)).filter(Review.provider_id == provider_id).all()
    return [
        {
            "id": r.id,
            "rating": r.rating,
            "review": r.review,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "user_name": r.user.name if r.user else "Anonymous",
        }
        for r in reviews
    ]
