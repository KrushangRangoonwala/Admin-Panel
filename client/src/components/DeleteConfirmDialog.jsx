import React from 'react';
import './DeleteConfirmDialog.css';

const DeleteConfirmDialog = ({ isOpen, propmt, id, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  function handleOkClick() {
    onConfirm(id);
    onCancel();
  }

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3 className="modal-title">Confirm Deletion</h3>
        <p className="modal-text">{propmt}</p>
        <div className="modal-actions">
          <button className="btn cancel-btnn" onClick={onCancel}>
            No
          </button>
          <button className="btn delete-btn" onClick={handleOkClick}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
