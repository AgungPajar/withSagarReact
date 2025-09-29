import React from 'react';

function SkeletonCard() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full md:w-[300px] bg-gray-300 animate-pulse min-h-[220px] sm:min-h-[250px] md:min-h-[280px]"></div>

      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="w-1/2 h-4 bg-gray-300 rounded-md animate-pulse"></div>
        
        <div className="w-full h-6 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="w-5/6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;