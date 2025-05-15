import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import './ProductForm.css';
import { useParams } from 'react-router';
import api from '../axiosConfig';
import imageReader, { multipleImageReader } from '../helpers/imageReader';

const ProductForm = () => {
  const { productId } = useParams();
  const { categoryId, subCategoryId } = useParams();
  const [category, setcategory] = useState([])
  const [subCategory, setSubCategory] = useState([]);
  const [allSize, setAllSize] = useState([]);
  const [editProductData, setEditProductData] = useState(null);

  const [previewMainImgUrl, setPreviewMainImgUrl] = useState('');
  const [previewSubImageUrls, setPreviewSubImageUrls] = useState([]);
  const [uploadedSubImageUrl, setUploadedSubImageUrl] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imgIcon, setImgIcon] = useState('');
  const [isRemoveMainImg, setIsRemoveMainImg] = useState(false)

  async function getAllCategory() {
    try {
      const response = await api.get('/category');
      console.log('Categories:', response.data);
      setcategory(response.data.allCategory);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getSubCatByCat(categoryId) {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
      console.log('Subcategories:', response.data);
      setSubCategory(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getAllSize() {
    try {
      const response = await api.get("/size");
      console.log("Sizes:", response.data);
      setAllSize(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    async function setCatandSubCat(categoryId, subCategoryId) {
      await getAllCategory();
      categoryId && formik.setFieldValue('categoryId', categoryId);
      if (subCategoryId) {
        await getSubCatByCat(categoryId);
        formik.setFieldValue('subCategoryId', subCategoryId);
      }
    }
    setCatandSubCat(categoryId, subCategoryId);

    async function getProductById() {
      try {
        await getAllCategory();
        await getAllSize();
        const response = await api.get(`/product/id/${productId}`);
        console.log('Product Data:', response.data);
        const productData = response.data.data;
        console.log('productData', productData)
        await getSubCatByCat(productData.categoryId);
        setEditProductData(productData);
        formik.setValues(productData);
        formik.setFieldValue('mainImage', null);
        formik.setFieldValue('subImages', [null]);

        setUploadedImageUrl(imageReader(productData, "mainImage"));
        setPreviewMainImgUrl(imageReader(productData, "mainImage"));
        productData.mainImage && setImgIcon('trash');
        setUploadedSubImageUrl(multipleImageReader(productData.subImages));
        setPreviewSubImageUrls(multipleImageReader(productData.subImages));
      } catch (error) {
        console.error("Error:", error);
      }
    }
    productId && getProductById();
  }, []);

  async function handleSubmit(values) {
    console.log('Form Values:', values);

    // append values in formData
    const formData = new FormData();
    for (const key in values) {
      if (key === 'subImages') {
        for (let file of values.subImages) {
         values.subImages[0] && formData.append('subImages', file);
        }
      } else if (key === 'mainImage') {
        console.log('values.mainImage', values.mainImage);
        values.mainImage && formData.append('mainImage', values.mainImage);
      } else {
        formData.append(key, values[key]);
      }
    }

    try {
      if (editProductData) {
        formData.append('isRemoveMainImg', isRemoveMainImg);
        const response = await api.put(`/product/id/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Product edited successfully:', response.data);
      } else {
        const response = await api.post('/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Product created successfully:', response.data);
        formik.resetForm(); // resets form to its initialValues.
        setPreviewSubImageUrls([]);
        setPreviewMainImgUrl('');
        setImgIcon('');
      }
    } catch (error) {
      console.error('Error submitting product form:', error);
    }finally{
      window.location.reload();
    }
  }

  const formik = useFormik({
    initialValues: {
      categoryId: '',  // categoryId in backend
      subCategoryId: '',  // subCategoryId in backend
      productName: '',
      mainImage: null,
      subImages: [],
      size: '',
      quantity: '',
      price: '',
      status: '',
      weight: '',
      desc: ''
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleCategoryChange = (e) => {
    e.target.value && getSubCatByCat(e.target.value);
    formik.setFieldValue('categoryId', e.target.value);
    formik.setFieldValue('subCategoryId', '');
  };

  async function handleSubImgChange(e) {
    const files = e.currentTarget.files;
    const fileArray = Array.from(files);
    formik.setFieldValue('subImages', fileArray);
    const previewUrls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewSubImageUrls(previewUrls);
  }

  function handleRemoveSubImgUpload(index) {
    // remove img from `formik.values`
    const updatedSubImages = [...formik.values.subImages];
    updatedSubImages.splice(index, 1);
    formik.setFieldValue('subImages', updatedSubImages);

    //remove img from `previewSubImageUrls`
    const updatedPreviewUrls = [...previewSubImageUrls];
    updatedPreviewUrls.splice(index, 1);
    setPreviewSubImageUrls(updatedPreviewUrls);
  }

  async function handleMainImgChange(e) {
    const file = e.currentTarget.files[0];
    if (file) {
      setIsRemoveMainImg(false);
      formik.setFieldValue('mainImage', file);
      setPreviewMainImgUrl(URL.createObjectURL(file));
      setImgIcon('cross');
    }
  }

  function handleCancelMainImgUpload() {
    formik.setFieldValue('mainImage', '');
    if (uploadedImageUrl) {
      setPreviewMainImgUrl(uploadedImageUrl);
      setImgIcon('trash');
    } else {
      setImgIcon('');
      setPreviewMainImgUrl('');
      document.getElementById('mainImage').value = ''
    }
  }

  function handleRemoveMainImg() {
    setIsRemoveMainImg(true);
    setUploadedImageUrl('')
    document.getElementById('mainImage').value = ''
    formik.setFieldValue('mainImage', '');
    setImgIcon('');
    setPreviewMainImgUrl('');
  }

  // useEffect(() => {
  //   console.log('previewSubImageUrls', previewSubImageUrls);
  // }, [previewSubImageUrls])

  return (
    <div className="product-form-container">
      <h2>Add Product</h2>
      <form onSubmit={formik.handleSubmit} className="product-form">
        <label>
          Select Category:
          <select
            name="categoryId"
            value={formik.values.categoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value="">-- Select Category --</option>
            {category.map((cat, index) => (
              <option key={index} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select SubCategory:
          <select
            name="subCategoryId"
            value={formik.values.subCategoryId}
            onChange={formik.handleChange}
            required
          >
            <option value="">-- Select SubCategory --</option>
            {subCategory.map((sub, index) => (
              <option key={index} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product Name:
          <input
            type="text"
            name="productName"
            value={formik.values.productName}
            onChange={formik.handleChange}
            required
          />
        </label>

        {/* <label> */}
        Select Main Image:
        {/* </label> */}
        {previewMainImgUrl && <img src={previewMainImgUrl} alt="preview" className="img" />}

        {imgIcon === 'cross' &&
          <i className="bi bi-x-circle img-upload-icon"
            style={{ cursor: 'pointer' }}
            onClick={handleCancelMainImgUpload}></i>}

        {imgIcon === 'trash' &&
          <i className="bi bi-trash-fill img-upload-icon"
            style={{ cursor: 'pointer' }}
            onClick={handleRemoveMainImg}></i>}
        <label>
          <input
            type="file"
            name="mainImage"
            accept="image/*"
            id='mainImage'
            onChange={(e) => handleMainImgChange(e)}
            // required
          />
        </label>
        {/* <label> */}
        Select Sub Images:
        {/* </label> */}
        {previewSubImageUrls?.map((img, index) => (
          <React.Fragment key={index}>
            <img key={index} src={img} alt={`preview-${index}`} className="img" />
            {/* <i
              className="bi bi-trash-fill img-upload-icon"
              onClick={() => handleRemoveSubImgUpload(index)}
            ></i> */}
          </React.Fragment>
        ))}
        <label>
          <input
            type="file"
            name="subImages"
            accept="image/*"
            multiple
            onChange={(e) => handleSubImgChange(e)}
          />
        </label>

        <label className="price-label">
          Price:
          <input
            type="number"
            name="price"
            min="0"
            step="any"
            style={{ paddingLeft: '30px', width: '93%' }}
            value={formik.values.price}
            onChange={formik.handleChange}
            required
          />
          <i className="bi bi-currency-dollar dollar-class"></i>
        </label>

        <label>
          Select Size:
          <select
            name="size"
            value={formik.values.size}
            onChange={formik.handleChange}
            onFocus={getAllSize}
            required
          >
            <option value="">-- Select Size --</option>
            {allSize.map((size, index) => (
              <option key={index} value={size._id}>
                {size.shortName} {" - "}{size.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select Status:
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="ReadyToShip">Ready To Ship</option>
            <option value="onBooking">On Booking</option>
          </select>
        </label>

        <label>
          No of Product in Stock:
          <input
            type="number"
            name="quantity"
            min="0"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            required
          />
        </label>

        <label>
          Weight (in kg):
          <input
            type="number"
            min="0"
            name="weight"
            value={formik.values.weight}
            onChange={formik.handleChange}
            step="any"
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
