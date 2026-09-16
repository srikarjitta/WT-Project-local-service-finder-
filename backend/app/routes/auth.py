from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User, Provider, ProviderService, ServiceCategory, UserRole, VerificationStatus
from app.schemas.schemas import UserRegister, ProviderRegister, LoginRequest, Token
from app.auth.auth import get_password_hash, verify_password, create_access_token, get_current_user
import os, shutil, uuid

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register/user", response_model=Token)
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    # Check existing email
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=get_password_hash(data.password),
        role=UserRole.user,
        location=data.location,
        latitude=data.latitude,
        longitude=data.longitude,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return Token(access_token=token, token_type="bearer", role=user.role.value, user_id=user.id)


@router.post("/register/provider", response_model=Token)
def register_provider(data: ProviderRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")

    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password_hash=get_password_hash(data.password),
        role=UserRole.provider,
        location=data.service_location,
        latitude=data.latitude,
        longitude=data.longitude,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    provider = Provider(
        user_id=user.id,
        business_name=data.business_name or data.name,
        service_category_id=data.service_category_id,
        services_offered=data.services_offered,
        experience=data.experience or 0,
        description=data.description,
        service_location=data.service_location,
        latitude=data.latitude,
        longitude=data.longitude,
        verification_status=VerificationStatus.approved,  # no admin needed
    )
    db.add(provider)
    db.commit()
    db.refresh(provider)

    # If a service category was chosen, auto-add to provider_services
    if data.service_category_id:
        ps = ProviderService(provider_id=provider.id, service_category_id=data.service_category_id)
        db.add(ps)
        db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return Token(access_token=token, token_type="bearer", role=user.role.value, user_id=user.id)


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            (User.email == data.email_or_phone) | (User.phone == data.email_or_phone)
        )
        .first()
    )
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return Token(access_token=token, token_type="bearer", role=user.role.value, user_id=user.id)


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.value,
        "location": current_user.location,
        "latitude": current_user.latitude,
        "longitude": current_user.longitude,
        "profile_image": current_user.profile_image,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }
    if current_user.role.value == "provider" and current_user.provider_profile:
        p = current_user.provider_profile
        # Get provider services list
        pservices = [
            {"id": ps.service_category_id, "name": ps.service_category.name, "icon": ps.service_category.icon, "ps_id": ps.id}
            for ps in p.provider_services if ps.service_category
        ]
        result["provider"] = {
            "id": p.id,
            "business_name": p.business_name,
            "service_category_id": p.service_category_id,
            "services_offered": p.services_offered,
            "experience": p.experience,
            "description": p.description,
            "service_location": p.service_location,
            "verification_status": p.verification_status.value,
            "availability_status": p.availability_status.value,
            "rating": p.rating,
            "total_ratings": p.total_ratings,
            "total_earnings": p.total_earnings,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "provider_services": pservices,
        }
    return result


@router.post("/upload-profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    upload_dir = "uploads/profiles"
    os.makedirs(upload_dir, exist_ok=True)
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    path = os.path.join(upload_dir, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    current_user.profile_image = f"/uploads/profiles/{filename}"
    db.commit()
    return {"profile_image": current_user.profile_image}
