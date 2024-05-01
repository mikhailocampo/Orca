const generateTimeSlots = (startTime, endTime, interval) => {
  const start = startTime.split(':');
  const end = endTime.split(':');
  const date = new Date();
  date.setHours(parseInt(start[0], 10), parseInt(start[1], 10), 0, 0);

  const endDate = new Date();
  endDate.setHours(parseInt(end[0], 10), parseInt(end[1], 10), 0, 0);

  const timeSlots = [];
  const intervalMs = interval * 60000; // Convert minutes to milliseconds

  while (date <= endDate) {
      // Uniform format: 'h:mm AM/PM' without extra spaces
      const formattedTime = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          hourCycle: 'h12'
      }).replace(/ /g, ''); // Remove any spaces that could cause issues

      timeSlots.push(formattedTime);
      date.setTime(date.getTime() + intervalMs);
  }

  return timeSlots;
};

export default generateTimeSlots;
