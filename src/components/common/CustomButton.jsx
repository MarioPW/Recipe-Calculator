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
  name,
  title
}) => {
  return (
    <button
      type={type}
      className={`btn btn-sm btn-outline-${className}`}
      id={id}
      name={name}
      onClick={onClick}
      action={action}
      title={title}
      style={{ fontSize: '0.75rem' }}
    >
      {children || label}
    </button>
  );
};
