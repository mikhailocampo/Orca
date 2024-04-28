from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models
from ..database import get_db

router = APIRouter()

@router.post("/appointment-types/")
def create_appointment_type(appointment_type: schemas.AppointmentTypeBase, db: Session = Depends(get_db)):
    db_appointment_type = models.AppointmentType(code=appointment_type.code, description=appointment_type.description)
    db.add(db_appointment_type)
    db.commit()
    db.refresh(db_appointment_type)
    return db_appointment_type

@router.post("/statuses/")
def create_status(status: schemas.StatusBase, db: Session = Depends(get_db)):
    db_status = models.Status(code=status.code, name=status.name)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

@router.post("/staff-types/")
def create_staff_type(staff_type: schemas.StaffTypeBase, db: Session = Depends(get_db)):
    db_staff_type = models.StaffType(code=staff_type.code, description=staff_type.description)
    db.add(db_staff_type)
    db.commit()
    db.refresh(db_staff_type)
    return db_staff_type

@router.post("/staff")
def create_staff(staff: schemas.StaffBase, db: Session = Depends(get_db)):
    # Check if staff type exists
    if not db.query(models.StaffType).filter(models.StaffType.staff_type_id == staff.staff_type_id).first():
        raise HTTPException(status_code=404, detail="Staff type not found")
    
    # Create new staff record if staff type exists
    new_staff = models.Staff(
        name=staff.name,
        staff_type_id=staff.staff_type_id
    )
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return {"new_staff": new_staff, "message": "Staff created successfully"}

@router.post("/patients/")
def create_patient(patient: schemas.PatientBase, db: Session = Depends(get_db)):
    new_patient = models.Patient(
        name=patient.name,
        email=patient.email,
        phone=patient.phone,
        address=patient.address,
        birthdate=patient.birthdate,
        gender=patient.gender
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return {"patient": new_patient, "message": "Patient created successfully"}

@router.post("/appointments/")
def create_appointment(appointment: schemas.AppointmentBase, db: Session = Depends(get_db)):
    # Check if patient exists
    if not db.query(models.Patient).filter(models.Patient.patient_id == appointment.patient_id).first():
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if staff exists
    if not db.query(models.Staff).filter(models.Staff.staff_id == appointment.staff_id).first():
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Check if appointment type exists
    if not db.query(models.AppointmentType).filter(models.AppointmentType.type_id == appointment.appointment_type_id).first():
        raise HTTPException(status_code=404, detail="Appointment type not found")
    
    # Check if status exists
    if not db.query(models.Status).filter(models.Status.status_id == appointment.status_id).first():
        raise HTTPException(status_code=404, detail="Status not found")
    
    # Create new appointment record if all checks pass
    new_appointment = models.Appointment(
        date=appointment.date,
        time=appointment.time,
        patient_id=appointment.patient_id,
        staff_id=appointment.staff_id,
        chair_number=appointment.chair_number,
        appointment_type_id=appointment.appointment_type_id,
        status_id=appointment.status_id,
        notes=appointment.notes
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment