from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.database.database import engine, SessionLocal
from app.models.models import Base, User, Provider, ProviderService, ServiceCategory, UserRole, VerificationStatus, AvailabilityStatus
from app.auth.auth import get_password_hash
from app.routes import auth, services, providers, requests, reviews, notifications
from app.routes import provider_services as provider_services_router


def seed_database():
    """Create initial seed data if DB is empty."""
    db = SessionLocal()
    try:
        # Seed service categories
        categories = [
            ("Electrician", "Electrical repairs and installations", "⚡"),
            ("Plumber", "Plumbing repairs and services", "🔧"),
            ("Carpenter", "Carpentry and woodwork", "🪚"),
            ("Cleaning", "Home and office cleaning services", "🧹"),
            ("AC Repair", "Air conditioner repair and maintenance", "❄️"),
            ("Appliance Repair", "Home appliance repair services", "🔌"),
            ("Computer/Laptop Repair", "Computer and laptop repair", "💻"),
            ("Mobile Repair", "Mobile phone repair services", "📱"),
            ("Vehicle Service", "Vehicle maintenance and repair", "🚗"),
            ("Home Maintenance", "General home maintenance", "🏠"),
            ("Tutor", "Home tutoring services", "📚"),
            ("Other", "Other local services", "🛠️"),
        ]
        existing = db.query(ServiceCategory).count()
        if existing == 0:
            for name, desc, icon in categories:
                cat = ServiceCategory(name=name, description=desc, icon=icon)
                db.add(cat)
            db.commit()

        # Seed demo user
        demo_user = db.query(User).filter(User.email == "user@demo.com").first()
        if not demo_user:
            demo_user = User(
                name="Priya Sharma",
                email="user@demo.com",
                phone="9111111111",
                password_hash=get_password_hash("demo123"),
                role=UserRole.user,
                location="Jubilee Hills, Hyderabad",
                latitude=17.4326,
                longitude=78.4071,
                is_active=True,
            )
            db.add(demo_user)
            db.commit()

        # Seed demo provider
        demo_provider_user = db.query(User).filter(User.email == "provider@demo.com").first()
        if not demo_provider_user:
            cat = db.query(ServiceCategory).filter(ServiceCategory.name == "Electrician").first()
            demo_provider_user = User(
                name="Ravi Kumar",
                email="provider@demo.com",
                phone="9222222222",
                password_hash=get_password_hash("demo123"),
                role=UserRole.provider,
                location="Banjara Hills, Hyderabad",
                latitude=17.4239,
                longitude=78.4738,
                is_active=True,
            )
            db.add(demo_provider_user)
            db.commit()
            demo_provider = Provider(
                user_id=demo_provider_user.id,
                service_category_id=cat.id if cat else 1,
                business_name="Ravi Electricals",
                experience=8,
                description="Expert electrician with 8 years of experience. Specializes in wiring, repairs and installations.",
                services_offered="Wiring, Switches, Fan installation, AC fitting, Panel repair",
                service_location="Banjara Hills, Hyderabad",
                latitude=17.4239,
                longitude=78.4738,
                verification_status=VerificationStatus.approved,
                availability_status=AvailabilityStatus.offline,
                rating=4.8,
                total_ratings=52,
            )
            db.add(demo_provider)
            db.commit()
            db.refresh(demo_provider)
            # Link provider to Electrician service
            if cat:
                db.add(ProviderService(provider_id=demo_provider.id, service_category_id=cat.id))
                db.commit()

        # Seed a second demo provider - Plumber
        demo_plumber = db.query(User).filter(User.email == "plumber@demo.com").first()
        if not demo_plumber:
            plumb_cat = db.query(ServiceCategory).filter(ServiceCategory.name == "Plumber").first()
            demo_plumber = User(
                name="Suresh Reddy",
                email="plumber@demo.com",
                phone="9333333333",
                password_hash=get_password_hash("demo123"),
                role=UserRole.provider,
                location="Madhapur, Hyderabad",
                latitude=17.4477,
                longitude=78.3929,
                is_active=True,
            )
            db.add(demo_plumber)
            db.commit()
            plumb_provider = Provider(
                user_id=demo_plumber.id,
                service_category_id=plumb_cat.id if plumb_cat else 2,
                business_name="Suresh Plumbing Works",
                experience=5,
                description="Professional plumber with 5 years of experience.",
                services_offered="Pipe repair, Leak fixing, Tap installation, Drainage",
                service_location="Madhapur, Hyderabad",
                latitude=17.4477,
                longitude=78.3929,
                verification_status=VerificationStatus.approved,
                availability_status=AvailabilityStatus.offline,
                rating=4.5,
                total_ratings=31,
            )
            db.add(plumb_provider)
            db.commit()
            db.refresh(plumb_provider)
            # Link provider to Plumber service
            if plumb_cat:
                db.add(ProviderService(provider_id=plumb_provider.id, service_category_id=plumb_cat.id))
                db.commit()

    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield


app = FastAPI(
    title="Local Service Finder API",
    description="On-demand local service marketplace API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(services.router)
app.include_router(providers.router)
app.include_router(requests.router)
app.include_router(reviews.router)
app.include_router(notifications.router)
app.include_router(provider_services_router.router)


@app.get("/")
def root():
    return {
        "message": "Local Service Finder API",
        "version": "1.0.0",
        "docs": "/docs",
        "demo_credentials": {
            "user": {"email": "user@demo.com", "password": "demo123"},
            "provider": {"email": "provider@demo.com", "password": "demo123"},
            "plumber": {"email": "plumber@demo.com", "password": "demo123"},
        }
    }


@app.get("/health")
def health():
    return {"status": "ok"}
