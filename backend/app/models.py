from sqlalchemy import Column, Integer, String
from .database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    time = Column(String, index=True)
    patient_name = Column(String, index=True)
    staff = Column(String, index=True)
    appointment_type = Column(String, index=True)
    chair_number = Column(Integer, index=True)
