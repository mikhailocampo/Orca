import sys
import os
current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, '../..')
sys.path.insert(0, os.path.abspath(parent_dir))

from datetime import datetime, time
from faker import Faker
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AppointmentBase
from app.models import Appointment, AppointmentLedger, AppointmentType, Patient, Staff, Status, StaffType, auto_assign_attributes
import random

fake = Faker()

def generate_business_hours_time(minute_increment=15):
    # Generate a random hour from 9 to 16 (4 PM), 17 is exclusive to make sure it does not go to 5 PM or later
    hour = random.randint(9, 16)
    # Generate a random minute adjusted by the increment
    # Calculate how many increments fit into an hour
    increments_per_hour = 60 // minute_increment
    # Generate a random index for these increments
    minute_index = random.randint(0, increments_per_hour - 1)
    # Calculate the actual minute
    minute = minute_index * minute_increment
    # Generate a second if needed, else default to 0
    second = 0
    # Create a time object
    return time(hour, minute, second)

def create_and_log_appointment(db, appointment_data, created_by):
    # Create the appointment
    new_appointment = Appointment()
    auto_assign_attributes(appointment_data, new_appointment)
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    # Log to ledger
    ledger_entry = AppointmentLedger(
        appointment_id=new_appointment.appointment_id,
        modified_at=datetime.now(),
        modified_by=created_by
    )
    auto_assign_attributes(appointment_data, ledger_entry)
    db.add(ledger_entry)
    db.commit()
    
    return {"message": "Appointment created successfully"}

def create_staff(db: Session, num: int = 5):
    staff_types = db.query(StaffType).all()
    for _ in range(num):
        staff = Staff(
            name=fake.name(),
            staff_type_id=fake.random_element(staff_types).staff_type_id
        )
        db.add(staff)
    db.commit()
    print(f"Created {num} staff records")

def create_patients(db: Session, num: int = 5):
    for _ in range(num):
        patient = Patient(
            name=fake.name(),
            email=fake.email(),
            phone=fake.phone_number(),
            address=fake.address(),
            birthdate=fake.date_of_birth(),
            gender=fake.random_element(['M', 'F'])
        )
        db.add(patient)
    db.commit()
    print(f"Created {num} patient records")

def create_appointments(db: Session, num: int = 5):
    staffs = db.query(Staff).all()
    patients = db.query(Patient).all()
    statuses = db.query(Status).all()
    appointment_types = db.query(AppointmentType).all()

    for _ in range(num):
        selected_appointment_type = fake.random_element(appointment_types)
        created_by = fake.random_element(staffs).staff_id
        
        appointment_data = AppointmentBase(
            appt_date=fake.date_between(start_date="-1y", end_date="+1y"),
            appt_time=generate_business_hours_time(minute_increment=15),
            appt_length=fake.random_int(min=15, max=60, step=15),
            patient_id=fake.random_element(patients).patient_id,
            staff_id=fake.random_element(staffs).staff_id,
            chair_number=fake.random_int(min=1, max=5),
            appointment_type_id=selected_appointment_type.type_id,
            status_id=fake.random_element(statuses).status_id
        )
        
        create_and_log_appointment(db, appointment_data, created_by)
    
    print(f"Successfully Created {num} appointment records and logged to ledger")

def main():
    db = next(get_db())
    create_staff(db, 10)
    create_patients(db, 200)
    create_appointments(db, 100)

if __name__ == "__main__":
    main()