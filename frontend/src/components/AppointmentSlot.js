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
  const getBackgroundColor = (appointmentCode) => {
    switch (appointmentCode) {
      case 'TCST': return 'rgba(255, 0, 0, 0.5)';
      case 'BOPL': return 'rgba(0, 255, 0, 0.5)';
      case 'ADJST': return 'rgba(0, 0, 255, 0.5)';
      case 'RETN': return 'rgba(0, 0, 255, 0.5)';
    }
  }

  const startOffset = 0
  const height = (appointment.length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div onClick={openModal}
        style={{
          position: 'absolute',
          top: `${startOffset * SLOT_HEIGHT}px`,
          height: `${height}px`, // Enforce this height strictly
          maxHeight: `${height}px`, // Ensure maximum height does not exceed the calculated height
          width: '95%', // Ensure it fills the cell
          backgroundColor: getBackgroundColor(appointment.appointment_type.code), 
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
