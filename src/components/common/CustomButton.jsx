// src/components/common/CustomButton.jsx
import React from 'react';

export const CustomButton = ({
  label,
  children,
  onClick,
  type = 'button',
  className = '',
  id = '',
  action,
  name
}) => {
  return (
    <button
      type={type}
      className={`btn btn-sm btn-outline-${className}`}
      id={id}
      name={name}
      onClick={onClick}
      action={action}
    >
      {children || label}
    </button>
  );
};
