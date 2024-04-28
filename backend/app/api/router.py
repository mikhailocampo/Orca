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

@router.post("/statuses/", response_model=schemas.StatusResponse)
def create_status(status: schemas.StatusBase, db: Session = Depends(database.get_db)):
    db_status = models.Status(name=status.status)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return schemas.StatusResponse(
        status=schemas.StatusBase(status=db_status.name),
        message="Status created successfully"
    )
