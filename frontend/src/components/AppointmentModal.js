import React, { useEffect } from 'react';

const AppointmentModal = ({ appointment, isOpen, onClose, onUpdate }) => {

    useEffect(() => {
        const handleBodyScroll = isOpen => {
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        };

        handleBodyScroll(isOpen);
        if (isOpen) {
            handleBodyScroll(true);
            return () => handleBodyScroll(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedAppointment = {}; // Collect form data here
        onUpdate(updatedAppointment);
    };

    // This function is used to handle clicks on the backdrop
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleClickInside = (e) => {
        e.stopPropagation(); // Prevent clicks inside the modal from closing it
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackdropClick} // Handles modal close when clicking on the backdrop
        >
            <div 
                className="bg-white p-4 rounded flex flex-col space-y-3 z-50"
                onClick={handleClickInside} // Prevents modal close when clicking inside
                style={{ minWidth: '300px' }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label>
                        Name:
                        <input type="text" defaultValue={appointment.patientName} autoFocus />
                    </label>
                    {/* More form elements */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Update
                    </button>
                    <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;