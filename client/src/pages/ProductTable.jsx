import React from 'react';
import './ProductTable.css';

const ProductTable = () => {
    function handlePageSizeChange() {

    }

    return (
        <div className="table-container">
            <div className="table-box">
                <div className="add-prod-btn">
                    <h3 className="">All Products</h3>

                    <button
                        className="btn submit-btn"
                        onClick={() => navigate(`/addProduct`)}
                    >
                        <i className="bi bi-plus-lg"></i> Add Product
                    </button>
                </div>
                <div className="top-actions">
                    <div className="search-bar">
                        <input type="text" placeholder="Search..." />
                        <button className="btn edit-btn">Search</button>
                    </div>

                    <div className="action-buttons">
                        <button className="btn submit-btn"><i class="bi bi-download"></i> Download CSV</button>
                        <button className="btn edit-btn"><i class="bi bi-upload"></i> Upload .csv</button>
                        <button className="btn delete-btn">Delete All</button>
                        {/* <button className="btn">Update Data</button> */}
                    </div>
                </div>

                <div className="table-footer">
                    <div className="entries-select">
                        <span>Showing <b>{1}</b> to <b>{5}</b> of <b>{10}</b> products</span>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>Main Image</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>MRP Price</th>
                                <th>Sale Price</th>
                                <th>Status</th>
                                <th>Weight</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2].map((_, i) => (
                                <tr key={i}>
                                    <td><input type="checkbox" /></td>
                                    <td><img src="https://via.placeholder.com/50" alt="Product" /></td>
                                    <td>Product {i + 1}</td>
                                    <td>Category</td>
                                    <td>$100</td>
                                    <td>$80</td>
                                    <td>Active</td>
                                    <td>1kg</td>
                                    <td>
                                        <button className="btn-edit">Edit</button>
                                        <button className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='paginate'>
                    <div className="">
                        <label className='page-link'>Page Size:</label>
                        <select value={5} onChange={handlePageSizeChange} className='page-size page-link'>
                            {[5, 10, 15, 20].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="page-container">
                        <span className="page-link page">Previous</span>
                        <span className="page-number active">1</span>
                        <span className="page-number page">2</span>
                        <span className="page-link page">Next</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;
