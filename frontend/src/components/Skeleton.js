import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

const Skeleton = () => {

  const startOffset = 0
  const height = (TIME_SLOT_INTERVAL / TIME_SLOT_INTERVAL) * SLOT_HEIGHT; 

  return (
      <div
        className='bg-gray shadow-lg rounded-lg p-4 overflow-hidden cursor-pointer border-2 border-gray-200 bg-gray-800 w-full z-10 animate-pulse absolute' 
        style={{
          top: `${startOffset * SLOT_HEIGHT}px`,
          height: `${height}px`, // Enforce this height strictly
          maxHeight: `${height}px`, // Ensure maximum height does not exceed the calculated height
        }}>
      </div>
  );
};

export default Skeleton;
