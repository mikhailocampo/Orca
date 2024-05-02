import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { EndNotesForm, NextAppointmentForm, InsuranceClaimForm } from '../checkout/forms/CheckoutForms';
import { useRouter } from 'next/router';

const CheckoutPage = () => {
    const router = useRouter();
    const { appointmentId } = router.query;
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        <EndNotesForm onContinue={() => setCurrentStep(currentStep + 1)} />,
        <NextAppointmentForm onContinue={() => setCurrentStep(currentStep + 1)} onBack={() => setCurrentStep(currentStep - 1)} />,
        <InsuranceClaimForm onFinish={() => console.log("Finished!")} onBack={() => setCurrentStep(currentStep - 1)} />
    ];

    return (
        <div className='flex h-screen'>
            <Sidebar currentStep={currentStep} setStep={setCurrentStep} />
            <div className='w-4/5 bg-gray-200'>
                <h1 className='text-6xl'>Checkout Page</h1>
                <p className='mb-8'>Appointment ID: {appointmentId}</p>
                {steps[currentStep]}
            </div>
        </div>
    );
}

export default CheckoutPage;
