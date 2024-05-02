import React from 'react';

// TODO: create request to backend for appointment ID and retrieve relevant info: appointment, patient, insurance

const SideBar = ({ currentStep, setStep }) => {
    return (
        <div className="w-1/5 bg-gray-100">
            <ul className="list-decimal">
                <li onClick={() => setStep(0)} className={currentStep === 0 ? 'text-blue-500' : ''}>Endnotes</li>
                <li onClick={() => setStep(1)} className={currentStep === 1 ? 'text-blue-500' : ''}>Next Appointment</li>
                <li onClick={() => setStep(2)} className={currentStep === 2 ? 'text-blue-500' : ''}>Insurance Claim</li>
            </ul>
        </div>
    )
}

export default SideBar;