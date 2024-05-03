import React, { useEffect, useState } from 'react';
import generateTimeSlots from '../components/TimeSlotGenerator';
import AppointmentSlot from '../components/AppointmentSlot';
import AppointmentModal from '../components/AppointmentModal';
import NewAppointmentModal from '../components/NewAppointmentModal';
import ContextMenu from '../components/ContextMenu';
import { useRouter } from 'next/router';
import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

import {Skeleton} from '../components/Skeleton';

const Schedule = () => {
    const [appointments, setAppointments] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, items: [] });
    const [modal, setModal] = useState({ type: null, props: {} });
    //const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // sets today's date in YYYY-MM-DD
    const [date, setDate] = useState('2023-10-10'); 
    const chairs = [1,2,3,4,5];
    const timeSlots = generateTimeSlots('09:00', '17:00', TIME_SLOT_INTERVAL);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedChair, setSelectedChair] = useState(1);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAppointmentsForDate(date);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [date]);

    const openModal = (type, props = {}) => {
        closeContextMenu(); // Close any open context menu

        const modalProps = {type, props};

        setModal(modalProps);
    };

    const closeModal = () => {
        setModal({ type: null, props: {} });
    };

    const saveNewAppointment = (newAppointment) => {
        //console.log('New appointment:', newAppointment);

        console.log('New appointment:', newAppointment);

        const appointmentToSend = {
            appt_date: newAppointment.appt_date,
            appt_time: newAppointment.appt_time,
            appt_length: newAppointment.appt_length,
            patient_id: newAppointment.patient_id,
            staff_id: newAppointment.staff_id,
            chair_number: newAppointment.chair_number,
            appointment_type_id: newAppointment.appointment_type_id,
            status_id: newAppointment.status_id,
            notes: newAppointment.notes,
        }

        console.log('Appointment to send:', appointmentToSend);

        fetch(`http://localhost:8000/v1/appointments/?created_by=${newAppointment.modified_by}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentToSend),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Appointment created:', data);
                closeModal();
                fetchAppointmentsForDate(date);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    const saveUpdatedAppointment = (updatedAppointment) => {
        console.log('Updated appointment:', updatedAppointment);
        fetch(`http://localhost:8000/v1/appointments/${updatedAppointment.id}/?modified_by=${updatedAppointment.modified_by}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAppointment),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Appointment updated:', data);
                closeModal();
    
                // Update the appointments state with the updated data
                setAppointments(prevAppointments => {
                    const updatedAppointments = prevAppointments.map(appointment => {
                        if (appointment.id === data.id) {
                            // Replace with the updated appointment data from server
                            return {...data};
                        }
                        return appointment;
                    });
                    return updatedAppointments;
                });

                fetchAppointmentsForDate(date);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };

    const handleRightClick = (e, appointmentId) => {
        e.preventDefault();
        closeModal(); // Close any open modal

        const x = e.clientX + window.scrollX;
        const y = e.clientY + window.scrollY;

        const menuItems = [
            { label: 'Edit Status', onClick: () => console.log('Edit Status') },
            { label: 'Checkout', onClick: () => {
                // Extract the appointment ID from the target element's ID then navigate to the checkout page
                const targetId = e.target.id;
                const extractedAppointmentId = targetId.split('-')[1];
                console.log('Checkout:', extractedAppointmentId);
                router.push(`/flows/checkout/${extractedAppointmentId}`);
            }},
        ];
        setContextMenu({
            visible: true,
            position: { x, y },
            items: menuItems,
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, position: { x: 0, y: 0 }, items: [] });
    };

    useEffect(() => {
        // Add event listener when the component mounts
        document.addEventListener('contextmenu', handleRightClick);
        return () => {
            // Clean up the event handler when the component unmounts
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

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
        <div className='overflow-none flex flex-col justify-center items-center select-none' onClick={closeContextMenu}>
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
                                className="relative text-center cursor-pointer hover:bg-gray-100" 
                                onClick={() => {
                                    setSelectedTime(time);
                                    setSelectedChair(chair);
                                    openModal('newAppointmentModal', { date, time, chair_number: chair, appointment_type: {code: 'Select'}, patient: {id: '', name: 'Select'}, staff: {name: 'Select'}, status: {code: 'Select'}, notes: '', staff: {id: '', name: 'Select'}});
                                }}
                                >
                                    {loading ? <Skeleton /> : 
                                    
                                    appointments.filter(appointment => {
                                        const formattedApptTime = formatTime(appointment.time);
                                        const matches = formattedApptTime === time && appointment.chair_number === chair;
                                            return matches;
                                            }
                                            ).map(appointment => (
                                                <AppointmentSlot 
                                                    key={appointment.id} 
                                                    appointment={appointment} 
                                                    openModal={openModal}
                                                    closeModal={closeModal}
                                                    handleRightClick={(e) => {
                                                        handleRightClick(e, appointment.id)
                                                    } }
                                                />
                                            ))
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {modal.type === 'newAppointmentModal' && (
                <NewAppointmentModal
                    isOpen={modal.type === 'newAppointmentModal'}
                    onClose={closeModal}
                    onSave={(savedNewAppointment) => saveNewAppointment(savedNewAppointment)}
                    initialData={{ ...modal.props }}
                />
            )}
            {modal.type === 'appointmentModal' && (
                <AppointmentModal
                    isOpen={modal.type === 'appointmentModal'}
                    onClose={closeModal}
                    onUpdate={(updatedAppointment) => saveUpdatedAppointment(updatedAppointment)}
                    initialData={{ ...modal.props.initialData }}
                />
            )}
            <ContextMenu
                visible={contextMenu.visible}
                position={contextMenu.position}
                onClose={closeContextMenu}
                menuItems={contextMenu.items}
            />
        </div>
    );
}

export default Schedule;