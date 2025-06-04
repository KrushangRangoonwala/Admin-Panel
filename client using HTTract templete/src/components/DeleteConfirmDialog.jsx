import React from 'react';
import './DeleteConfirmDialog.css';

const DeleteConfirmDialog = ({ isOpen, propmt, id, onConfirm, onCancel, cancelTxt, doneTxt,titleTxt }) => {
  if (!isOpen) return null;

  function handleOkClick() {
    id ? onConfirm(id) : onConfirm();
    onCancel();
  }

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3 className="modal-title">{titleTxt}</h3>
        <p className="modal-text">{propmt}</p>
        <div className="modal-actions">
          <button className="cancel-btnn"  onClick={onCancel}>
            {cancelTxt}
          </button>
          <button className="btn delete-btn" onClick={handleOkClick}>
            {doneTxt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
