import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import './CategoryForm.css';
import api from '../axiosConfig';
import imageReader from '../helpers/imageReader';

const CategoryForm = ({ isOpen, onClose, editCatData = {}, setEditCatData }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isRemoveImg, setIsRemoveImg] = useState(false);  // send via api for `informing backend whether to remove image or not`
  const cancelImgUploadBtn = useRef(null);
  const removeImgUploadBtn = useRef(null);

  if (!isOpen) return null;
  // const initialValues = {
  //   name: editCatData?.name || '',
  //   slug: editCatData?.slug || '',
  //   desc: editCatData?.desc || '',
  //   images: editCatData?.image || '', // updated to store multiple files
  // };

  async function handleFormikSubmit(values) {
    console.log('Form Values:', values);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('desc', values.desc);
    formData.append('isRemoveImg', isRemoveImg);
    values.image && formData.append('image', values.image);

    // Append all selected images
    // if (values.images && values.images.length > 0) {
    //   for (let i = 0; i < values.images.length; i++) {
    //     formData.append('image', values.images[i]);
    //   }
    // }

    try {
      const headers = { 'Content-Type': 'multipart/form-data' };

      if (editCatData?._id) {
        const response = await api.put(`/category/id/${editCatData._id}`, formData, { headers });
        // console.log('Update Response:', response);
      } else {
        const response = await api.post('/category', formData, { headers });
        // console.log('Create Response:', response);
      }
    } catch (error) {
      console.error('Error submitting category form:', error);
    }

    handleClose();
    window.location.reload();  // for fetching new data by api
  }

  // function arrayBufferToBase64(buffer) {
  //   let binary = '';
  //   binary = String.fromCharCode(...new Uint8Array(buffer));
  //   return window.btoa(binary);
  // }

  useEffect(() => {
    if (editCatData?.image) {
      const url = imageReader(editCatData);
      setUploadedImageUrl(url);
      setImagePreview(url);
      removeImgUploadBtn.current.style.display = 'inline';
    }
  }, [])

  function handleClose() {
    if (setEditCatData) setEditCatData(null);
    onClose();
  }

  function handleCancelImgUpload() {
    formik.setFieldValue('image', '');
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
    removeImgUploadBtn.current.style.display = 'none';
    setUploadedImageUrl('');
    setImagePreview('');
  }

  function handleImageChange(event) {
    console.log('handleImageChange');
    const file = event.currentTarget.files[0];
    formik.setFieldValue('image', file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      cancelImgUploadBtn.current.style.display = 'inline';
      removeImgUploadBtn.current.style.display = 'none';
    }
  }

  function generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, ''); // remove leading/trailing -
  }

  function handleCatNameChnage(e) {
    formik.handleChange(e);
    const name = e.target.value;
    const slug = generateSlug(name);
    formik.setFieldValue('slug', slug);
  }

  const formik = useFormik({
    initialValues: {
      name: editCatData?.name || '',
      slug: editCatData?.slug || '',
      desc: editCatData?.desc || '',
      image: null,
    },
    onSubmit: async (values) => {
      handleFormikSubmit(values);
    }
  })

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editCatData?._id ? 'Edit Category' : 'Add New Category'}</h2>

        <form onSubmit={formik.handleSubmit} className="category-form">
          <label>
            Category Name:
            <input type="text" name="name" value={formik.values.name} onChange={(e) => handleCatNameChnage(e)} required />
          </label>

          <label>
            Category Slug:
            <input
              type="text"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              disabled
              required
            />
          </label>

          <label>
            Images:
          </label>
          {imagePreview && <img src={imagePreview} alt="preview" className="img" />}
          <i
            className="bi bi-x-circle"
            ref={cancelImgUploadBtn}
            style={{ display: 'none', cursor: 'pointer' }}
            onClick={handleCancelImgUpload}
          ></i>
          <i className="bi bi-trash-fill"
            ref={removeImgUploadBtn}
            style={{ display: 'none', cursor: 'pointer' }}
            onClick={handleRemoveImage}
          ></i>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />

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
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default CategoryForm;