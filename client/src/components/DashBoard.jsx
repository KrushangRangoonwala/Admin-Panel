import React, { useState } from "react";
import "./dashboard.css";

const DashboardPage = () => {
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  const categories = [
    {
      id: 1,
      name: "Electronics",
      slug: "electronics",
      subcategories: ["Mobiles", "Laptops", "Cameras"],
    },
    {
      id: 2,
      name: "Fashion",
      slug: "fashion",
      subcategories: ["Men", "Women", "Accessories"],
    },
    {
      id: 3,
      name: "Home Appliances",
      slug: "home-appliances",
      subcategories: ["Kitchen", "Laundry", "Air Conditioning"],
    },
  ];

  const toggleExpand = (id) => {
    setExpandedCategoryId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="dashboard-container">
      {/* Top Summary Boxes */}
      <div className="summary-container">
      <div className="summary-boxes">
        <div className="summary-box">
          <h3>Total Category</h3>
          <p>3</p>
        </div>
        <div className="summary-box">
          <h3>Total SubCategory</h3>
          <p>9</p>
        </div>
        <div className="summary-box">
          <h3>Total Product</h3>
          <p>45</p>
        </div>
      </div>
      </div>

      {/* Category Table */}
      <div className="category-table-container">
        <h2>Categories</h2>
        <table className="category-table">
          <thead>
            <tr>
              {/* <th style={{ width: "10%" }}>Select</th> */}
              <th>Category Name</th>
              <th>Slug</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.id}>
                <tr
                  className="category-row"
                  onClick={() => toggleExpand(cat.id)}
                >
                  {/* <td>
                    {expandedCategoryId === cat.id ? null : (
                      <input type="checkbox" />
                    )}
                  </td> */}
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                </tr>
                {expandedCategoryId === cat.id &&
                  cat.subcategories.map((sub, index) => (
                    <tr key={index} className="subcategory-row">
                      <td></td>
                      <td colSpan="2" className="subcategory-cell">
                        ▸ {sub}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
