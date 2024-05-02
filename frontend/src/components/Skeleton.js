import { SLOT_HEIGHT, TIME_SLOT_INTERVAL } from 'src/utils/Constants';

export const SkeletonLoader = () => {
  return (
      <div className="animate-pulse p-10">
          <div className="bg-gray-400 h-6 w-3/4 mb-4 rounded-full"></div>
          <div className="bg-gray-300 h-4 w-full mb-2 rounded-lg"></div>
          <div className="bg-gray-700 h-8 w-full mb-2 rounded-lg"></div>
          <div className="bg-gray-300 h-4 w-full mb-2 rounded-lg"></div>
          <div className="bg-gray-500 h-10 w-1/4 rounded-lg"></div>
      </div>
  );
};

export const Skeleton = () => {

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
