import Button from '../../../../components/Button';

export const EndNotesForm = ({ formData, updateFormData, onContinue }) => {
    const handleInputChange = (e) => {
        updateFormData({ endNotes: { ...formData, [e.target.name]: e.target.value } });
    }

    return (
        <div>
            <h2>Endnotes</h2>
            <p>Generate Endnotes based on doctor notes (if available)</p>
            <input name='notes' value={formData.notes || ''} onChange={handleInputChange} placeholder='Enter notes here' className='border-2 border-gray-500 p-2' />
            <Button onClick={onContinue} label='Continue' className='bg-blue-500' />
        </div>
    );
};

export const NextAppointmentForm = ({ formData, updateFormData, onFinish, onBack }) => {
    const handleInputChange = (e) => {
        updateFormData({ nextAppointment: { ...formData, [e.target.name]: e.target.value } });
    }

    return (
        <div>
            <h2>Next Appointment</h2>
            <p>Predict next appointment type</p>
            <p>Predict next appointment time and confirm with patient</p>
            <p>Finalize appointment for patient</p>
            <input name='appointmentType' value={formData.appointmentType || ''} onChange={handleInputChange} placeholder='Enter appointment type' className='border-2 border-gray-500 p-2' />

            <Button onClick={onBack} label='Back' className='bg-gray-500' />
            <Button onClick={onFinish} label='Submit' className='bg-blue-500' />
        </div>
    );
};

export const InsuranceClaimForm = ({ formData, updateFormData, onFinish, onBack }) => {
    const handleInputChange = (e) => {
        updateFormData({ insuranceClaim: { ...formData, [e.target.name]: e.target.value } });
    }

    return (
        <div>
            <h2>Insurance Claim</h2>
            <p>Generate Insurance Claim</p>
            
            <Button onClick={onBack} label='Back' className='bg-gray-500' />
            <Button onClick={onFinish} label='Finish' className='bg-blue-500' />
        </div>
    );
};
