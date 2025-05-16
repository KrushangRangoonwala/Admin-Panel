import React, { use, useEffect, useRef, useState } from 'react'
import './AllProducts.css'
import imageReader from '../helpers/imageReader'
import api from '../axiosConfig';
import { useNavigate } from 'react-router';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import SearchBox from '../components/SearchBox';
import FilterModal from '../components/FilterModal';
import Navbar from '../components/Navbar';

const AllProducts = ({ productsList, isproductListReady, subCategoryId, categoryId }) => {
    const [renderProducts, setRenderProducts] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePropmt, setDeletePropmt] = useState('');
    const [deleteProductid, setDeleteProductid] = useState('');
    const [showRenderProduct, setShowRenderProduct] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isRenderedFirstTime, setIsRenderedFirstTime] = useState(true);
    const [allCategories, setAllCategories] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [isSearchBtnDisable, setIsSearchBtnDisable] = useState(true);
    const SearchBtn = useRef(null);
    const navigate = useNavigate();

    const [selectedProducts, setSelectedProducts] = useState([])

    async function handleDeleteProduct(id) {
        try {
            const response = await api.delete(`/product/id/${id}`);
            console.log(response);
            getAllProducts();
        } catch (error) {
            console.log('error in deleting product', error)
        }
    }

    async function getAllProducts() {
        // console.log('enetred/....')
        try {
            const response = await api.get('/product');
            console.log('response.data', response.data);
            setRenderProducts(response.data.allProduct);
        } catch (error) {
            console.log('Error in get all product', error)
        }
    }

    async function deleteIconClicked(e, prod) {
        e.stopPropagation(); // stop event bubbling, when clicked in delete icon eventually also clicked on product's div
        setDeletePropmt(`Are you sure you want to delete ${prod.productName} product?`);
        setDeleteProductid(prod._id)
        setDeleteDialog(true);
    }

    useEffect(() => {
        async function setProducts() {
            if (isproductListReady) {
                console.log('setting productsList');
                console.log('from allproduct productList', productsList);
                setRenderProducts(productsList);
            } else {
                console.log('getAllProducts();');
                getAllProducts();
            }
        }
        setProducts();
    }, [])

    useEffect(() => {
        console.log('renderProducts', renderProducts);
        setShowRenderProduct(true);
    }, [renderProducts])

    async function getCatAndSubCat() {
        try {
            const response = await api.get('/category');
            console.log('response.data', response.data);
            setAllCategories(response.data.allCategory);
        } catch (error) {
            console.log('Error in get category', error)
        }

        try {
            const response = await api.get('/subCategory');
            console.log('response.data', response.data);
            setAllSubcategories(response.data.allSubCategory);
        } catch (error) {
            console.log('Error in get subcategory', error)
        }
    }

    useEffect(() => {
        if (isFilterOpen && isRenderedFirstTime) {
            getCatAndSubCat();
            setIsRenderedFirstTime(false);
        }
    }, [isFilterOpen]);

    function onSearchInputChange() {
        SearchBtn.current.value.length > 0 ? setIsSearchBtnDisable(false) : setIsSearchBtnDisable(true);
    }

    async function handleSearchText() {
        try {

        } catch (error) {
            console.log('error in search api')
        }
    }

    function handleCheckBoxClick(e) {
        e.stopPropagation();
        const { value, checked } = e.target;
        checked ?
            setSelectedProducts(prev => [...prev, value])
            : setSelectedProducts(prev => prev.filter(v => v !== value));
    }

    async function handleDownloadCsv() {
        console.log('selectedProducts.length', selectedProducts.length);
        if (selectedProducts.length > 0) {
            try {
                const response = await api.post('/product/downloadCsv', { selectedIds: selectedProducts }, {
                    responseType: 'Blob' //  important for file download
                })

                const blob = new Blob([response.data],{ type: 'text/csv' })
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'selected_Products.csv'); // or .csv
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                console.log('error in download CSV', error);
            }
        }
    }

    return (
        <>
            <Navbar />

            {/* <div className='all-product-container'> */}
            <DeleteConfirmDialog isOpen={deleteDialog} propmt={deletePropmt} id={deleteProductid} onConfirm={handleDeleteProduct} onCancel={() => setDeleteDialog(false)} />

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                allCategories={allCategories}
                allSubcategories={allSubcategories}
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                // onCategoryChange={(e) => setSelectedCategory(e.target.value)}
                setSelectedCategory={setSelectedCategory}
                // onSubcategoryChange={(e) => setSelectedSubcategory(e.target.value)}
                setSelectedSubcategory={setSelectedSubcategory}
            />

            <div className="add-prod-btn">
                <div className='search-filter'>
                    <button className="filter-btn" onClick={() => setIsFilterOpen(true)}>
                        <i class="bi bi-filter" ></i>Filter
                    </button>
                    {/* <SearchBox /> */}
                    <div className="search-box">
                        {/* <FaSearch className="search-icon" /> */}
                        <i class="bi bi-search search-icon"></i>
                        <input
                            ref={SearchBtn}
                            type="text"
                            // value={value}
                            onChange={onSearchInputChange}
                            placeholder={'Search..'}
                            className="search-input"
                        />
                    </div>
                    <button
                        className="add-category-button"
                        style={{
                            padding: '10px 14px',
                            borderRadius: '20px',
                            opacity: isSearchBtnDisable ? 0.5 : 1,
                            cursor: isSearchBtnDisable && 'no-drop'
                        }}
                        onClick={handleSearchText}
                    >
                        Search
                    </button>
                </div>
                <button
                    className="add-category-button"
                    onClick={() => navigate(`/addProduct`)}
                >
                    <i className="bi bi-plus-lg"></i> Add Product
                </button>
            </div>
            <h2 className='product-list-title'>All Products</h2>
            {showRenderProduct && renderProducts.length === 0 && <p className='no-record'>No Product Found</p>}

            <div className="above-product">
                {showRenderProduct && renderProducts.length > 0 && <p className='total-record'>Total {renderProducts.length} Products</p>}
                <button className="show-btn"
                    onClick={handleDownloadCsv}
                    style={{
                        height: '30px',
                        opacity: selectedProducts.length <= 0 && '0.5',
                        cursor: selectedProducts.length <= 0 && 'no-drop'
                    }}>
                    download CSV
                </button>
            </div>
            <div className="product-list">
                {showRenderProduct && renderProducts.map((prod, i) => (
                    <div key={i} className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${prod._id}`)}>
                        {/* {console.log('prod', prod)} */}
                        <img src={imageReader(prod, "mainImage")} alt={prod.name} />
                        <div className="product-info">
                            <input type="checkbox" className='product-checkbox' value={prod._id} onClick={(e) => handleCheckBoxClick(e)} />
                            <h6>{prod.productName}</h6>
                            <div className="actions">
                                <i className="bi bi-pencil-fill edit-icon"></i>
                                <p>${prod.price}</p>
                                <i className="bi bi-trash3-fill delete-icon" onClick={(e) => deleteIconClicked(e, prod)}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* </div> */}
        </>
    )
}

export default AllProducts