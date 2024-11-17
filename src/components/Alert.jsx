import React from 'react';

const Alert = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} text-center mb-4`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
