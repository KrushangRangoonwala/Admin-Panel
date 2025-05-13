import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import './SubCategoryForm.css';
import api from '../axiosConfig';

const SubCategoryForm = ({ isOpen, onClose, categoryId, editSubCatData,setEditSubCatData }) => {
  const [allCategory, setAllCategory] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get('/category');
        console.log('response.data.allCategory', response.data.allCategory);
        setAllCategory(response.data.allCategory);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    getCategories();

    if (editSubCatData) {
      formik.setFieldValue('categoryId', editSubCatData.categoryId);
      formik.setFieldValue('name', editSubCatData.name);
      formik.setFieldValue('desc', editSubCatData.desc);
    }
  }, []);

  async function handleSubmit(values) {
    try {
      if (editSubCatData) {
        const response = await api.put(`/subCategory/id/${editSubCatData._id}`, values);
        console.log('Subcategory created:', response.data);
      } else {
        const response = await api.post('/subCategory', values);
        console.log('Subcategory created:', response.data);
      }
      onClose();
    } catch (error) {
      console.log('Error creating subcategory:', error);
    }
  }

  const formik = useFormik({
    initialValues: {
      categoryId: categoryId || '',
      name: '',
      desc: '',
    },
    onSubmit: async (values) => {
      handleSubmit(values);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New SubCategory</h2>
        <form onSubmit={formik.handleSubmit} className="subcategory-form">
          <label>
            Select Category:
            <select name="categoryId" value={formik.values.categoryId} onChange={formik.handleChange} required >
              <option value="">-- Select Category --</option>
              {allCategory.map((cat, index) => (
                <option key={index} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            SubCategory Name:
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="desc"
              rows="4"
              value={formik.values.desc}
              onChange={formik.handleChange}
              required
            ></textarea>
          </label>

          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryForm;