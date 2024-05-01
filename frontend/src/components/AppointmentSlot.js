import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';
import AppointmentModal from './AppointmentModal';
import { useState } from 'react';

const AppointmentSlot = ({ appointment }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.stopPropagation();
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  }

  const handleUpdate = (updatedAppointment) => {
    // Update the appointment
    console.log('Updating appointment:', updatedAppointment);
    // Close the modal
    closeModal();
  };

  const getBorderStyle = (statusCode) => {
    switch (statusCode) {
      case 'CONF':
        return '5px solid green';
      case 'UNCF':
        return '5px solid grey';
      default:
        return '3px solid black';
    }
  }

  const startOffset = 0
  const height = (appointment.length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 
  console.log(height);

  return (
      <div onClick={openModal}
        style={{
          position: 'absolute',
          top: `${startOffset * SLOT_HEIGHT}px`,
          height: `${height}px`, // Enforce this height strictly
          maxHeight: `${height}px`, // Ensure maximum height does not exceed the calculated height
          width: '100%', // Ensure it fills the cell
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          border: '1px solid #000',
          borderLeft: getBorderStyle(appointment.status.code),
          borderRadius: '5px',
          cursor: 'pointer',
          overflow: 'hidden', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          justifyContent: 'left',
          textAlign: 'left',
          padding: '10px',
          zIndex: 1000
        }}>
          <h2 className="font-bold">{appointment.appointment_type.code}</h2>
          <p>{appointment.patient.name}</p>
          <p>{appointment.staff.type + ' ' + appointment.staff.name.split(' ')[1]}</p>
          <p>{appointment.status.code}</p>
          {isModalOpen && (
              <AppointmentModal
                  appointment={appointment}
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onUpdate={handleUpdate}
              />
          
          )}
      </div>
  );
};

export default AppointmentSlot;
