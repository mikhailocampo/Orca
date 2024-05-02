import React, { useEffect, useState } from 'react';
import generateTimeSlots from '../components/TimeSlotGenerator';
import AppointmentSlot from '../components/AppointmentSlot';
import NewAppointmentModal from '../components/NewAppointmentModal';
import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

import Skeleton from '../components/Skeleton';

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    //const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // sets today's date in YYYY-MM-DD
    const [date, setDate] = useState('2023-10-10'); 
    const chairs = [1,2,3,4,5];
    const timeSlots = generateTimeSlots('09:00', '17:00', TIME_SLOT_INTERVAL);
    const [newModalOpen, setNewModalOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedChair, setSelectedChair] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointmentsForDate(date);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [date]);

    const openNewAppointmentModal = (time, chair) => {
        setSelectedTime(time);
        setSelectedChair(chair);
        setNewModalOpen(true);
    };

    const closeNewAppointmentModal = () => {
        setNewModalOpen(false);
    };

    const saveNewAppointment = (newAppointment) => {
        console.log('New appointment:', newAppointment);
        closeNewAppointmentModal();
    };

    const fetchAppointmentsForDate = (date) => {
        const startDate = date;
        const endDate = date;
        fetch(`http://localhost:8000/v1/appointments/date-range/?start_date=${startDate}&end_date=${endDate}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Ensure data.appointments is an array
                if (Array.isArray(data.appointments)) {
                    setAppointments(data.appointments);
                } else {
                    console.error('Data is not an array');
                    setAppointments([]); // Set to empty array if not an array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                setAppointments([]); // Ensure it's always an array
            });
    };

    const formatTime = (timeString) => {

        if (typeof timeString !== 'string') {
            console.error('Invalid time string', timeString);
            return '';
        }

        const [hours, minutes] = timeString.split(':').map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0);
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, hourCycle: 'h12' }).replace(' ', '');
    };
    

    return (
        <div className='overflow-none flex flex-col justify-center items-center select-none'>
            <h1>Appointment Schedule for {date}</h1>
            <table className="w-11/12 divide-y divide-gray-200 ">
                <thead className="bg-gray-50">
                    <tr>
                        <th>Time</th>
                        {chairs.map(chair => (
                            <th key={chair}>{`Chair ${chair}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {timeSlots.map(time => (
                        <tr key={time} style={{ height: `${SLOT_HEIGHT}px`}}>
                            <td className='text-center w-1/12 bg-gray-100'>{time}</td>
                            {chairs.map(chair => (
                                <td 
                                key={`${time}-${chair}`} 
                                className="relative p-3 text-center cursor-pointer hover:bg-gray-100" 
                                onClick={() => openNewAppointmentModal(time, chair)}
                                >
                                    {loading ? <Skeleton /> : 
                                    
                                    appointments.filter(appointment => {
                                        const formattedApptTime = formatTime(appointment.time);
                                        const matches = formattedApptTime === time && appointment.chair_number === chair;
                                            return matches;
                                            }
                                            ).map(appointment => (
                                                <AppointmentSlot key={appointment.id} appointment={appointment} />
                                            ))
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {newModalOpen && (
                <NewAppointmentModal
                    isOpen={newModalOpen}
                    onClose={closeNewAppointmentModal}
                    onSave={saveNewAppointment}
                    initialData={{ date: date, time: selectedTime, chair: selectedChair }}
                />
            
            )}
        </div>
    );
}

export default Schedule;