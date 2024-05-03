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

  const getAppointmentSlotStyle = (appointmentCode, statusCode = '') => {
    let style = {
      border: 'border-l-8 border-grey-300',
      background: 'bg-gray-100',
    };
  
    switch (statusCode) {
      case 'CONF':
        style.border = 'border-l-8 border-green-500';
        break;
      case 'UNCF':
        style.border = 'border-l-8 border-yellow-500';
        break;
      case 'INPR':
        style.border = 'border-l-8 border-blue-500';
        break;
      case 'COMP':
        style.border = 'border-l-8 border-gray-600';
        style.background = 'bg-gray-600';
        break;
      default:
        break;
    }
  
    if (statusCode !== 'COMP') {
      switch (appointmentCode) {
        case 'TCST':
        case 'BOPL':
          style.background = 'bg-red-500';
          break;
        case 'ADJST':
          style.background = 'bg-blue-500';
          break;
        case 'RETN':
          style.background = 'bg-purple-300';
          break;
        case 'CONS':
          style.background = 'bg-purple-600';
          break;
        default:
          break;
      }
    }
  
    return style;
  };

  const startOffset = 0
  const height = (appointment.length / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div onClick={handleAppointmentClick} onContextMenu={customHandleRightClick} id={`appointment-${appointment.id}`}
          className={`shadow-inner p-2 overflow-hidden cursor-pointer w-full z-10 absolute text-left ${getAppointmentSlotStyle(appointment.appointment_type.code, appointment.status.code).background} ${getAppointmentSlotStyle(appointment.appointment_type.code, appointment.status.code).border}`}
          style={{ top: `${startOffset * SLOT_HEIGHT}px`, height: `${height}px`, maxHeight: `${height}px`, }}>

            <h2 className="font-bold">{appointment.appointment_type.code}</h2>
            <p>{appointment.patient.name}</p>
            <p>{appointment.staff.type + ' ' + appointment.staff.name.split(' ')[1]}</p>
            <p>{appointment.status.code}</p>

      </div>
  );
};

export default AppointmentSlot;
