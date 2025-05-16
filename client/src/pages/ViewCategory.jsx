import React, { use, useEffect, useState } from 'react';
import './ViewCategory.css';
import { useNavigate, useParams } from 'react-router';
import api from '../axiosConfig';
import SubCategoryForm from '../components/SubCategoryForm';
import imageReader from '../helpers/imageReader';
import AllProducts from './AllProducts';
import Navbar from '../components/Navbar';

const ViewCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [openSub, setOpenSub] = useState(null);
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isproductListReady, setIsproductListReady] = useState(false);
  const [editSubCatData, setEditSubCatData] = useState()

  const [selectedItems, setSelectedItems] = useState([]);

  async function getProductBySubCategory(subId) {
    // setProductsList([]);
    try {
      const response = await api.get(`/product/productBySubCategory/${subId}`);
      setProductsList(response.data.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  useEffect(() => {
    console.log('productsList', productsList);
    setTimeout(() => {
      setIsproductListReady(true)
      console.log('setTimeout');
    },2000);
  }, [productsList]);

  const toggleSubCategory = (subName, subId) => {
    setOpenSub(prev => (prev === subId ? null : subId));
  };
  
  // useEffect(() => {
  //   openSub && getProductBySubCategory(openSub);
  // },[openSub])

  async function handleEditSubCategory(sub) {
    setEditSubCatData(sub);
    setIsSubCatFormOpen(true);
  }

  async function handleDeleteSubCat(id) {
    try {
      await api.delete(`/subCategory/id/${id}`);
    } catch (error) {
      console.log('Error deleting subcategory:', error);
    }
  }

  function handleDeleteAllSubCat() {
    selectedItems.forEach(id => handleDeleteSubCat(id));
    setSelectedItems([]);
    getSubCategoryData();
  }

  async function getCategoryData() {
    try {
      const response = await api.get(`/category/id/${categoryId}`);
      console.log('Category Data:', response.data);
      setCategoryData(response.data.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  }
  async function getSubCategoryData() {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
      console.log('Subcategories:', response.data);
      setSubcategories(response.data.data);
    } catch (error) {
      console.error('Error fetching subcategory data:', error);
    }
  }

  useEffect(() => {
    getCategoryData();
    getSubCategoryData();
  }, [])

  function onClose() {
    setEditSubCatData(null);
    setIsSubCatFormOpen(false);
    setOpenSub(null);
    getSubCategoryData();
  }

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems(prev => [...prev, value]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== value));
    }
  }

  return (
    <>
        <Navbar />

      {isSubCatFormOpen &&
        <SubCategoryForm
          isOpen={isSubCatFormOpen}
          onClose={onClose}
          categoryId={categoryId}
          editSubCatData={editSubCatData}
        />}

      <div className="container">
        <div className="category-container">
          {/* Category Header */}
          <div className="category-header">
            <div className="category-info">
              <h2>{categoryData.name}</h2>
              <p><strong>Slug:</strong> {categoryData.slug}</p>
              <p><strong>Description:</strong> {categoryData.desc}</p>
              <div>
                <button
                  className="add-category-button"
                  onClick={() => navigate(`/addProduct/${categoryId}`)}
                >
                  <i className="bi bi-plus-lg"></i> Add Product
                </button>
              </div>
            </div>
            <div className="category-image">
              <img src={imageReader(categoryData, "image")} alt={categoryData.name} className='image' />
            </div>
          </div>

          {/* Subcategory List */}
          <h3>SubCategories</h3>
          <div className="btn-container">
            <button type="button"
              className={`btn delete-btn ${selectedItems.length <= 0 && 'disableDelete'}`}
              onClick={selectedItems.length > 0 ? handleDeleteAllSubCat : null}
            >
              <i className="bi bi-trash3-fill" style={{ marginRight: '6px' }}></i>Delete
            </button>
            <button
              className="add-subcategory-button"
              onClick={() => setIsSubCatFormOpen(true)}
            ><i className="bi bi-plus-lg "></i> Add SubCategory</button>
          </div>

          <div className="subcategory-list">
            {subcategories.length === 0 && <p className='no-record'>No SubCategories Found</p>}
            {subcategories.map((sub, idx) => (
              <React.Fragment key={idx}>
                {/* SubCategory Row */}
                <div className="subcategory-row">
                  <div className="subCategoryHead">
                    {openSub === sub._id ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                    <input type="checkbox" value={sub._id} onChange={(e) => handleCheckboxChange(e)} />
                    {/* {console.log('sub', sub)} */}
                    <span
                      className="subcategory-name"
                      onClick={() => toggleSubCategory(sub.name, sub._id)}
                    >
                      {sub.name}
                    </span>
                    <button type="button" className="btn edit-btn" onClick={() => handleEditSubCategory(sub)}>
                      <i className="bi bi-pencil-fill"></i> Edit
                    </button>
                  </div>
                  {/* SubCategory Details & Products */}
                  {openSub === sub._id && (
                    <>
                      {/* <div className="subcategory-details"> */}
                      <p><strong>Description:</strong> {sub.desc}</p>
                      {/* <AllProducts isproductListReady={isproductListReady} productsList={productsList} /> */}
                      {/* {isproductListReady && <AllProducts isproductListReady={isproductListReady} productsList={productsList} categoryId={categoryId} subCategoryId={sub._id}/>} */}
                    </>
                  )}
                </div>

              </React.Fragment>
            ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCategory;
