from sqlalchemy.orm import joinedload
import app.models as models

def serialize_appointment(appointment):
    """ Serialize appointment including related data. """
    return {
        "id": appointment.appointment_id,
        "date": appointment.appt_date.isoformat(),
        "time": appointment.appt_time.isoformat(),
        "length": appointment.appt_length,
        "chair_number": appointment.chair_number,
        "notes": appointment.notes,
        "patient": {
            "id": appointment.patient.patient_id,
            "name": appointment.patient.name,
            "email": appointment.patient.email,
            "phone": appointment.patient.phone
        },
        "appointment_type": {
            "id": appointment.appointment_type.type_id,
            "description": appointment.appointment_type.description,
            "code": appointment.appointment_type.code
        },
        "staff": {
            "id": appointment.staff.staff_id,
            "name": appointment.staff.name
        },
        "status": {
            "id": appointment.status.status_id, 
            "name": appointment.status.name,
            "code": appointment.status.code
        }
    }

def serialize_appointments(appointments):
    return [serialize_appointment(appt) for appt in appointments]

def eager_load_appointment_relationships(query):
    """ Apply joined loads for common relationships in appointment queries. """
    return query.options(
        joinedload(models.Appointment.patient),
        joinedload(models.Appointment.appointment_type),
        joinedload(models.Appointment.staff),
        joinedload(models.Appointment.status)
    )

