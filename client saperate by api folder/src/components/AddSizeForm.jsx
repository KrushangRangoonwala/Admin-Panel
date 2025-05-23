import React from 'react';
import { useFormik } from 'formik';
import './AddSizeForm.css';

const AddSizeForm = ({ isOpen, onClose, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      shortName: ''
    },
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="size-modal-content">
        <h2>Add Size</h2>
        <form onSubmit={formik.handleSubmit}>
          <label>
            Size Name:
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
          </label>

          <label>
            Short Name:
            <input
              type="text"
              name="shortName"
              value={formik.values.shortName}
              onChange={formik.handleChange}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSizeForm;
