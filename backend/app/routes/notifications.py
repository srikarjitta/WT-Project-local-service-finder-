from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Notification, Provider, User, UserRole
from app.auth.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.provider:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if provider:
            notifs = db.query(Notification).filter(
                Notification.provider_id == provider.id
            ).order_by(Notification.created_at.desc()).limit(50).all()
        else:
            notifs = []
    else:
        notifs = db.query(Notification).filter(
            Notification.user_id == current_user.id
        ).order_by(Notification.created_at.desc()).limit(50).all()

    return [
        {
            "id": n.id,
            "message": n.message,
            "notification_type": n.notification_type,
            "is_read": n.is_read,
            "request_id": n.request_id,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifs
    ]


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True}


@router.post("/mark-all-read")
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.provider:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        if provider:
            db.query(Notification).filter(
                Notification.provider_id == provider.id,
                Notification.is_read == False,
            ).update({"is_read": True})
    else:
        db.query(Notification).filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        ).update({"is_read": True})
    db.commit()
    return {"success": True}
