from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.models import Notification, Provider


def create_notification(
    db: Session,
    message: str,
    notification_type: str = "info",
    user_id: Optional[int] = None,
    provider_id: Optional[int] = None,
    request_id: Optional[int] = None,
):
    notif = Notification(
        user_id=user_id,
        provider_id=provider_id,
        request_id=request_id,
        message=message,
        notification_type=notification_type,
        is_read=False,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def notify_nearby_providers(db: Session, request, service_category_id: int):
    """Find online/available providers offering the given category (via provider_services) and notify."""
    from app.models.models import ProviderService
    # Providers linked via provider_services many-to-many
    providers_via_ps = (
        db.query(Provider)
        .join(ProviderService, ProviderService.provider_id == Provider.id)
        .filter(
            ProviderService.service_category_id == service_category_id,
            Provider.availability_status == "online",
            Provider.verification_status == "approved",
        )
        .all()
    )
    # Also legacy single-category providers
    providers_legacy = (
        db.query(Provider)
        .filter(
            Provider.service_category_id == service_category_id,
            Provider.availability_status == "online",
            Provider.verification_status == "approved",
        )
        .all()
    )
    seen = set()
    all_providers = []
    for p in providers_via_ps + providers_legacy:
        if p.id not in seen:
            seen.add(p.id)
            all_providers.append(p)

    for provider in all_providers:
        create_notification(
            db,
            message=f"New service request: {request.description[:80]}",
            notification_type="new_request",
            provider_id=provider.id,
            request_id=request.id,
        )
    return all_providers
