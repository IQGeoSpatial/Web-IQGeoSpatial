import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
    <div className="w-full h-56 bg-gray-300"></div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
      <div className="flex flex-wrap gap-3 justify-center mt-auto">
        <div className="h-10 bg-gray-300 rounded-lg w-28"></div>
        <div className="h-10 bg-gray-300 rounded-lg w-36"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;