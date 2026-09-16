"""
Provider Services Routes
Allows providers to add/remove custom services they offer.
Also includes a service search endpoint for users.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func as sa_func
from typing import List, Optional
import math
from app.database.database import get_db
from app.models.models import (
    Provider, User, UserRole, ProviderService, ServiceCategory,
    AvailabilityStatus, VerificationStatus
)
from app.auth.auth import get_current_user, require_role

router = APIRouter(prefix="/provider-services", tags=["provider-services"])

# ─────────────────────────────────────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────────────────────────────────────

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ─────────────────────────────────────────────────────────────────────────────
# GET /provider-services/my — list current provider's services
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/my")
def get_my_services(
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    rows = (
        db.query(ProviderService)
        .options(joinedload(ProviderService.service_category))
        .filter(ProviderService.provider_id == provider.id)
        .all()
    )
    return [
        {
            "ps_id": r.id,
            "service_id": r.service_category_id,
            "name": r.service_category.name if r.service_category else "",
            "icon": r.service_category.icon if r.service_category else "🛠️",
            "is_custom": r.service_category.is_custom if r.service_category else False,
        }
        for r in rows
    ]


# ─────────────────────────────────────────────────────────────────────────────
# POST /provider-services/add — add a service (existing or new custom)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/add")
def add_provider_service(
    data: dict,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    """
    Accepts: { service_id?: int, service_name?: str }
    If service_id given → link existing.
    If only service_name → create custom ServiceCategory + link.
    """
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    service_id = data.get("service_id")
    service_name = (data.get("service_name") or "").strip()

    if not service_id and not service_name:
        raise HTTPException(status_code=400, detail="Provide service_id or service_name")

    if service_id:
        cat = db.query(ServiceCategory).filter(ServiceCategory.id == service_id).first()
        if not cat:
            raise HTTPException(status_code=404, detail="Service not found")
    else:
        # Find or create
        cat = db.query(ServiceCategory).filter(
            sa_func.lower(ServiceCategory.name) == service_name.lower()
        ).first()
        if not cat:
            cat = ServiceCategory(
                name=service_name,
                icon="🛠️",
                is_custom=True,
                is_active=True,
                created_by=current_user.id,
            )
            db.add(cat)
            db.commit()
            db.refresh(cat)

    # Check if already linked
    existing = db.query(ProviderService).filter(
        ProviderService.provider_id == provider.id,
        ProviderService.service_category_id == cat.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service already added")

    ps = ProviderService(provider_id=provider.id, service_category_id=cat.id)
    db.add(ps)
    db.commit()
    db.refresh(ps)

    return {
        "ps_id": ps.id,
        "service_id": cat.id,
        "name": cat.name,
        "icon": cat.icon,
        "is_custom": cat.is_custom,
    }


# ─────────────────────────────────────────────────────────────────────────────
# DELETE /provider-services/{ps_id} — remove a service link
# ─────────────────────────────────────────────────────────────────────────────

@router.delete("/{ps_id}")
def remove_provider_service(
    ps_id: int,
    current_user: User = Depends(require_role(UserRole.provider)),
    db: Session = Depends(get_db),
):
    provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")

    ps = db.query(ProviderService).filter(
        ProviderService.id == ps_id,
        ProviderService.provider_id == provider.id,
    ).first()
    if not ps:
        raise HTTPException(status_code=404, detail="Service link not found")

    db.delete(ps)
    db.commit()
    return {"message": "Service removed"}


# ─────────────────────────────────────────────────────────────────────────────
# GET /provider-services/search-catalog — search all services (default+custom)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/search-catalog")
def search_catalog(
    q: str = Query("", min_length=0),
    db: Session = Depends(get_db),
):
    """Search service categories (for provider add-service dropdown)."""
    query = db.query(ServiceCategory).filter(ServiceCategory.is_active == True)
    if q:
        query = query.filter(ServiceCategory.name.ilike(f"%{q}%"))
    results = query.order_by(ServiceCategory.is_custom, ServiceCategory.name).limit(20).all()
    return [
        {"id": c.id, "name": c.name, "icon": c.icon or "🛠️", "is_custom": c.is_custom}
        for c in results
    ]


# ─────────────────────────────────────────────────────────────────────────────
# GET /provider-services/search-providers — user searches for a service
# Returns matching providers (nearby if lat/lon provided)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/search-providers")
def search_providers(
    q: str = Query("", min_length=1),
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    radius_km: float = 50.0,
    db: Session = Depends(get_db),
):
    """
    Search across all service categories (including custom) by name.
    Returns nearby online providers who offer matching services.
    """
    if not q.strip():
        return []

    # Find matching service categories
    matching_cats = db.query(ServiceCategory).filter(
        ServiceCategory.is_active == True,
        ServiceCategory.name.ilike(f"%{q}%"),
    ).all()
    if not matching_cats:
        return []

    cat_ids = [c.id for c in matching_cats]

    # Find providers linked to those services (via provider_services OR legacy service_category_id)
    providers_via_ps = (
        db.query(Provider)
        .join(ProviderService, ProviderService.provider_id == Provider.id)
        .filter(ProviderService.service_category_id.in_(cat_ids))
        .options(joinedload(Provider.user), joinedload(Provider.service_category))
        .filter(
            Provider.availability_status == AvailabilityStatus.online,
            Provider.verification_status == VerificationStatus.approved,
        )
        .distinct()
        .all()
    )

    providers_via_cat = (
        db.query(Provider)
        .filter(
            Provider.service_category_id.in_(cat_ids),
            Provider.availability_status == AvailabilityStatus.online,
            Provider.verification_status == VerificationStatus.approved,
        )
        .options(joinedload(Provider.user), joinedload(Provider.service_category))
        .all()
    )

    # Merge deduped
    seen = set()
    all_providers = []
    for p in providers_via_ps + providers_via_cat:
        if p.id not in seen:
            seen.add(p.id)
            all_providers.append(p)

    # Build result with distance
    results = []
    for p in all_providers:
        dist = None
        if lat and lon and p.latitude and p.longitude:
            dist = round(haversine(lat, lon, p.latitude, p.longitude), 2)
            if dist > radius_km:
                continue

        # Find which matched service this provider offers
        matched_service = None
        for ps in p.provider_services:
            if ps.service_category_id in cat_ids:
                matched_service = ps.service_category
                break
        if not matched_service and p.service_category_id in cat_ids:
            matched_service = p.service_category

        results.append({
            "id": p.id,
            "user_id": p.user_id,
            "business_name": p.business_name,
            "experience": p.experience,
            "rating": p.rating,
            "total_ratings": p.total_ratings,
            "distance_km": dist,
            "availability_status": p.availability_status.value,
            "service_category_id": matched_service.id if matched_service else p.service_category_id,
            "matched_service_name": matched_service.name if matched_service else q,
            "matched_service_icon": matched_service.icon if matched_service else "🛠️",
            "user": {
                "name": p.user.name if p.user else None,
                "phone": p.user.phone if p.user else None,
                "profile_image": p.user.profile_image if p.user else None,
            } if p.user else None,
        })

    # Sort: nearby first, then by rating
    results.sort(key=lambda x: (x["distance_km"] if x["distance_km"] is not None else 9999, -x["rating"]))
    return results
