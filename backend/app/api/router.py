from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database

router = APIRouter()

@router.post("/appointment-types/")
def create_appointment_type(appointment_type: schemas.AppointmentTypeBase, db: Session = Depends(database.get_db)):
    db_appointment_type = models.AppointmentType(code=appointment_type.code, description=appointment_type.description)
    db.add(db_appointment_type)
    db.commit()
    db.refresh(db_appointment_type)
    return db_appointment_type

@router.post("/statuses/")
def create_status(status: schemas.StatusBase, db: Session = Depends(database.get_db)):
    db_status = models.Status(code=status.code, name=status.name)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

@router.post("/staff-types/")
def create_staff_type(staff_type: schemas.StaffTypeBase, db: Session = Depends(database.get_db)):
    db_staff_type = models.StaffType(code=staff_type.code, description=staff_type.description)
    db.add(db_staff_type)
    db.commit()
    db.refresh(db_staff_type)
    return db_staff_type

@router.post("/staff")
def create_staff(staff: schemas.StaffBase, db: Session = Depends(database.get_db)):
    db_staff = models.Staff(name=staff.name, staff_type_id=staff.staff_type_id)
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff