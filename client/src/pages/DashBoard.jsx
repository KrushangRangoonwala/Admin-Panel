import React, { useEffect, useState } from "react";
import "./dashboard.css";
import api from "../axiosConfig";
import CategoryForm from "../components/CategoryForm";
import SubCategoryForm from "../components/SubCategoryForm";
import { useNavigate } from "react-router";
import Size from "../components/Size";
import AddSizeForm from "../components/AddSizeForm";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [subcategories, setSubcategories] = useState([]);

  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);
  const [isSizeFormOpen, setIsSizeFormOpen] = useState(false);
  const [allSize, setAllSize] = useState([]);

  const [editCatData, setEditCatData] = useState();

  const [selectedCategory, setSelectedCategory] = useState([]);

  const navigate = useNavigate();

  async function getCategoryData() {
    try {
      const response = await api.get("/category");
      // console.log("Categories:", response.data);
      setCategories(response.data.allCategory);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getDashboardData() {
    try {
      const response = await api.get("/");
      // console.log("Dashboard Data:", response.data);
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
      const response = await api.get(
        `/subCategory/subCategoryByCategory/${expandedCategoryId}`
      );
      console.log("Subcategories:", response.data);
      setSubcategories(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    // console.log('expandedCategory', expandedCategoryId)
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
    // setEditCatData(null);
    setIsCatFormOpen(false);
    getCategoryData();
  }

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategory(prev => [...prev, value]);
    } else {
      setSelectedCategory(prev => prev.filter(item => item !== value));
    }
  }

  async function handleDeleteCategory(id) {
    try {
      const response = await api.delete(`/category/id/${id}`);
      console.log("Response", response.data);
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleDeleteAllCategory() {
    selectedCategory.forEach(id => handleDeleteCategory(id));
    setSelectedCategory([]);
    await getCategoryData();
    await getDashboardData();
  }

  return (
    <>
        <Navbar />
      
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
          onClose={() => setIsSubCatFormOpen(false)}
          categoryId={expandedCategoryId}
        />
      )}

      <div className="dashboard-container">
        {/* Top Summary Boxes */}
        <div className="summary-container">
          <div className="summary-boxes">
            <div className="summary-box">
              <h3>Total Category</h3>
              <p>{dashboardData.categoryCount}</p>
            </div>
            <div className="summary-box">
              <h3>Total SubCategory</h3>
              <p>{dashboardData.subCategoryCount}</p>
            </div>
            <div className="summary-box">
              <h3>Total Product</h3>
              <p>{dashboardData.productCount}</p>
            </div>
          </div>
        </div>

        {/* Category Table */}
        <div className="category-table-container">
          <h2>Categories</h2>

          <div className="add-btn-container">
            <button
              className="add-category-button"
              onClick={() => navigate("/addProduct")}
            >
              <i className="bi bi-plus-lg"></i> Add Product
            </button>

            <button
              className="add-category-button"
              onClick={() => setIsCatFormOpen(true)}
              style={{ backgroundColor: "#007bff" }}
            >
              <i className="bi bi-plus-lg"></i> Add Category
            </button>
          </div>

          <div className="delete-div">
            <button type="button"
              className={`btn delete-btn ${selectedCategory.length <= 0 && 'disableDelete'}`}
              onClick={selectedCategory.length > 0 ? handleDeleteAllCategory : null}
            >
              <i className="bi bi-trash3-fill" style={{ marginRight: '4px' }}></i>Delete
            </button>
          </div>

          <table className="category-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>
                  <input type="checkbox" />
                </th>
                <th>Category Name</th>
                <th>Slug</th>
                <th style={{ width: "12%" }}></th>
                <th style={{ width: "12%" }}></th>
                {/* <th style={{ width: "12%" }}></th> */}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat._id}>
                  <tr className="category-row">
                    <td>
                      {/* {expandedCategoryId === cat.id ? null : ( */}
                      <input type="checkbox" value={cat._id} onChange={handleCheckboxChange} />
                      {/* )} */}
                    </td>
                    <td
                      onClick={() => toggleExpand(cat._id)}
                      className="category-text"
                    >
                      {cat.name}
                    </td>
                    <td
                      onClick={() => toggleExpand(cat._id)}
                      className="category-text"
                    >
                      {cat.slug}
                    </td>
                    <td
                      className="icon eyeIcon"
                      onClick={() => navigate(`/category/${cat._id}`)}
                    >
                      <abbr title="view">
                        {" "}
                        <i className="bi bi-eye-fill"></i>{" "}
                      </abbr>
                    </td>
                    <td
                      className="icon pencilIcon"
                      onClick={() => openEditCatForm(cat)}
                    >
                      <abbr title="edit">
                        {" "}
                        <i className="bi bi-pencil-fill"></i>{" "}
                      </abbr>
                    </td>
                    {/* <td className="icon trashIcon">
                      <abbr title="delete">
                        {" "}
                        <i className="bi bi-trash3-fill"></i>{" "}
                      </abbr>
                    </td> */}
                  </tr>
                  {expandedCategoryId === cat._id && (
                    <>
                      {subcategories.map((subCat, index) => (
                        <tr key={index} className="subcategory-roww">
                          <td></td>
                          <td colSpan="2" className="subcategory-cell">
                            {subCat.name}
                          </td>
                          {/* <td></td> */}
                          <td colSpan="3" style={{ textAlign: "end" }}>
                            <button
                              className="add-category-button add-product-by-subcategory-btn"
                              onClick={() => navigate(`/addProduct/${cat._id}/${subCat._id}`)}
                            >
                              <i className="bi bi-plus-lg"></i> Product
                            </button>
                          </td>
                          {/* <td></td> */}
                        </tr>
                      ))}
                      <tr className="">
                        <td></td>
                        <td></td>
                        {/* <td></td> */}
                        <td colSpan={4} style={{ textAlign: "end" }}>
                          <button
                            className="add-subcategory-button"
                            onClick={() => setIsSubCatFormOpen(true)}
                          >
                            <i className="bi bi-plus "></i> Add SubCategory
                          </button>
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {/* <button
            className="add-category-button"
            onClick={() => setIsCatFormOpen(true)}
          >
            <i className="bi bi-plus-lg"></i> Add Category
          </button> */}

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
