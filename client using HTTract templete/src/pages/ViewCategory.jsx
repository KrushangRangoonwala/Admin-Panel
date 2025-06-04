import React, { useEffect, useRef, useState } from 'react';
import './ViewCategory.css';
import { useNavigate, useParams } from 'react-router';
import api from '../axiosConfig';
import SubCategoryForm from '../components/SubCategoryForm';
import imageReader from '../helpers/imageReader';
import Navbar from '../components/Navbar';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const ViewCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [openSub, setOpenSub] = useState({ id: null, desc: null });
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [editSubCatData, setEditSubCatData] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [deleteSingleOrMulti, setDeleteSingleOrMulti] = useState('');
  const [deletePropmt, setDeletePropmt] = useState('');
  const [deleteProductid, setDeleteProductid] = useState('');
  const [deleteDialog, setDeleteDialog] = useState('');

  const catDescRef = useRef(null);
  const subCatDescRef = useRef(null);

  async function getProductBySubCategory(subId) {
    try {
      const response = await api.get(`/product/productBySubCategory/${subId}`);
      response.data.success && setProductsList(response.data.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  useEffect(() => {
    if (openSub.id) {
      subCatDescRef.current.innerHTML = openSub.desc;
      getProductBySubCategory(openSub.id);
    }
  }, [openSub]);

  const toggleSubCategory = (subId, subDesc) => {
    setOpenSub(prev =>
      openSub.id === subId ? { id: null, desc: null } : { id: subId, desc: subDesc }
    );
  };

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

  async function handleDeleteAllSubCat() {
    await Promise.all(selectedItems.map(id => handleDeleteSubCat(id)));
    setSelectedItems([]);
    setTimeout(() => getSubCategoryData(), 1000);
  }

  async function deleteIconClicked(e, prod) {
    e.stopPropagation(); // stop event bubbling, when clicked in delete icon eventually also clicked on product's div
    setDeleteSingleOrMulti("single");
    setDeletePropmt(
      `Are you sure you want to delete ${prod.productName} product?`
    );
    setDeleteProductid(prod._id);
    setDeleteDialog(true);
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await api.delete(`/product/id/${id}`);  // product api
      console.log(response);
      getProducts();
    } catch (error) {
      console.log("error in deleting product", error);
    }
  }

  async function getCategoryData() {
    try {
      const response = await api.get(`/category/id/${categoryId}`);
      setCategoryData(response.data.data);
      catDescRef.current.innerHTML = response.data.data.desc;
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  }

  async function getSubCategoryData() {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
      setSubcategories(response.data.data);
    } catch (error) {
      console.error('Error fetching subcategory data:', error);
    }
  }

  useEffect(() => {
    getCategoryData();
    getSubCategoryData();
  }, []);

  function onClose() {
    setEditSubCatData(null);
    setIsSubCatFormOpen(false);
    setOpenSub({ id: null, desc: null });
    getSubCategoryData();
  }

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    setSelectedItems(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  }

  return (
    <>
      <Navbar />
      {isSubCatFormOpen && (
        <SubCategoryForm
          isOpen={isSubCatFormOpen}
          onClose={onClose}
          categoryId={categoryId}
          editSubCatData={editSubCatData}
        />
      )}

      {deleteSingleOrMulti === "single" && (
        <DeleteConfirmDialog
          isOpen={deleteDialog}
          propmt={deletePropmt}
          id={deleteProductid}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeleteDialog(false)}
          titleTxt={'Confirm Delete'}
          cancelTxt={'Cancel'}
          doneTxt={'Delete'}
        />
      )}

      <div className="container">
        <div className="category-container">
          <div className="category-header">
            <div className="category-info">
              <h2>{categoryData.name}</h2>
              <p><strong>Slug:</strong> {categoryData.slug}</p>
              <div><strong>Description:</strong> <div ref={catDescRef} style={{ marginLeft: '40px', marginTop: '8px' }}></div></div>
              <div style={{ marginTop: '20px' }}>
                <button
                  className="add-subcategory-button btn"
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

          <h3>SubCategories</h3>
          <div className="btn-container">
            <button
              className={`btn delete-btn ${selectedItems.length <= 0 && 'disableDelete'}`}
              onClick={selectedItems.length > 0 ? handleDeleteAllSubCat : null}
            >
              <i className="bi bi-trash3-fill"></i> Delete
            </button>
            <button
              className="add-subcategory-button"
              onClick={() => setIsSubCatFormOpen(true)}
            >
              <i className="bi bi-plus-lg"></i> Add SubCategory
            </button>
          </div>

          <div className="subcategory-list">
            {subcategories.length === 0 && <p className='no-record'>No SubCategories Found</p>}
            {subcategories.map((sub, idx) => (
              <div className="subcategory-row" key={idx}>
                <div className="subCategoryHead">
                  {openSub.id === sub._id ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                  <input type="checkbox" value={sub._id} onChange={handleCheckboxChange} />
                  <span
                    className="subcategory-name"
                    onClick={() => toggleSubCategory(sub._id, sub.desc)}
                  >
                    {sub.name}
                  </span>
                  <button className="btn edit-btn" onClick={() => handleEditSubCategory(sub)}>
                    <i className="bi bi-pencil-fill"></i> Edit
                  </button>
                </div>

                {openSub.id === sub._id && (
                  <>
                    <div><strong>Description:</strong>
                      <div className="desc-add-product">
                        <div ref={subCatDescRef} style={{ marginLeft: '40px' }}></div>
                      </div>
                    </div>

                    <div className="product-listt">
                      {productsList.length <= 0 && <p className='no-record'>No Product Found</p>}
                      {productsList.map((prod, i) => (
                        <div
                          key={i}
                          className="product-card"
                          onClick={() => navigate(`/product/${prod._id}`)}>
                          <img src={imageReader(prod, "mainImage")} alt={prod.name} />
                          <div className="product-infoo">
                            <h6>{prod.productName}</h6>
                            <div className="actionss">
                              {/* <i className="bi bi-pencil-fill"></i> */}
                              <p>Rs {prod.salePrice}</p>
                              <i className="bi bi-trash3-fill delete-iconn" onClick={(e) => deleteIconClicked(e, prod)}></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCategory;
