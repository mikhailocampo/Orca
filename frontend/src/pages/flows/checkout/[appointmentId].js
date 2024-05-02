import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { SkeletonLoader } from 'src/components/Skeleton';
import { EndNotesForm, NextAppointmentForm } from '../checkout/forms/CheckoutForms';
import { useRouter } from 'next/router';

const completeCheckout = (appointmentId, formData) => {
    console.log('Completing checkout for appointment', appointmentId);
    console.log('Sending data to server:', formData);
    fetch(`http://localhost:8000/v1/appointments/${appointmentId}/?modified_by=1`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({formData}),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to complete checkout', response);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Checkout successful');
        console.log(data);
    })
    .catch(error => {
        console.error('Error during fetch operation', error);
    });
    console.log('Checkout complete');
}

const CheckoutPage = () => {
    const router = useRouter();
    const { appointmentId } = router.query;
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        endNotes: {},
        nextAppointment: {},
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData}));
    }

    const steps = [
        <EndNotesForm 
            onContinue={() => setCurrentStep(currentStep + 1)} 
            formData={formData.endNotes} 
            updateFormData={updateFormData}/>,
        <NextAppointmentForm 
            onFinish={() => completeCheckout(appointmentId, formData)} 
            onBack={() => setCurrentStep(currentStep - 1)} 
            formData={formData.nextAppointment} 
            updateFormData={updateFormData}/>,
    ];

    return (
        <div className='flex h-screen'>
            <Sidebar currentStep={currentStep} setStep={setCurrentStep} />
            <div className='w-4/5 bg-gray-200 p-10'>
                <h1 className='text-6xl'>Checkout Page</h1>
                <p className='mb-8'>Appointment ID: {appointmentId}</p>
                {isLoading ? <SkeletonLoader /> : steps[currentStep]}
            </div>
        </div>
    );
}

export default CheckoutPage;
