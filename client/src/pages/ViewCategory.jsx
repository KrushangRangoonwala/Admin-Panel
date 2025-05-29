import React, { use, useEffect, useRef, useState } from 'react';
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
  const [openSub, setOpenSub] = useState({ id: null, desc: null });
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isproductListReady, setIsproductListReady] = useState(false);
  const [editSubCatData, setEditSubCatData] = useState()

  const [selectedItems, setSelectedItems] = useState([]);

  const catDescRef = useRef(null);
  const subCatDescRef = useRef(null);

  async function getProductBySubCategory(subId) {
    // setProductsList([]);
    try {
      const response = await api.get(`/product/productBySubCategory/${subId}`);  // product api
      console.log('response.data', response.data);
      response.data.success && setProductsList(response.data.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  useEffect(() => {
    // setTimeout(() => {
    //   setIsproductListReady(true)
    // }, 2000);
  }, [productsList]);

  const toggleSubCategory = (subId, subDesc) => {
    // setOpenSub(prev => (prev === subId ? null : subId));
    if (openSub.id === subId) {
      setOpenSub(prev => ({
        ...prev,
        id: null,
        desc: null,
      }))
    } else {
      setOpenSub(prev => ({
        ...prev,
        id: subId,
        desc: subDesc,
      }))
    }
  };

  useEffect(() => {
    if (openSub.id) {
      subCatDescRef.current.innerHTML = openSub.desc;
      getProductBySubCategory(openSub.id);
    }
  }, [openSub])

  async function handleEditSubCategory(sub) {
    setEditSubCatData(sub);
    setIsSubCatFormOpen(true);
  }

  async function handleDeleteSubCat(id) {
    try {
      await api.delete(`/subCategory/id/${id}`);  // subCategory api
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
      const response = await api.get(`/category/id/${categoryId}`);  // category api
      // console.log('Category Data:', response.data);
      setCategoryData(response.data.data);
      catDescRef.current.innerHTML = response.data.data.desc;
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  }
  async function getSubCategoryData() {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);  // subCategory api
      // console.log('Subcategories:', response.data);
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
    setOpenSub(prev => ({
      ...prev,
      id: null,
      desc: null,
    }))
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
              {/* <p><strong>Description:</strong> {categoryData.desc}</p> */}
              <div><strong>Description:</strong> <div ref={catDescRef} style={{ marginLeft: '40px', marginTop: '8px' }}></div></div>

              <div style={{ marginTop: '20px' }}>
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
                    {openSub.id === sub._id ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                    <input type="checkbox" value={sub._id} onChange={(e) => handleCheckboxChange(e)} />
                    {/* {console.log('sub', sub)} */}
                    <span
                      className="subcategory-name"
                      onClick={() => toggleSubCategory(sub._id, sub.desc)}
                    >
                      {sub.name}
                    </span>
                    <button type="button" className="btn edit-btn" onClick={() => handleEditSubCategory(sub)}>
                      <i className="bi bi-pencil-fill"></i> Edit
                    </button>
                  </div>
                  {/* SubCategory Details & Products */}
                  {openSub.id === sub._id && (
                    <>
                      {/* <div className="subcategory-details"> */}
                      <div><strong>Description:</strong>
                        <div className="desc-add-product">
                          <div ref={subCatDescRef} style={{ marginLeft: '40px', marginTop: '8px' }}></div>
                          {/* <button
                            className="add-category-button"
                            onClick={() => navigate(`/addProduct/${categoryId}/${sub._id}`)}
                            style={{
                              padding: '4px 8px',
                              maxHeight: '26px',
                              fontWeight: 'normal',
                              fontSize: '12px',
                            }}
                          >
                            <i className="bi bi-plus-lg"></i> Add Product
                          </button> */}
                        </div>
                      </div>

                      <div className="product-listt">
                        {productsList.length <= 0 && <p className='no-record'>No Product Found</p>}
                        {productsList.map((prod, i) => (
                          <div
                            key={i}
                            className="product-card"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/product/${prod._id}`)}>
                            <img src={imageReader(prod, "mainImage")} alt={prod.name} />
                            
                            <div className="product-info">
                              <label className='product-checkbox' style={{left:'-3px'}} onClick={e => e.stopPropagation()}>
                                <input type="checkbox" value={prod._id} onClick={(e) => handleCheckBoxClick(e)} />
                              </label>
                                <h6>{prod.productName}</h6>
                                <div className="actions">
                                  <i className="bi bi-pencil-fill edit-icon"></i>
                                  <p>Rs{' '}{prod.salePrice}</p>
                                  <i className="bi bi-trash3-fill delete-icon" onClick={(e) => deleteIconClicked(e, prod)}></i>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>


                      {/* <AllProducts productsList={productsList} /> */}
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
