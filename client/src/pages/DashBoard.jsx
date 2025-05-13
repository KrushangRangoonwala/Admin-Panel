import React, { useEffect, useState } from "react";
import "./dashboard.css";
import api from "../axiosConfig";
import CategoryForm from "../components/CategoryForm";
import SubCategoryForm from "../components/SubCategoryForm";
import { useNavigate } from "react-router";

const DashboardPage = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [subcategories, setSubcategories] = useState([]);

  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false)

  const [editCatData, setEditCatData] = useState()

  const navigate = useNavigate();

  useEffect(() => {
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
    getCategoryData();
    getDashboardData();
  }, []);

  useEffect(() => {
    // console.log('expandedCategory', expandedCategoryId)
    async function getSubCategoryData() {
      try {
        const response = await api.get(`/subCategory/subCategoryByCategory/${expandedCategoryId}`);
        console.log("Subcategories:", response.data);
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (expandedCategoryId) {
      getSubCategoryData();
    }
  }, [expandedCategoryId])

  function openEditCatForm(catDetails) {
    setEditCatData(catDetails);
    setIsCatFormOpen(true);
  }

  const toggleExpand = (id) => {
    setExpandedCategoryId((prevId) => (prevId === id ? null : id));
  };

  return (
    <>
      {isCatFormOpen && <CategoryForm isOpen={isCatFormOpen} onClose={() => setIsCatFormOpen(false)} editCatData={editCatData} setEditCatData={setEditCatData} />}
      {isSubCatFormOpen && <SubCategoryForm isOpen={isSubCatFormOpen} onClose={() => setIsSubCatFormOpen(false)} categoryId={expandedCategoryId} />}

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
          <table className="category-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}><input type="checkbox" /></th>
                <th>Category Name</th>
                <th>Slug</th>
                <th style={{ width: "12%" }}></th>
                <th style={{ width: "12%" }}></th>
                <th style={{ width: "12%" }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat._id}>
                  <tr
                    className="category-row"
                  >
                    <td>
                      {/* {expandedCategoryId === cat.id ? null : ( */}
                      <input type="checkbox" />
                      {/* )} */}
                    </td>
                    <td onClick={() => toggleExpand(cat._id)} className="category-text">{cat.name}</td>
                    <td onClick={() => toggleExpand(cat._id)} className="category-text">{cat.slug}</td>
                    <td className="icon eyeIcon" onClick={() => navigate(`/category/${cat._id}`)}>
                      <abbr title="view"> <i className="bi bi-eye-fill"></i> </abbr>
                    </td>
                    <td className="icon pencilIcon" onClick={() => openEditCatForm(cat)}>
                      <abbr title="edit"> <i className="bi bi-pencil-fill"></i> </abbr>
                    </td>
                    <td className="icon trashIcon">
                      <abbr title="delete"> <i className="bi bi-trash3-fill"></i> </abbr>
                    </td>
                  </tr>
                  {expandedCategoryId === cat._id &&
                    <>
                      {subcategories.map((subCat, index) => (
                        <tr key={index} className="subcategory-roww">
                          <td></td>
                          <td colSpan="2" className="subcategory-cell">
                            {subCat.name}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                      <tr className="">
                        <td></td>
                        <td></td>
                        {/* <td></td> */}
                        <td colSpan={4} style={{ textAlign: 'end' }}>
                          <button
                            className="add-subcategory-button"
                            onClick={() => setIsSubCatFormOpen(true)}
                          ><i className="bi bi-plus "></i> Add SubCategory</button>
                        </td>
                      </tr>
                    </>}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button className="add-category-button" onClick={() => setIsCatFormOpen(true)}><i className="bi bi-plus-lg"></i> Add Category</button>
        </div>
      </div >
    </>
  );
};

export default DashboardPage;
