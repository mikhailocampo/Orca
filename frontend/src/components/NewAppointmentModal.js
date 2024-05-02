import React, { useEffect } from 'react';
import AppointmentForm from './AppointmentForm';

const NewAppointmentModal = ({ isOpen, onClose, onSave, initialData }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleBodyScroll = isOpen => {
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        handleBodyScroll(isOpen);
        if (isOpen) {
            return () => handleBodyScroll(false);
        }
    }, [isOpen]);
    
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

    console.log('New Appointment received initial data:', initialData);

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
                <h2 className="text-lg font-bold">New Appointment</h2>
                <AppointmentForm
                    initialData={initialData}
                    onSave={handleSubmit}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default NewAppointmentModal;
