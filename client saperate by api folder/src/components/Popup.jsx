import React from 'react';
import './Popup.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        <button id='userConfirm' onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Popup;
