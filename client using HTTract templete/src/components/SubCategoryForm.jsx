// SubCategoryForm.jsx
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import './SubCategoryForm.css';
import api from '../axiosConfig';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const SubCategoryForm = ({ isOpen, onSubmit, onClose, categoryId, editSubCatData, setEditSubCatData }) => {
  const [allCategory, setAllCategory] = useState([]);

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

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get('/category');
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
        await api.put(`/subCategory/id/${editSubCatData._id}`, values);
      } else {
        await api.post('/subCategory', values);
      }

      onSubmit && onSubmit();
      onClose();
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{editSubCatData ? 'Edit SubCategory' : 'Add New SubCategory'}</h2>
        <form onSubmit={formik.handleSubmit} className="subcategory-form">
          <label>
            Select Category
            <select name="categoryId" value={formik.values.categoryId} onChange={formik.handleChange} required>
              <option value="">-- Select Category --</option>
              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            SubCategory Name
            <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} required />
          </label>

          <label>
            Description
            <CKEditor
              editor={ClassicEditor}
              data={formik.values.desc}
              onChange={(event, editor) => {
                const data = editor.getData();
                formik.setFieldValue('desc', data);
              }}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCategoryForm;
