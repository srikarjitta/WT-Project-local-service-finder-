from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.models.models import Review, ServiceRequest, Provider, User, UserRole, RequestStatus
from app.schemas.schemas import ReviewCreate, ReviewOut
from app.auth.auth import get_current_user, require_role

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("")
def create_review(
    data: ReviewCreate,
    current_user: User = Depends(require_role(UserRole.user)),
    db: Session = Depends(get_db),
):
    req = db.query(ServiceRequest).filter(
        ServiceRequest.id == data.request_id,
        ServiceRequest.user_id == current_user.id,
        ServiceRequest.status == RequestStatus.service_completed,
    ).first()
    if not req:
        raise HTTPException(status_code=400, detail="Cannot review this request")

    existing = db.query(Review).filter(Review.request_id == data.request_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already reviewed")

    review = Review(
        request_id=data.request_id,
        user_id=current_user.id,
        provider_id=req.provider_id,
        rating=data.rating,
        review=data.review,
    )
    db.add(review)

    # Update provider rating
    provider = db.query(Provider).filter(Provider.id == req.provider_id).first()
    if provider:
        total = provider.rating * provider.total_ratings + data.rating
        provider.total_ratings += 1
        provider.rating = round(total / provider.total_ratings, 2)

    db.commit()
    db.refresh(review)
    return {"id": review.id, "rating": review.rating, "review": review.review}


@router.get("/my")
def get_my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.user:
        reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    else:
        provider = db.query(Provider).filter(Provider.user_id == current_user.id).first()
        reviews = db.query(Review).filter(Review.provider_id == provider.id).all() if provider else []
    return reviews
