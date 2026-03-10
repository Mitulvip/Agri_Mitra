import React from 'react';

const PlantIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8.25c-2.488 0-4.506 2.018-4.506 4.506s2.018 4.506 4.506 4.506 4.506-2.018 4.506-4.506S14.488 8.25 12 8.25z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21.75c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 12h-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M22.125 12h-1.5" />
  </svg>
);

export default PlantIcon;
