// ImageUpload.jsx
import React, { useState } from 'react';
import './ImageUpload.css';
import { FaUpload } from 'react-icons/fa';
import { MdCloudUpload } from 'react-icons/md';

export default function ImageUpload() {
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([null, null, null, null, null]);

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(URL.createObjectURL(file));
    }
  };

  // Handle sub image upload
  const handleSubImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSubImages = [...subImages];
      updatedSubImages[index] = URL.createObjectURL(file);
      setSubImages(updatedSubImages);
    }
  };

  return (
    <div className="image-upload-container">
      <div className="main-image-section">
        <h4>Main Image</h4>
        <label className="image-box">
          {mainImage ? (
            <img src={mainImage} alt="Main" className="preview-image" />
          ) : (
            <div className="upload-icon">
              {/* <FaUpload size={24} /> */}
                  <MdCloudUpload size={40}/>
              <p>Upload</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleMainImageChange} hidden />
        </label>
      </div>

      <div className="sub-images-section">
        <h4>SubImages</h4>
        <div className="sub-image-grid">
          {subImages.map((img, idx) => (
            <label key={idx} className="image-box">
              {img ? (
                <img src={img} alt={`Subimage-${idx + 1}`} className="preview-image" />   
              ) : (
                <div className="upload-icon">
                  {/* <FaUpload size={20} /> */}
                  <MdCloudUpload size={32}/>
                  <p>Upload</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSubImageChange(idx, e)}
                hidden
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
