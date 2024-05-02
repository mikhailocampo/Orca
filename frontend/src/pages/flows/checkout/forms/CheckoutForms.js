import Button from '../../../../components/Button';

export const EndNotesForm = ({ onContinue }) => {
    return (
        <div>
            <h2>Endnotes</h2>
            <p>Generate Endnotes based on doctor notes (if available)</p>
            <Button onClick={onContinue} label='Continue' className='bg-blue-500' />
        </div>
    );
};

export const NextAppointmentForm = ({ onContinue, onBack }) => {
    return (
        <div>
            <h2>Next Appointment</h2>
            <p>Predict next appointment type</p>
            <p>Predict next appointment time and confirm with patient</p>
            <p>Finalize appointment for patient</p>
            <Button onClick={onBack} label='Back' className='bg-gray-500' />
            <Button onClick={onContinue} label='Continue' className='bg-blue-500' />
        </div>
    );
};

export const InsuranceClaimForm = ({ onFinish, onBack }) => {
    return (
        <div>
            <h2>Insurance Claim</h2>
            <p>Generate Insurance Claim</p>
            <Button onClick={onBack} label='Back' className='bg-gray-500' />
            <Button onClick={onFinish} label='Finish' className='bg-blue-500' />
        </div>
    );
};
