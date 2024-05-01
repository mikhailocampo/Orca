import React, { useEffect, useState } from 'react';
import convertTo24HourTime from 'src/utils/time';

const NewAppointmentModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [appointmentTypes, setAppointmentTypes] = useState([]);
    const [appointmentType, setAppointmentType] = useState('');
    const [appointmentLength, setAppointmentLength] = useState('');

    // State for new appointment details
    const [date, setDate] = useState(initialData.date);
    const [time, setTime] = useState(initialData.time);
    const [chair, setChair] = useState(initialData.chair);
    const [patientID, setPatientID] = useState('');
    const [notes, setNotes] = useState('');


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

    useEffect(() => {
        const handleBodyScroll = isOpen => {
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        handleBodyScroll(isOpen);
        if (isOpen) {
            return () => handleBodyScroll(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    
    const handleSubmit = (event) => {
        event.preventDefault();
        const newAppointment = {
            date,
            time: convertTo24HourTime(time),
            length: appointmentLength,
            patientID: parseInt(patientID, 10),
            chair,
            appointment_type: appointmentType,
            notes
        };
        onSave(newAppointment);
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleClickInside = (e) => {
        e.stopPropagation();  // Prevent clicks inside the modal from closing it
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-white p-4 rounded flex flex-col space-y-3 z-50"
                onClick={handleClickInside}
                style={{ minWidth: '300px' }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label>
                        Date:
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </label>
                    <label>
                        Time:
                        <input type="text" value={time} onChange={(e) => setTime(e.target.value)} autoFocus />
                    </label>
                    <label>
                        Chair:
                        <input type="number" value={chair} onChange={(e) => setChair(e.target.value)} />
                    </label>
                    <label>
                        Patient Name:
                        <input type="number" value={patientID} onChange={(e) => setPatientID(e.target.value)} />
                    </label>
                    <label>
                        Appointment Type:
                        <select value={appointmentType} onChange={handleAppointmentTypeChange}>
                            <option value="">Select Type</option>
                            {appointmentTypes.map(type => (
                                <option 
                                    key={type.code} 
                                    value={type.code} 
                                >{type.code}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Length (minutes):
                        <input type="number" value={appointmentLength} onChange={handleLengthChange} />
                    </label>
                    <label>
                        Notes:
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </label>
                    {/* Add more fields as needed */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                    <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewAppointmentModal;
