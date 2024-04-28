const generateTimeSlots = (startTime, endTime, interval) => {
    const start = startTime.split(':');
    const end = endTime.split(':');
    const date = new Date();
    date.setHours(parseInt(start[0]), parseInt(start[1]), 0, 0);
  
    const endDate = new Date();
    endDate.setHours(parseInt(end[0]), parseInt(end[1]), 0, 0);
  
    const timeSlots = [];
    const intervalMs = interval * 60000; // Convert minutes to milliseconds
  
    while(date <= endDate) {
      timeSlots.push(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      date.setTime(date.getTime() + intervalMs);
    }
  
    return timeSlots;
  };
  
  export default generateTimeSlots;
  