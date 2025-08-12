import React from 'react';

const TikTokIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 448 512" // Usar un viewBox más estándar para mayor compatibilidad
    fill="currentColor"
    className={className}
  >
    <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3v178.7a162.6 162.6 0 1 1-162.6-162.6v-107a74.6 74.6 0 1 0 52.2 71.2V0H312.8a121.2 121.2 0 0 0 1.9 22.2h0a122.2 122.2 0 0 0 36.4 72.2 121.4 121.4 0 0 0 67 20.1h0z" />
  </svg>
);

export default TikTokIcon;
