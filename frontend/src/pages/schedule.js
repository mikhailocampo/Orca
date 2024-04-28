import React, { useEffect, useState } from 'react';

const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', 
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    const chairs = [1,2,3,4,5];

    useEffect(() => {
        // Placeholder
    }, []);

    return (
        <div>
            <h1>Appointment Schedule</h1>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        {chairs.map(chair => (
                            <th key={chair}>{`Chair ${chair}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map(time => (
                        <tr key={time}>
                            <td>{time}</td>
                            {chairs.map(chair => (
                                <td key={chair}></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default schedule;