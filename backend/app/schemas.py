from pydantic import BaseModel
from enum import Enum

# Status for Appointments
class StatusEnum(Enum):
    confirmed = 'confirmed'
    in_progress = 'in-progress'
    cancelled = 'cancelled'
    completed = 'completed'

class StatusBase(BaseModel):
    status: StatusEnum
    
# Appointment Types
class AppointmentTypeEnum(Enum):
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
    birthdate: str
    gender: str
    occupation: str

class AppointmentBase(BaseModel):
    date: str
    time: str
    patient_name: str
    staff: str
    chair_number: int
    appointment_type: AppointmentTypeEnum
    

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int

    class Config:
        from_attributes = True