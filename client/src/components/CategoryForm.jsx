// CategoryForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import './CategoryForm.css';
import api from '../axiosConfig';
import imageReader from '../helpers/imageReader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CategoryForm = ({ isOpen, onSubmit, onClose, editCatData = {}, setEditCatData }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isRemoveImg, setIsRemoveImg] = useState(false);
  const cancelImgUploadBtn = useRef(null);
  const removeImgUploadBtn = useRef(null);

  if (!isOpen) return null;

  const formik = useFormik({
    initialValues: {
      name: editCatData?.name || '',
      slug: editCatData?.slug || '',
      desc: editCatData?.desc || '',
      image: null,
    },
    onSubmit: async (values) => handleFormikSubmit(values),
  });

  async function handleFormikSubmit(values) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('desc', values.desc);
    formData.append('isRemoveImg', isRemoveImg);
    if (values.image) formData.append('image', values.image);

    const headers = { 'Content-Type': 'multipart/form-data' };
    try {
      if (editCatData?._id) {
        await api.put(`/category/id/${editCatData._id}`, formData, { headers });
      } else {
        await api.post('/category', formData, { headers });
      }
    } catch (error) {
      console.error('Error submitting category form:', error);
    }

    onSubmit && onSubmit();
    onClose();
  }

  useEffect(() => {
    if (editCatData?.image) {
      const url = imageReader(editCatData, "image");
      setUploadedImageUrl(url);
      setImagePreview(url);
      removeImgUploadBtn.current.style.display = 'inline';
    }
  }, []);

  const generateSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  function handleCatNameChnage(e) {
    formik.handleChange(e);
    const slug = generateSlug(e.target.value);
    formik.setFieldValue('slug', slug);
  }

  function handleSlugChange(e) {
    const changedSlug = generateSlug(e.target.value);
    formik.setFieldValue('slug', changedSlug);
  }

  function handleImageChange(event) {
    const file = event.currentTarget.files[0];
    if (file) {
      setIsRemoveImg(false);
      formik.setFieldValue('image', file);
      setImagePreview(URL.createObjectURL(file));
      cancelImgUploadBtn.current.style.display = 'inline';
      removeImgUploadBtn.current.style.display = 'none';
    }
  }

  function handleCancelImgUpload() {
    formik.setFieldValue('image', '');
    document.getElementById('image').value = '';
    cancelImgUploadBtn.current.style.display = 'none';
    if (uploadedImageUrl) {
      setImagePreview(uploadedImageUrl);
      removeImgUploadBtn.current.style.display = 'inline';
    } else {
      setImagePreview('');
    }
  }

  function handleRemoveImage() {
    formik.setFieldValue('image', '');
    setIsRemoveImg(true);
    document.getElementById('image').value = '';
    setImagePreview('');
    setUploadedImageUrl('');
    removeImgUploadBtn.current.style.display = 'none';
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>{editCatData?._id ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={formik.handleSubmit} className="category-form">
          <label>
            Category Name
            <input type="text" name="name" value={formik.values.name} onChange={handleCatNameChnage} required />
          </label>

          <label>
            Slug
            <input type="text" name="slug" value={formik.values.slug} onChange={formik.handleChange} onBlur={handleSlugChange} required />
          </label>

          <label>
            Image
            <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <i className="bi bi-x-circle cancel-icon" ref={cancelImgUploadBtn} onClick={handleCancelImgUpload}></i>
              <i className="bi bi-trash-fill remove-icon" ref={removeImgUploadBtn} onClick={handleRemoveImage}></i>
            </div>
          )}

          <label>Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={formik.values.desc}
            onChange={(event, editor) => formik.setFieldValue('desc', editor.getData())}
          />

          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
