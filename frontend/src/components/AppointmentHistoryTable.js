import React, { useState, useEffect } from 'react';
import { formatStaff } from 'src/utils/Strings';

const AppointmentHistoryTable = ({appointments}) => {

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr className='text-left'>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Staff</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {appointments.length === 0 ? (
                    <tr>
                        <td colSpan="5">No appointments found</td>
                    </tr>
                ) : (
                    appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-100 divide-y divide-gray-200 odd:bg-gray-100 text-left">
                            <td className='overflow-hidden'>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{formatStaff(appointment.staff.name, "shorten")}</td>
                            <td>{appointment.appointment_type.code}</td>
                            <td>{appointment.status.code}</td>
                            <td className='w-1/3'>{appointment.notes}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default AppointmentHistoryTable;