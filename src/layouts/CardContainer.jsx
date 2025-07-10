import React, { useEffect, useState } from 'react';

function CardContainer({ className = '', children }) {
  return (
    <ul
      className={`bg-(--dark) w-full list-none grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-3 ${className}`}
    >
      {children}
    </ul>
  );
}

export default CardContainer;
