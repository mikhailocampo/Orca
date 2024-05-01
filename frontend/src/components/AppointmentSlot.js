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

  const startOffset = 0
  const height = (appointment.appt_length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div style={{
            position: 'absolute',
            top: `${startOffset * SLOT_HEIGHT}px`,
            height: `${height}px`,
            width: '100%', // Ensure it fills the cell
            backgroundColor: 'rgba(255, 0, 0, 0.5)', // Semi-transparent red
            cursor: 'pointer'
        }}
        onClick={openModal}
        >
          <h2>{appointment.appt_length} mins</h2>
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
