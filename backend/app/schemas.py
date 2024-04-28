from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

# Status for Appointments
class StatusEnum(str, Enum):
    confirmed = 'confirmed'
    in_progress = 'in-progress'
    cancelled = 'cancelled'
    completed = 'completed'

class StatusBase(BaseModel):
    status: StatusEnum
    
# Appointment Types
class AppointmentTypeEnum(str, Enum):
    treatment_start = 'TCST'
    bonding = 'BOND'
    bracket_placement = 'BRKT'
    wire_placement = 'WIRE'
    band_placement = 'BAND'
    band_replacement = 'BRPL'
    adjustment = 'ADJ'
    debond = 'DEB'
    band_removal = 'BRM'
    retainer_check = 'RET'
    consultation = 'CONS'
    inv_check = 'INVC'
    inv_placement = 'INVP'
    inv_adjustment = 'INVA'
    inv_removal = 'INVR'
    emergency = 'EMER'
    other = 'OTHER'

# Patient
class PatientBase(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    birthdate: datetime.date
    gender: str
    occupation: str

class StaffType(str, Enum):
    assistant = 'ASST'
    doctor = 'DR'
    receptionist = 'REC'

# Staff
class StaffBase(BaseModel):
    staff_id: int
    name: str
    staff_type: StaffType

class AppointmentBase(BaseModel):
    date: datetime.date
    time: datetime.time
    patient_id: int
    staff_id: int
    chair_number: int
    appointment_type: AppointmentTypeEnum
    status: StatusEnum
    notes: Optional[str] = None
    
class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        from_attributes = True