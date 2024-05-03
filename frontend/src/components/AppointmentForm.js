    // AppointmentForm.js
    import React, { useState, useEffect } from 'react';
    import Button from './Button';
    import convertTo24HourTime from 'src/utils/time';

    const AppointmentForm = ({ initialData = {}, onSave, onClose }) => {

        const [appointmentTypes, setAppointmentTypes] = useState([]); // retrieval for select options
        const [appointmentType, setAppointmentType] = useState({ id: initialData.appointment_type.id || '', code: initialData.appointment_type.code || '', description: initialData.appointment_type.description || '' } || {});
        const [appointmentLength, setAppointmentLength] = useState(initialData.length || '');
        const [appointmentId, setAppointmentId] = useState(initialData.id || 0);
        const [date, setDate] = useState(initialData.date);
        const [time, setTime] = useState(convertTo24HourTime(initialData.time) || '');
        const [chair, setChair] = useState(initialData.chair_number || '');
        const [staff, setStaff] = useState({ id: initialData.staff.id || '', type: initialData.staff.type || '', name: initialData.staff.name || '' }); // retrieval for select options [id, type, name]
        const [patientObj, setPatientObj] = useState({ id: initialData.patient.id || '', name: '' });
        const [statusList, setStatusList] = useState([]); // retrieval for select options
        const [status, setStatus] = useState({ id: initialData.status.id || '', code: initialData.status.code || '', description: initialData.status.description || '' } || {}); // retrieval for select options OBJ
        const [notes, setNotes] = useState(initialData.notes || '');

        useEffect(() => {
            // Assuming 'config.json' is in the 'public' folder
            fetch('/config.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load configuration');
                    }
                    return response.json();
                })
                .then(data => {
                    // Check if the data has the 'appointment_types' property and it's an array
                    if (data.appointment_types && Array.isArray(data.appointment_types)) {
                        const typesWithIds = data.appointment_types.map((type, index) => ({ ...type, id: index+1 }));
                        setAppointmentTypes(typesWithIds);
                    } else {
                        throw new Error('Configuration format is invalid: expected an object with an array at "appointment_types"');
                    }
                    if (Array.isArray(data.appointment_statuses)) {
                        const statusesWithIds = data.appointment_statuses.map((status, index) => ({ ...status, id: index+1 }));
                        setStatusList(statusesWithIds);
                    } else {
                        throw new Error('Configuration format is invalid: expected an object with an array at "appointment_status"');
                    }
                })
                .catch(error => {
                    console.error('Failed to load appointment types:', error);
                    setAppointmentTypes([]); // Set to an empty array in case of error
                    setStatusList([]); // Set to an empty array in case of error
                });
        }, []);

        // Handler for when the appointment type changes
        const handleAppointmentTypeChange = (e) => {
            const selectedType = e.target.value;
            setAppointmentType({ id: parseInt(selectedType), code: appointmentTypes[selectedType-1].code, description: appointmentTypes[selectedType-1].description || '' });

            // Find the appointment type object and set the default length
            const typeObj = appointmentTypes.find(type => type.id === parseInt(selectedType));
            if (typeObj) {
                setAppointmentLength(typeObj.default_length.toString()); // Convert to string if input expects a string
            }
        };

        const handlePatientChange = (e) => {
            const selectedPatient = parseInt(e.target.value);
            setPatientObj({ id: isNaN(selectedPatient) ? '' : selectedPatient, name: patientObj.name });
        };

        // Handler for when the status type changes
        const handleStatusChange = (e) => {
            const selectedStatus = parseInt(e.target.value);
            setStatus({ id: selectedStatus, code: statusList[selectedStatus-1].code, description: statusList[selectedStatus-1].description || '' });
        };

        const handleStaffChange = (e) => {
            const selectedStaff = parseInt(e.target.value);
            setStaff({ id: isNaN(selectedStaff) ? '' : selectedStaff, name: staff.name });
        };

        // Handler for manual length change
        const handleLengthChange = (e) => {
            setAppointmentLength(e.target.value);
        };

        const handleSubmit = (e) => {
            e.preventDefault();

            const updateData = {
                // Gather form data for submission
                id: appointmentId,
                patient_id: patientObj.id,
                appt_date: date,
                appt_time: time,
                staff_id: staff.id,
                chair_number: chair,
                appointment_type_id: appointmentType.id,
                appt_length: appointmentLength,
                modified_by: 1,
                status_id: status.id,
                notes
            };
            onSave(updateData);
        };

        return (
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                <label className='flex flex-col space-y-1'>
                    Patient ID:
                    <input type="number" name="patientID" value={patientObj.id} onChange={(e) => handlePatientChange(e)} className='border border-gray-300 rounded-md'/>
                </label>

                <label className='flex flex-col space-y-1'>
                    Staff ID:
                    <input type="number" name="staffID" value={staff.id} onChange={(e) => handleStaffChange(e)} className='border border-gray-300 rounded-md'/>
                </label>

                <label className='flex flex-col space-y-1 '>
                    Status:
                    <select value={status.id} onChange={handleStatusChange} className='border border-gray-300 rounded-md'>
                        {statusList.map(statusOption => (
                            <option key={statusOption.code} value={statusOption.id}>{statusOption.code}</option>
                        ))}
                    </select>
                </label>
                
                <div className='flex flex-col'>
                    <label>Appointment Details</label>
                    <div className='flex flex-row border border-gray-300 rounded-md'>
                        <label>
                            Type: 
                            <select value={appointmentType.id} onChange={handleAppointmentTypeChange}>
                                {appointmentTypes.map(type => (
                                    <option key={type.code} value={type.id}>{type.code}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Length: 
                            <input type="number" name="length" value={appointmentLength} onChange={(e) => handleLengthChange(e)} />
                        </label>
                    </div>
                </div>
                
                <label>
                    Date:
                    <input type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} className='border border-gray-300 rounded-md'/>
                </label>
                <label>
                    Time:
                    <input type="text" name="time" value={time} onChange={(e) => setTime(e.target.value)} className='border border-gray-300 rounded-md'/>
                </label>
                <label>
                    Chair:
                    <input type="number" name="chair" value={chair} onChange={(e) => setChair(e.target.value)} className='border border-gray-300 rounded-md'/>
                </label>
                <label>
                    Notes:
                    <input type="textarea" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className='w-full border border-gray-300 rounded-md resize-none overflow-y-auto'/>
                </label>

                <Button label="Save" onClick={handleSubmit} className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}/>
                <Button label="Cancel" onClick={onClose} className={'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'}/>
            </form>
        );
    };

    export default AppointmentForm;
