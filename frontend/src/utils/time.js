function convertTo24HourTime(timeString) {
    // First, check if the timeString is in AM/PM format and convert it to 24-hour format
    let timeParts = timeString.match(/(\d+):(\d+)(AM|PM)/i);
    if (!timeParts) {
      console.error(`Invalid time string provided: ${timeString}`);
      return '';
    }
  
    let hours = parseInt(timeParts[1], 10);
    let minutes = timeParts[2];
    let ampm = timeParts[3].toUpperCase();
  
    // Convert hours in PM to 24-hour format, except for 12 PM
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    }
  
    // Convert 12 AM to 00 hours
    if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
  
    // Format hours and minutes to ensure two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.padStart(2, '0');
  
    // Return the formatted time string in "HH:mm:ss" format
    return `${hours}:${minutes}:00`;
  }
  
  export default convertTo24HourTime;
  