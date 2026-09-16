from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import ServiceCategory
from app.schemas.schemas import ServiceCategoryOut

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=List[ServiceCategoryOut])
def get_services(db: Session = Depends(get_db)):
    return db.query(ServiceCategory).filter(
        ServiceCategory.is_active == True,
        ServiceCategory.is_custom == False
    ).all()
