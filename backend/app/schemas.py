from pydantic import BaseModel, field_validator
from datetime import date, time
from typing import Optional
from config import (
    validate_appointment_type_code,
    validate_appointment_type_description,
    validate_staff_type_code,
    validate_staff_description,
    validate_status_type_code,
    validate_status_type_name,
    )

# Def with Config JSON
class StatusBase(BaseModel):
    code: str
    name: str
    
    @field_validator('code')
    def validate_code(cls, v):
        return validate_status_type_code(v)
    @field_validator('name')
    def validate_name(cls, v):
        return validate_status_type_name(v)

class AppointmentTypeBase(BaseModel):
    code: str
    description: str
    
    @field_validator('code')
    def validate_code(cls, v):
        return validate_appointment_type_code(v)
    @field_validator('description')
    def validate_description(cls, v):
        return validate_appointment_type_description(v)

class StaffTypeBase(BaseModel):
    code: str
    description: str
    
    @field_validator('code')
    def validate_code(cls, v):
        return validate_staff_type_code(v)
    @field_validator('description')
    def validate_description(cls, v):
        return validate_staff_description(v)

# Patient
class PatientBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    birthdate: date
    gender: str
    occupation: str

# Staff
class StaffBase(BaseModel):
    name: str
    staff_type_id: int

class AppointmentBase(BaseModel):
    date: date
    time: time
    patient_id: int
    staff_id: int
    chair_number: int
    appointment_type: AppointmentTypeBase
    status: StatusBase
    notes: Optional[str] = None
    
class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        from_attributes = True

# Response Models