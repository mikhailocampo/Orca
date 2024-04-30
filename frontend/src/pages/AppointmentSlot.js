import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

const AppointmentSlot = ({ appointment }) => {
  // Calculate the number of intervals to offset from the start of the table
  const startOffset = 0 // You need to calculate this based on appointment start time
  // Calculate height based on appointment length
  const height = (appointment.appt_length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div style={{
            position: 'absolute',
            top: `${startOffset * SLOT_HEIGHT}px`,
            height: `${height}px`,
            width: '100%', // Ensure it fills the cell
            backgroundColor: 'rgba(255, 0, 0, 0.5)' // Semi-transparent red
        }}>
          <h2>{appointment.appt_length} mins</h2>
      </div>
  );
};

export default AppointmentSlot;
