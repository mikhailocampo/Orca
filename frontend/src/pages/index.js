import React, { useEffect, useState } from 'react';
import generateTimeSlots from './TimeSlotGenerator';
import AppointmentSlot from './AppointmentSlot';
  

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // sets today's date in YYYY-MM-DD
    const chairs = [1,2,3,4,5];
    const timeSlots = generateTimeSlots('09:00', '17:00', 15);

    useEffect(() => {
        fetchAppointmentsForDate(date);
    }, [date]);

    const fetchAppointmentsForDate = (date) => {
        const startDate = date;
        const endDate = date;
        fetch(`http://localhost:8000/appointments/date-range/?start_date=${startDate}&end_date=${endDate}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Ensure data.appointments is an array
                if (Array.isArray(data.appointments)) {
                    console.log('Data is an array');
                    console.log(data.appointments)
                    setAppointments(data.appointments);
                } else {
                    console.error('Data is not an array');
                    console.log(data.appointments)
                    setAppointments([]); // Set to empty array if not an array
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                setAppointments([]); // Ensure it's always an array
            });
    }

    const formatTime = (timeString) => {
        // Create a date object based on 'timeString' assuming it's in local time
        const [hours, minutes] = timeString.split(':').map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds
    
        // Format time to 'h:mm AM/PM'
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };
    

    return (
        <div>
            <h1>Appointment Schedule</h1>
            <table className="min-w-full divide-y divide-gray-200">
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
                        <tr key={time}>
                            <td>{time}</td>
                            {chairs.map(chair => {
                                <AppointmentSlot key={chair} appointments={appointments} time={time} chair={chair} />
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Schedule;