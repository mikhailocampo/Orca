import sys
import os
current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, '../..')
sys.path.insert(0, os.path.abspath(parent_dir))

from sqlalchemy.orm import Session
from faker import Faker
from app.database import get_db
from app.models import AppointmentType, Status, StaffType, Staff, Patient, Appointment

fake = Faker()

def create_staff(db: Session, num: int = 5):
    staff_types = db.query(StaffType).all()
    for _ in range(num):
        staff = Staff(
            name=fake.name(),
            staff_type_id=fake.random_element(staff_types).staff_type_id
        )
        db.add(staff)
    db.commit()
    print(f"{__name__}: Created {num} staff records")

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
    print(f"{__name__}: Created {num} patient records")

def create_appointments(db: Session, num: int = 5):
    staffs = db.query(Staff).all()
    patients = db.query(Patient).all()
    statuses = db.query(Status).all()
    appointment_types = db.query(AppointmentType).all()
    for _ in range(num):
        appointment = Appointment(
            appt_date=fake.date_this_year(),
            appt_time=fake.time(),
            #appt_length=fake.random_int(min=30, max=120),
            patient_id=fake.random_element(patients).patient_id,
            staff_id=fake.random_element(staffs).staff_id,
            appointment_type_id=fake.random_element(appointment_types).type_id,
            status_id=fake.random_element(statuses).status_id,
            chair_number=fake.random_int(min=1, max=5)
        )
        db.add(appointment)
    db.commit()
    print(f"{__name__}: Created {num} appointment records")

def main():
    db = next(get_db())
    create_staff(db)
    create_patients(db)
    #create_appointments(db)

if __name__ == "__main__":
    main()