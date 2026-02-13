from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully!")

def seed_demo_user():
    """Create demo user if it doesn't exist"""
    from app.models.models import User
    from app.utils.auth import get_password_hash
    
    db = SessionLocal()
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.username == "demo_farmer").first()
        if not demo_user:
            demo_user = User(
                username="demo_farmer",
                email="demo@agriculture.com",
                hashed_password=get_password_hash("demo123"),
                full_name="Demo Farmer",
                phone="1234567890",
                location="Demo Location",
                language="en",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
            print("✅ Demo user created: demo_farmer / demo123")
        else:
            print("ℹ️  Demo user already exists")
    except Exception as e:
        print(f"⚠️  Error creating demo user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
