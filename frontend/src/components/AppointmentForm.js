// AppointmentForm.js
import React, { useState, useEffect } from 'react';
import Button from './Button';

const AppointmentForm = ({ initialData = {}, onSave, onClose }) => {

    const [appointmentTypes, setAppointmentTypes] = useState([]); // retrieval for select options
    const [appointmentType, setAppointmentType] = useState(initialData.appointment_type.code || 'Select Type');
    const [appointmentLength, setAppointmentLength] = useState(initialData.length || '');
    // State for new appointment details
    const [date, setDate] = useState(initialData.date);
    const [time, setTime] = useState(initialData.time);
    const [chair, setChair] = useState(initialData.chair_number || '');
    const [patientID, setPatientID] = useState(initialData.patientID || '');
    const [notes, setNotes] = useState(initialData.notes || '');

    useEffect(() => {
        // Assuming 'config.json' is in the 'public' folder
        fetch('/config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load configuration');
                }
                return response.json();
            })
            .then(data => {
                // Check if the data has the 'appointment_types' property and it's an array
                if (data.appointment_types && Array.isArray(data.appointment_types)) {
                    setAppointmentTypes(data.appointment_types);
                } else {
                    throw new Error('Configuration format is invalid: expected an object with an array at "appointment_types"');
                }
            })
            .catch(error => {
                console.error('Failed to load appointment types:', error);
                setAppointmentTypes([]); // Set to an empty array in case of error
            });
    }, []);

    // Handler for when the appointment type changes
    const handleAppointmentTypeChange = (e) => {
        const selectedType = e.target.value;
        setAppointmentType(selectedType);

        // Find the appointment type object and set the default length
        const typeObj = appointmentTypes.find(type => type.code === selectedType);
        if (typeObj) {
            setAppointmentLength(typeObj.default_length.toString()); // Convert to string if input expects a string
        }
    };

    // Handler for manual length change
    const handleLengthChange = (e) => {
        setAppointmentLength(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const appointmentData = {
            // Gather form data for submission
            appointment_type: appointmentType,
            length: appointmentLength,
            // Add other fields
        };
        onSave(appointmentData);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
            <label>
                Patient ID:
                <input type="number" name="patientID" value={patientID} onChange={(e) => setPatientID(e.target.value)} />
            </label>
            <label>
                Appointment Type:
                <select value={appointmentType} onChange={handleAppointmentTypeChange}>
                    <option value="">Select Type</option>
                    {appointmentTypes.map(type => (
                        <option key={type.code} value={type.code}>{type.code}</option>
                    ))}
                </select>
            </label>
            <label>
                Appointment Length:
                <input type="number" name="length" value={appointmentLength} onChange={(e) => handleLengthChange(e)} />
            </label>
            <label>
                Date:
                <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
                Time:
                <input type="text" name="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <label>
                Chair:
                <input type="number" name="chair" value={chair} onChange={(e) => setChair(e.target.value)} />
            </label>
            <label>
                Notes:
                <input type="text" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <Button label="Save" onClick={handleSubmit} className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}/>
            <Button label="Cancel" onClick={onClose} className={'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'}/>
        </form>
    );
};

export default AppointmentForm;
