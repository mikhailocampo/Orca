from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Time, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from .database import Base

class Status(Base):
    __tablename__ = "statuses"
    status_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)

    appointments = relationship("Appointment", back_populates="status")
    appointment_ledger = relationship("AppointmentLedger", back_populates="status")

class AppointmentType(Base):
    __tablename__ = "appointment_types"
    type_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)
    default_length = Column(Integer, nullable=False)

    appointments = relationship("Appointment", back_populates="appointment_type")
    appointment_ledger = relationship("AppointmentLedger", back_populates="appointment_type")

class StaffType(Base):
    __tablename__ = "staff_types"
    staff_type_id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=False)

    staff = relationship("Staff", back_populates="staff_type")

class Patient(Base):
    __tablename__ = "patients"
    patient_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    birthdate = Column(Date)
    gender = Column(String)

    appointments = relationship("Appointment", back_populates="patient")
    appointment_ledger = relationship("AppointmentLedger", back_populates="patient")

class Staff(Base):
    __tablename__ = "staff"
    staff_id = Column(Integer, primary_key=True)
    staff_type_id = Column(Integer, ForeignKey('staff_types.staff_type_id'))
    name = Column(String)

    staff_type = relationship("StaffType", back_populates="staff")
    appointments = relationship("Appointment", back_populates="staff")  # appointments this staff has scheduled    
    assigned_appointments = relationship("AppointmentLedger", foreign_keys="[AppointmentLedger.staff_id]", back_populates="staff")
    modified_appointments = relationship("AppointmentLedger", foreign_keys="[AppointmentLedger.modified_by]", back_populates="modifier")


class Appointment(Base):
    __tablename__ = 'appointments'
    appointment_id = Column(Integer, primary_key=True)
    appt_date = Column(Date, nullable=False)
    appt_time = Column(Time, nullable=False)
    appt_length = Column(Integer, nullable=False)
    patient_id = Column(Integer, ForeignKey('patients.patient_id'))
    staff_id = Column(Integer, ForeignKey('staff.staff_id'))
    chair_number = Column(Integer)
    appointment_type_id = Column(Integer, ForeignKey('appointment_types.type_id'))
    status_id = Column(Integer, ForeignKey('statuses.status_id'))
    notes = Column(Text)

    patient = relationship("Patient", back_populates="appointments")
    appointment_type = relationship("AppointmentType", back_populates="appointments")
    status = relationship("Status", back_populates="appointments")
    staff = relationship("Staff", back_populates="appointments")  # back reference to staff
    appointment_ledger = relationship("AppointmentLedger", back_populates="appointment")


class AppointmentLedger(Base):
    __tablename__ = 'appointment_ledger'
    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey('appointments.appointment_id'))
    appointment_type_id = Column(Integer, ForeignKey('appointment_types.type_id'))
    staff_id = Column(Integer, ForeignKey('staff.staff_id'))
    patient_id = Column(Integer, ForeignKey('patients.patient_id'))
    status_id = Column(Integer, ForeignKey('statuses.status_id'))
    appt_date = Column(Date, nullable=False)
    appt_time = Column(Time, nullable=False)
    appt_length = Column(Integer, nullable=False)
    chair_number = Column(Integer)
    modified_at = Column(DateTime, default=datetime.now)
    modified_by = Column(Integer, ForeignKey('staff.staff_id'))
    notes = Column(Text)
    
    appointment = relationship("Appointment", back_populates="appointment_ledger")
    staff = relationship("Staff", foreign_keys=[staff_id], back_populates="assigned_appointments")
    modifier = relationship("Staff", foreign_keys=[modified_by], back_populates="modified_appointments")
    status = relationship("Status", back_populates="appointment_ledger")
    appointment_type = relationship("AppointmentType", back_populates="appointment_ledger")
    patient = relationship("Patient", back_populates="appointment_ledger")