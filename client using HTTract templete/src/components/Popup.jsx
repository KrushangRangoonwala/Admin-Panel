import React from 'react';
import './Popup.css';

const Popup = ({ message2, message, onClose }) => {
  // const htmlContent = "<strong>This is bold text</strong>";

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p style={{ marginBottom: message2?.length > 0 && '9px' }} dangerouslySetInnerHTML={{ __html: message }} />
        <button id='userConfirm' onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Popup;
