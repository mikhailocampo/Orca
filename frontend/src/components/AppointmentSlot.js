import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

const AppointmentSlot = ({ appointment, openModal, closeModal, handleRightClick }) => {
  //console.log('On create appointment slot:', appointment);
  const customHandleRightClick = (e) => {
    e.preventDefault();
    if (appointment && appointment.id) {
      handleRightClick(e, appointment.id);
    } else {
      console.error('No appointment ID found');
    }
  };

  const handleAppointmentClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openModal('appointmentModal', { initialData: appointment });
  }

  const getBorderStyle = (statusCode) => {
    switch (statusCode) {
      case 'CONF':
        return 'border-l-8 border-green-500';
      case 'UNCF':
        return 'border-l-8 border-yellow-500';
      case 'INPR':
        return 'border-l-8 border-blue-500';
      case 'COMP':
        return 'border-l-8 border-green-500 bg-gray-800';
      default:
        return 'border-l-8 border-grey-300';
    }
  }
  const getBackgroundColor = (appointmentCode) => {
    switch (appointmentCode) {
      case 'TCST': return 'bg-red-500';
      case 'BOPL': return 'bg-red-500';
      case 'ADJST': return 'bg-blue-500';
      case 'RETN': return 'bg-purple-300';
      default: return 'bg-gray-100';
    }
  }

  const startOffset = 0
  const height = (appointment.length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div onClick={handleAppointmentClick} onContextMenu={customHandleRightClick} id={`appointment-${appointment.id}`}
          className={`shadow-inner p-2 overflow-hidden cursor-pointer w-full z-10 absolute text-left ${getBackgroundColor(appointment.appointment_type.code)} ${getBorderStyle(appointment.status.code)}`}
          style={{ top: `${startOffset * SLOT_HEIGHT}px`, height: `${height}px`, maxHeight: `${height}px`, }}>

            <h2 className="font-bold">{appointment.appointment_type.code}</h2>
            <p>{appointment.patient.name}</p>
            <p>{appointment.staff.type + ' ' + appointment.staff.name.split(' ')[1]}</p>
            <p>{appointment.status.code}</p>

      </div>
  );
};

export default AppointmentSlot;
