const AppointmentSlot = ({ appointments, time, chair }) => {
    const hasAppointment = appointments.some(appointment => 
      appointment.appt_time === time && appointment.chair_number === chair);
  
    return (
      <td className="p-0 text-center">
        {hasAppointment && <div className="w-full h-full bg-red-500 hover:bg-blue-500">Appointment</div>}
      </td>
    );
  };
  
  export default AppointmentSlot;
  