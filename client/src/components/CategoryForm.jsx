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
    console.log('values.image', values.image)
    values.image && formData.append('image', values.image);

    try {
      const headers = { 'Content-Type': 'multipart/form-data' };

      if (editCatData?._id) {
        const response = await api.put(`/category/id/${editCatData._id}`, formData, { headers });
      } else {
        const response = await api.post('/category', formData, { headers });
      }
    } catch (error) {
      console.error('Error submitting category form:', error);
    }

    onSubmit();
    onClose();
  }

  useEffect(() => {
    if (editCatData?.image) {
      const url = imageReader(editCatData, "image");
      setUploadedImageUrl(url);
      setImagePreview(url);
      removeImgUploadBtn.current.style.display = 'inline';
    }
  }, [])

  // function handleClose() {
  //   if (setEditCatData) setEditCatData(null);
  //   onClose();
  // }

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
    removeImgUploadBtn.current.style.display = 'none';
    setUploadedImageUrl('');
    setImagePreview('');
  }

  function handleImageChange(event) {
    console.log('handleImageChange');
    const file = event.currentTarget.files[0];
    if (file) {
      setIsRemoveImg(false);
      // document.getElementById('image').value = file.name;  // we can't set file.name, we can only set null ('') by this
      formik.setFieldValue('image', file);
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

  function handleSlugChange(e) {
    const changedSlug = generateSlug(e.target.value);
    console.log("changedSlug", changedSlug);
    formik.setFieldValue('slug', changedSlug);
    // formik.handleChange(e);
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
      console.log('values.desc', values.desc);
    }
  })

  return (
    <div className="modal-overlay">
      <div className="cat-modal-content">
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
              onBlur={handleSlugChange}
              // disabled
              required
            />
          </label>

          <label style={{ marginBottom: '7px' }}>
            Image:
          </label>
          {imagePreview && <img src={imagePreview} alt="preview" className="img" />}
          <i
            className="bi bi-x-circle img-upload-icon"
            ref={cancelImgUploadBtn}
            style={{ display: 'none', cursor: 'pointer' }}
            onClick={handleCancelImgUpload}
          ></i>
          <i className="bi bi-trash-fill img-upload-icon"
            ref={removeImgUploadBtn}
            style={{ display: 'none', cursor: 'pointer' }}
            onClick={handleRemoveImage}
          ></i>
          <input
            type="file"
            name="image"
            id='image'
            accept="image/*"
            onChange={handleImageChange}
          />

          <label style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '6px' }}>Description:</div>
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
            <button type="submit">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default CategoryForm;