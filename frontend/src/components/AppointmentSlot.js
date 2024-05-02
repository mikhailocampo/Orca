import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';
import AppointmentModal from './AppointmentModal';
import { useEffect, useState } from 'react';

const AppointmentSlot = ({ appointment }) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
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

  const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Get bounding rectangle of the target element
      const rect = e.currentTarget.getBoundingClientRect();

      const menuWidth = 50;
      const menuHeight = 50;

      // Calculate positions relative to the target element
      const x = Math.min(e.clientX - rect.left, window.innerWidth - menuWidth - 20); // 20 is arbitrary padding
      const y = Math.min(e.clientY - rect.top, window.innerHeight - menuHeight - 20);


      console.log('Context menu click at:', x, y);

      setTimeout(() => {
          setContextMenu({
              visible: true,
              x: x,
              y: y
          });
          console.log('Opening context menu');
      }, 10);
  };

  useEffect(() => {
      console.log('Updated context menu visibility:', contextMenu.visible);
  }, [contextMenu.visible]);

  const closeContextMenu = () => {
    console.log('Closing context menu');
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleUpdate = (updatedAppointment) => {
    // Update the appointment
    console.log('Updating appointment:', updatedAppointment);
    // Close the modal
    closeModal();
  };

  const getBorderStyle = (statusCode) => {
    switch (statusCode) {
      case 'CONF':
        return 'border-l-8 border-green-500';
      case 'UNCF':
        return 'border-l-8 border-yellow-500';
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

  useEffect(() => {
      const handleDocumentClick = (event) => {
          // Check if the click is outside the context menu
          if (contextMenu.visible && !event.target.closest('.context-menu')) {
              console.log("Click outside detected, closing context menu.");
              closeContextMenu();
          }
      };

      // Adding event listener to document
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('contextmenu', handleDocumentClick);

      // Cleanup function to remove the event listener
      return () => {
          document.removeEventListener('click', handleDocumentClick);
          document.removeEventListener('contextmenu', handleDocumentClick);
      };
  }, [contextMenu.visible]);


  return (
      <div onClick={openModal}
          className={`shadow-lg shadow-inner p-2 overflow-hidden cursor-pointer w-full z-10 absolute text-left ${getBackgroundColor(appointment.appointment_type.code)} ${getBorderStyle(appointment.status.code)}`}
          style={{
              top: `${startOffset * SLOT_HEIGHT}px`,
              height: `${height}px`, // Enforce this height strictly
              maxHeight: `${height}px`, // Ensure maximum height does not exceed the calculated height
          }}>

          {/* Intermediate Wrapper Div */}
          <div className="relative w-full h-full" onContextMenu={handleContextMenu}>
              <h2 className="font-bold">{appointment.appointment_type.code}</h2>
              <p>{appointment.patient.name}</p>
              <p>{appointment.staff.type + ' ' + appointment.staff.name.split(' ')[1]}</p>
              <p>{appointment.status.code}</p>

              {contextMenu.visible && (
                  <ul style={{ 
                      position: 'absolute', 
                      top: `${contextMenu.y}px`, 
                      left: `0px`, 
                      zIndex: 50, 
                      backgroundColor: 'white', 
                      listStyle: 'none', 
                      padding: '10px', 
                      boxShadow: '0px 0px 5px rgba(0,0,0,0.5)' 
                  }}>
                      <li onClick={() => console.log('Option 1 clicked')}>Option 1</li>
                      <li onClick={() => console.log('Option 2 clicked')}>Option 2</li>
                  </ul>
              )}
          </div>
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
