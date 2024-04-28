from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from .api.router import router, create_appointment_type, create_status, create_staff_type
from .models import AppointmentType, Status, StaffType
from .database import engine, Base, SessionLocal
from config import load_config

def lifespan(app: FastAPI):
    db_init()
    yield
    db = SessionLocal()
    db.close()

app = FastAPI(lifespan = lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

def db_init():
    # Create a new database session
    db = SessionLocal()
    print("Checking for existing database tables per config")
    try:
        # Load database if not already loaded
        Base.metadata.create_all(bind=engine)

        # Load configuration
        config = load_config()

        # Populate appointment types
        if db.query(AppointmentType).count() == 0:
            print("Populating appointment types")
            for item in config['appointment_types']:
                create_appointment_type(AppointmentType(**item), db)
        
        # Populate statuses
        if db.query(Status).count() == 0:
            print("Populating statuses")
            for item in config['appointment_statuses']:
                create_status(Status(**item), db)
        
        # Populate staff types
        if db.query(StaffType).count() == 0:
            print("Populating staff types")
            for item in config['staff_types']:
                create_staff_type(StaffType(**item), db)
    finally:
        print("Initial database setup complete. Closing session.")
        db.close()