from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Time
from sqlalchemy.orm import relationship
from .database import Base

class Status(Base):
    __tablename__ = "statuses"
    status_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)

    appointments = relationship("Appointment", back_populates="status")

class AppointmentType(Base):
    __tablename__ = "appointment_types"
    type_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)

    appointments = relationship("Appointment", back_populates="appointment_type")

class StaffType(Base):
    __tablename__ = "staff_types"
    staff_type_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)

    staff = relationship("Staff", back_populates="staff_type")

class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    birthdate = Column(Date)
    gender = Column(String)
    occupation = Column(String)

    appointments = relationship("Appointment", back_populates="patient")

class Staff(Base):
    __tablename__ = "staff"
    staff_id = Column(Integer, primary_key=True)
    staff_type_id = Column(Integer, ForeignKey('staff_types.staff_type_id'))
    name = Column(String)

    staff_type = relationship("StaffType", back_populates="staff")
    appointments = relationship("Appointment", back_populates="staff")

class Appointment(Base):
    __tablename__ = 'appointment_ledger'
    appointment_id = Column(Integer, primary_key=True)
    date = Column(Date)
    time = Column(Time)
    patient_id = Column(Integer, ForeignKey('patients.patient_id'))
    staff_id = Column(Integer, ForeignKey('staff.staff_id'))
    chair_number = Column(Integer)
    appointment_type_id = Column(Integer, ForeignKey('appointment_types.type_id'))
    status_id = Column(Integer, ForeignKey('statuses.status_id'))
    notes = Column(Text)

    patient = relationship("Patient", back_populates="appointments")
    appointment_type = relationship("AppointmentType", back_populates="appointments")
    status = relationship("Status", back_populates="appointments")
    staff = relationship("Staff", back_populates="appointments")
