import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AppointmentHistoryTable from 'src/components/AppointmentHistoryTable';
import { SkeletonLoader } from 'src/components/Skeleton';
import PatientDetail from 'src/components/PatientDetail';

const PatientDetailPage = () => {
    const router = useRouter();
    const {patientId} = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [patientInfo, setPatientInfo] = useState({});

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!patientId) return;

            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8000/v1/appointments/patient/${patientId}`);
                const data = await response.json();
                setAppointments(data.appointments || []);
            } catch (error) {
                console.error('Error fetching appointments: ', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, [patientId]);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!patientId) return;

            try {
                const response = await fetch(`http://localhost:8000/v1/patients/${patientId}`);
                const data = await response.json();
                setPatientInfo(data.patient || {});
            } catch (error) {
                console.error('Error fetching appointments: ', error);
            } finally {
            }
        };
        fetchPatient();
    }, [patientId]);

    return (
        <div className="flex flex-col h-screen">
            {/* Patient information display */}
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-bold">Patient Information</h1>
                {isLoading ? <SkeletonLoader/> : <PatientDetail patientInfo={patientInfo}/>}
            </div>

            {/* Previous Appointments List */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4">
                <h2 className="text-lg font-bold">Previous Appointments</h2>
                {isLoading ? <SkeletonLoader/> : <AppointmentHistoryTable patientId={patientId} appointments={appointments}/>}
            </div>

            {/* Treatment Plan Options */}
            <div className="flex justify-end p-4">
                <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => console.log('Create new treatment plan')}>Create New Treatment Plan</button> 
            </div> 
        </div>
    );
};

export default PatientDetailPage;