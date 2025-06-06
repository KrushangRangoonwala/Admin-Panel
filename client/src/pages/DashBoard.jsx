import React, { useEffect, useState } from "react";
import "./dashBoard.css";
import api from "../axiosConfig";
import CategoryForm from "../components/CategoryForm";
import SubCategoryForm from "../components/SubCategoryForm";
import { useNavigate } from "react-router";
import Size from "../components/Size";
import AddSizeForm from "../components/AddSizeForm";
import Navbar from "../components/Navbar";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

const DashboardPage = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSizeFormOpen, setIsSizeFormOpen] = useState(false);
  const [allSize, setAllSize] = useState([]);
  const [editCatData, setEditCatData] = useState();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [isAllCheckBoxSelected, setIsAllCheckBoxSelected] = useState(false);
  const navigate = useNavigate();

  async function getCategoryData() {
    try {
      const response = await api.get("/category");
      console.log("Categories:", response.data);
      setCategories(response.data.allCategory);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getDashboardData() {
    try {
      const response = await api.get("/");
      const { categoryCount, subCategoryCount, productCount } = response.data;
      setDashboardData({ categoryCount, subCategoryCount, productCount });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    getCategoryData();
    getDashboardData();
  }, []);

  async function getSubCategoryData() {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${expandedCategoryId}`);
      console.log("Subcategories:", response.data);
      setSubcategories(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (expandedCategoryId) {
      getSubCategoryData();
    }
  }, [expandedCategoryId]);

  function openEditCatForm(catDetails) {
    setEditCatData(catDetails);
    setIsCatFormOpen(true);
  }

  const toggleExpand = (id) => {
    setExpandedCategoryId((prevId) => (prevId === id ? null : id));
  };

  async function getAllSize() {
    try {
      const response = await api.get("/size");
      console.log("Sizes:", response.data);
      setAllSize(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleAddSize(values) {
    setIsSizeFormOpen(false);
    try {
      const response = await api.post("/size", values);
      console.log("Size added:", response.data);
      getAllSize();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleHideCatForm() {
    console.log('handleHideCatForm................');
    setIsCatFormOpen(false);
    getCategoryData();
    getDashboardData();
  }

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategory(prev => [...prev, value]);
    } else {
      setSelectedCategory(prev => prev.filter(item => item !== value));
    }
  }

  useEffect(() => {
    if (categories.length > 0) {
      const isAllSelected = categories.every(cat => selectedCategory.includes(cat._id));
      isAllSelected ? setIsAllCheckBoxSelected(true) : setIsAllCheckBoxSelected(false);
    }
  }, [selectedCategory]);

  function handleAllCheckBoxClicked() {
    if (isAllCheckBoxSelected) {
      setSelectedCategory([]);
      setIsAllCheckBoxSelected(false);
    } else {
      setIsAllCheckBoxSelected(true);
      setSelectedCategory([]);
      const tempArr = [];
      categories.forEach((cat) => tempArr.push(cat._id));
      setSelectedCategory(tempArr);
    }
  }

  async function handleDeleteCategory(id) {
    try {
      const response = await api.delete(`/category/id/${id}`);
      console.log("Response", response.data);
    } catch (error) {
      console.log('error', error);
    }
  }

  function handleDeleteClicked() {
    setIsDeleteDialogOpen(true);
  }

  async function handleDeleteAllCategory() {
    selectedCategory.forEach(async (id) => await handleDeleteCategory(id));
    setSelectedCategory([]);
    setTimeout(() => {
      getCategoryData();
      getDashboardData();
    }, 1000);
  }

  return (
    <>
      {/* <ChatgptNav /> */}
      <Navbar />
      <div className="dashboard-wrapper">

        {isDeleteDialogOpen && (
          <DeleteConfirmDialog
            isOpen={isDeleteDialogOpen}
            propmt="Are you sure, you want to delete this Category?"
            onConfirm={handleDeleteAllCategory}
            onCancel={() => setIsDeleteDialogOpen(false)}
            cancelTxt="Cancel"
            doneTxt="Delete"
          />
        )}

        {isSizeFormOpen && (
          <AddSizeForm
            isOpen={isSizeFormOpen}
            onClose={() => setIsSizeFormOpen(false)}
            onSubmit={handleAddSize}
          />
        )}

        {isCatFormOpen && (
          <CategoryForm
            isOpen={isCatFormOpen}
            onClose={handleHideCatForm}
            editCatData={editCatData}
            setEditCatData={setEditCatData}
          />
        )}

        {isSubCatFormOpen && (
          <SubCategoryForm
            isOpen={isSubCatFormOpen}
            onClose={() => {
              getSubCategoryData();
              getDashboardData();
              setIsSubCatFormOpen(false);
            }}
            categoryId={expandedCategoryId}
          />
        )}

        <div className="dashboard-container">
          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <h3 className="summary-title">Total Categories</h3>
              <p className="summary-value">{dashboardData.categoryCount || 0}</p>
            </div>
            <div className="summary-card">
              <h3 className="summary-title">Total Subcategories</h3>
              <p className="summary-value">{dashboardData.subCategoryCount || 0}</p>
            </div>
            <div className="summary-card">
              <h3 className="summary-title">Total Products</h3>
              <p className="summary-value">{dashboardData.productCount || 0}</p>
            </div>
          </div>

          {/* Category Section */}
          <div className="category-section">
            <div className="section-header">
              <h2 className="section-title">Categories</h2>
              <div className="action-buttons">
                <button
                  className="action-btn submit-btn"
                  onClick={() => navigate("/addProduct")}
                >
                  <i className="bi bi-plus-lg"></i> Add Product
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => setIsCatFormOpen(true)}
                >
                  <i className="bi bi-plus-lg"></i> Add Category
                </button>
                <button
                  className={`action-btn danger ${selectedCategory.length <= 0 ? 'disabled' : ''}`}
                  onClick={selectedCategory.length > 0 ? handleDeleteClicked : null}
                >
                  <i className="bi bi-trash3-fill"></i> Delete Selected
                </button>
              </div>
            </div>

            {/* <div className="table-container"> */}
              <table className="category-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={isAllCheckBoxSelected}
                        onChange={handleAllCheckBoxClicked}
                      />
                    </th>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th className="action-column">View</th>
                    <th className="action-column">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <React.Fragment key={cat._id}>
                      <tr className="category-row">
                        <td>
                          <input
                            type="checkbox"
                            value={cat._id}
                            onChange={handleCheckboxChange}
                            checked={selectedCategory.includes(cat._id)}
                          />
                        </td>
                        <td
                          onClick={() => toggleExpand(cat._id)}
                          className="category-name"
                        >
                          {cat.name}
                        </td>
                        <td
                          onClick={() => toggleExpand(cat._id)}
                          className="category-slug"
                        >
                          {cat.slug}
                        </td>
                        <td>
                          <button
                            className="icon-btn"
                            onClick={() => navigate(`/category/${cat._id}`)}
                            title="View"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="icon-btn"
                            onClick={() => openEditCatForm(cat)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                        </td>
                      </tr>
                      {expandedCategoryId === cat._id && (
                        <>
                          {subcategories.map((subCat, index) => (
                            <tr key={index} className="subcategory-row">
                              <td></td>
                              <td colSpan="2" className="subcategory-name">
                                {subCat.name}
                              </td>
                              <td colSpan="2"></td>
                            </tr>
                          ))}
                          <tr>
                            <td></td>
                            <td colSpan="4" className="subcategory-action">
                              <button
                                className="action-btn secondary"
                                onClick={() => setIsSubCatFormOpen(true)}
                              >
                                <i className="bi bi-plus"></i> Add Subcategory
                              </button>
                            </td>
                          </tr>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            {/* </div> */}
          </div>

          <Size
            isSizeFormOpen={isSizeFormOpen}
            setIsSizeFormOpen={setIsSizeFormOpen}
            getAllSize={getAllSize}
            setAllSize={setAllSize}
            allSize={allSize}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;