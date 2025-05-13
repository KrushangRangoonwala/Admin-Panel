import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = ({ categories = [], onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  
  const handleCategoryChange = (e) => {
    const selected = categories.find(cat => cat.slug === e.target.value);
    setSelectedCategory(e.target.value);
    setSubCategories(selected ? selected.subCategories : []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <div className="product-form-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>
          Select Category:
          <select name="category" required onChange={handleCategoryChange}>
            <option value="">-- Select Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select SubCategory:
          <select name="subCategory" required>
            <option value="">-- Select SubCategory --</option>
            {subCategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product Name:
          <input type="text" name="productName" required />
        </label>

        <label>
          Select Main Image:
          <input type="file" name="mainImage" accept="image/*" required />
        </label>

        <label>
          Select Sub Images:
          <input type="file" name="subImages" accept="image/*" multiple />
        </label>

        <label>
          Select Size:
          <input type="text" name="size" placeholder="e.g. S, M, L or 250ml" required />
        </label>

        <label>
          Select Status:
          <select name="status" required>
            <option value="">-- Select Status --</option>
            <option value="Ready To Ship">Ready To Ship</option>
            <option value="On Booking">On Booking</option>
          </select>
        </label>

        <label>
          In Stock:
          <input type="number" name="stock" min="0" required />
        </label>

        <label>
          Weight (in grams or kg):
          <input type="text" name="weight" required />
        </label>

        <label>
          Description:
          <textarea name="description" rows="4" required></textarea>
        </label>

        {/* <button type="submit">Submit Product</button> */}
         <div className="form-actions">
            <button type="submit">Add Product</button>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>
      </form>
    </div>
  );
};

export default ProductForm;
