from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
from .. import schemas, models
from ..database import get_db

router = APIRouter()

@router.post("/admin/appointment-types/")
def create_appointment_type(appointment_type: schemas.AppointmentTypeBase, db: Session = Depends(get_db)):
    db_appointment_type = models.AppointmentType(
        code=appointment_type.code, 
        description=appointment_type.description,
        default_length=appointment_type.default_length
    )
    db.add(db_appointment_type)
    db.commit()
    db.refresh(db_appointment_type)
    return db_appointment_type

@router.post("/admin/statuses/")
def create_status(status: schemas.StatusBase, db: Session = Depends(get_db)):
    db_status = models.Status(code=status.code, name=status.name)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

@router.post("/admin/staff-types/")
def create_staff_type(staff_type: schemas.StaffTypeBase, db: Session = Depends(get_db)):
    db_staff_type = models.StaffType(code=staff_type.code, description=staff_type.description)
    db.add(db_staff_type)
    db.commit()
    db.refresh(db_staff_type)
    return db_staff_type

@router.post("/admin/staff")
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

@router.post("/admin/patients/")
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

@router.post("/v1/appointments/")
def create_appointment(appointment: schemas.AppointmentBase, created_by: int, db: Session = Depends(get_db)):
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
    
    # Check if chair number is valid
    if appointment.chair_number < 1:
        raise HTTPException(status_code=400, detail="Chair number must be greater than 0")
    
    # If AppointmentBase does not have appt_length, set it to the default length of the appointment type
    if not appointment.appt_length:
        appointment.appt_length = db.query(models.AppointmentType).filter(models.AppointmentType.type_id == appointment.appointment_type_id).first().default_length
        print(f"Setting appointment length to default length of appointment type: {appointment.appt_length}")
    
    # Create new appointment record if all checks pass and log to ledger
    new_appointment = models.Appointment()
    models.auto_assign_attributes(appointment, new_appointment)
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    # Log to ledger
    ledger_entry = models.AppointmentLedger(
        appointment_id=new_appointment.appointment_id,
        modified_at=datetime.datetime.now(),
        modified_by=created_by
    )
    models.auto_assign_attributes(appointment, ledger_entry)
    db.add(ledger_entry)
    db.commit()
    
    return {"message": "Appointment created successfully"}

@router.get("/v1/appointments/")
def get_appointments(db: Session = Depends(get_db)):
    return db.query(models.Appointment).all()

@router.get("/v1/appointments/{appointment_id}")
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(models.Appointment).filter(models.Appointment.appointment_id == appointment_id).first()
    if appointment:
        return appointment
    raise HTTPException(status_code=404, detail="Appointment not found")

@router.get("/v1/appointments/patient/{patient_id}")
def get_appointments_by_patient(patient_id: int, db: Session = Depends(get_db)):
    appointments = db.query(models.Appointment).filter(models.Appointment.patient_id == patient_id).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for the specified patient")
    return appointments

@router.get("/v1/appointments/date-range/")
def get_appointments_by_date_range(start_date: str, end_date: str, db: Session = Depends(get_db)):
    start_date = datetime.date.fromisoformat(start_date)
    end_date = datetime.date.fromisoformat(end_date)
    appointments = db.query(models.Appointment).filter(models.Appointment.appt_date.between(start_date, end_date)).all()

    return {"appointments": appointments, "total_appointments": len(appointments)}

@router.put("/v1/appointments/{appointment_id}")
def update_appointment(appointment_id: int, modified_by: int, update_data: schemas.AppointmentUpdate, db: Session = Depends(get_db)):
    appointment = db.query(models.Appointment).filter(models.Appointment.appointment_id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Start Transaction
    with db.begin_nested():
        # Log to ledger first
        ledger_entry = models.AppointmentLedger(
            appointment_id=appointment.appointment_id,
            appt_date=appointment.appt_date,
            appt_time=appointment.appt_time,
            patient_id=appointment.patient_id,
            staff_id=appointment.staff_id,
            chair_number=appointment.chair_number,
            appointment_type_id=appointment.appointment_type_id,
            status_id=appointment.status_id,
            notes=appointment.notes,
            modified_at=datetime.datetime.now(),
            modified_by=modified_by
        )
        db.add(ledger_entry)
        
        # Update appointment record
        if update_data.appt_date:
            appointment.appt_date = update_data.appt_date
        if update_data.appt_time:
            appointment.appt_time = update_data.appt_time
        if update_data.patient_id:
            appointment.patient_id = update_data.patient_id
        if update_data.staff_id:
            appointment.staff_id = update_data.staff_id
        if update_data.chair_number:
            appointment.chair_number = update_data.chair_number
        if update_data.appointment_type_id:
            appointment.appointment_type_id = update_data.appointment_type_id
        if update_data.status_id:
            appointment.status_id = update_data.status_id
        if update_data.notes:
            appointment.notes = update_data.notes
        
        db.commit()
    
    return {"message": "Appointment updated successfully", "updated_appointment": appointment, "ledger_entry": ledger_entry}