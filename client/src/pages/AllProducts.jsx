import React, { use, useEffect, useRef, useState } from "react";
import "./AllProducts.css";
import imageReader from "../helpers/imageReader";
import api from "../axiosConfig";
import { useNavigate } from "react-router";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import SearchBox from "../components/SearchBox";
import FilterModal from "../components/FilterModal";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import UploadCsvModal from "../components/UploadCsvModal";

const AllProducts = ({
    productsList,
    isproductListReady,
    subCategoryId,
    categoryId,
}) => {
    const navigate = useNavigate();
    const [renderProducts, setRenderProducts] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePropmt, setDeletePropmt] = useState("");
    const [deleteProductid, setDeleteProductid] = useState("");
    const [deleteSingleOrMulti, setDeleteSingleOrMulti] = useState(null);
    const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [clearSearch, setClearSearch] = useState(false);

    // const [showRenderProduct, setShowRenderProduct] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isRenderedFirstTime, setIsRenderedFirstTime] = useState(true);
    const [allCategories, setAllCategories] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    const [selectedProductOfAllPage, setSelectedProductOfAllPage] = useState([]);
    const [isAllProdSelected, setIsAllProdSelected] = useState(false);

    const [totalProduct, setTotalProduct] = useState();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        clearSearch ? getProductBySearchText() : getProducts();
    }, [pageNo, pageSize]);

    async function handleDeleteProduct(id) {
        try {
            const response = await api.delete(`/product/id/${id}`);  // product api
            console.log(response);
            getProducts();
        } catch (error) {
            console.log("error in deleting product", error);
        }
    }

    async function getProducts() {
        try {
            const response = await api.get(
                `/product?pageNo=${pageNo - 1}&pageSize=${pageSize}`
            );  // product api
            // console.log("response.data", response.data);
            setRenderProducts(response.data.allProduct);
            setTotalProduct(response.data.totalProduct);
            // handleIsAllProdSelected();
            // setSelectedProductOfAllPage([]);
        } catch (error) {
            console.log("Error in get all product", error);
        }
    }

    useEffect(() => {
        handleIsAllProdSelected();
    }, [renderProducts])


    async function deleteIconClicked(e, prod) {
        e.stopPropagation(); // stop event bubbling, when clicked in delete icon eventually also clicked on product's div
        setDeleteSingleOrMulti("single");
        setDeletePropmt(
            `Are you sure you want to delete ${prod.productName} product?`
        );
        setDeleteProductid(prod._id);
        setDeleteDialog(true);
    }

    // useEffect(() => {
    //     async function setProducts() {
    //         //   if (isproductListReady) {
    //         //     console.log("setting productsList");
    //         //     console.log("from allproduct productList", productsList);
    //         //     setRenderProducts(productsList);
    //         //   } else {
    //         // console.log("getProducts();");
    //         getProducts();
    //         //   }
    //     }
    //     // setProducts();
    // }, []);

    async function getCatAndSubCat() {
        try {
            const response = await api.get("/category");  // product api
            console.log("response.data", response.data);
            setAllCategories(response.data.allCategory);
        } catch (error) {
            console.log("Error in get category", error);
        }

        try {
            const response = await api.get("/subCategory");  // product api
            console.log("response.data", response.data);
            setAllSubcategories(response.data.allSubCategory);
        } catch (error) {
            console.log("Error in get subcategory", error);
        }
    }

    useEffect(() => {
        if (isFilterOpen && isRenderedFirstTime) {
            getCatAndSubCat();
            setIsRenderedFirstTime(false);
        }
    }, [isFilterOpen]);

    async function getProductBySearchText() {
        if (!clearSearch) {
            setPageNo(1);
            setIsAllProdSelected(false);
            setSelectedProductOfAllPage([]);
        }
        async function callApi() {
            try {
                const searchedProducts = await api.get(`/product/searchBy/${searchText}?pageNo=${pageNo - 1}&pageSize=${pageSize}`);  // product api
                setRenderProducts(searchedProducts.data.data);
                setClearSearch(true);

                setTotalProduct(searchedProducts.data.totalProduct);
            } catch (error) {
                console.log("error in search api", error);
            }
        }
        setTimeout(() => callApi(), 300);  // setTiemOut for `setPageNo(1)` is async
    }

    function handleClearSearch() {
        setClearSearch(false);
        setSearchText('');
        setIsAllProdSelected(false);
        setSelectedProductOfAllPage([]);
        setPageNo(1);
        setTimeout(() => getProducts(), 300); // setPageNo(1) takes time
    }

    function handleCheckboxDivClicked() {

    }

    function handleCheckBoxClick(e) {
        e.stopPropagation();
        const { value, checked } = e.target;
        checked
            ? setSelectedProductOfAllPage((prev) => [...prev, value])
            : setSelectedProductOfAllPage((prev) => prev.filter((v) => v !== value));
    }

    function handleIsAllProdSelected() {
        if (selectedProductOfAllPage.length > 0) {
            const flag = renderProducts.every((prod) => selectedProductOfAllPage.includes(prod._id));
            setIsAllProdSelected(flag);
        }
        // setIsAllProdSelected(false);
    }

    function handleAllCheckBoxClicked(e) {
        e.stopPropagation();

        if (isAllProdSelected) {
            const arr = selectedProductOfAllPage;
            renderProducts.forEach((prod) => {
                const idx = selectedProductOfAllPage.findIndex((id) => id === prod._id);
                // console.log('idx', idx);
                arr.splice(idx, 1);
            });
            setSelectedProductOfAllPage(arr);
            setIsAllProdSelected(false);
        } else {
            const prodObj = renderProducts.filter((prod) => !selectedProductOfAllPage.includes(prod._id));
            const arr = prodObj.map(prod => prod._id);
            console.log('arr2', arr);
            setSelectedProductOfAllPage((prev) => [...prev, ...arr]);
            setIsAllProdSelected(true);
        }
    }

    useEffect(() => {
        handleIsAllProdSelected();
        console.log('selectedProductOfAllPage', selectedProductOfAllPage)
    }, [selectedProductOfAllPage])

    async function handleDownloadCsv() {
        console.log(
            "selectedProductOfAllPage.length",
            selectedProductOfAllPage.length
        );
        if (selectedProductOfAllPage.length > 0) {
            try {
                const response = await api.post(
                    "/product/downloadCsv",
                    { selectedIds: selectedProductOfAllPage },
                    {
                        responseType: "Blob", //  important for file download
                    }
                );  // product api

                const blob = new Blob([response.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "selected_Products.csv"); // or .csv
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                console.log("error in download CSV", error);
            }
        }
    }

    function handleDeleteBtnClicked() {
        setDeleteSingleOrMulti("multiple");
        setDeleteDialog(true);
        setDeletePropmt(
            `Are you sure you want to delete All  ${selectedProductOfAllPage.length} Selcted product?`
        );
    }

    function handleDeleteAllSelected() {
        selectedProductOfAllPage.forEach(async (id) => {
            await handleDeleteProduct(id);
        });
    }

    function handlecsvUpload() {
        setIsUploadCsvModalOpen(true);
    }

    return (
        <>
            <Navbar />

            {isUploadCsvModalOpen &&
                <UploadCsvModal
                    isOpen={isUploadCsvModalOpen}
                    onClose={() => setIsUploadCsvModalOpen(false)}
                    onSubmit={getProducts} />}

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

            {deleteSingleOrMulti === "multiple" && (
                <DeleteConfirmDialog
                    isOpen={deleteDialog}
                    propmt={deletePropmt}
                    onConfirm={handleDeleteAllSelected}
                    onCancel={() => {
                        setDeleteDialog(false);
                        setDeleteSingleOrMulti(null);
                        // setSelectedProductOfAllPage([]);
                    }}
                    cancelTxt={'Cancel'}
                    doneTxt={selectedProductOfAllPage.length > 1 ? 'Delete All' : 'Delete'}
                />
            )}

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

            <div className="all-product-container">
                <h2 className="product-list-title">All Products</h2>

                <div className="add-prod-btn">
                    <div className="search-filter">
                        <button
                            className="filter-btn"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <i className="bi bi-filter"></i>Filter
                        </button>
                        {/* <SearchBox /> */}
                        <div className="search-box">
                            {/* <FaSearch className="search-icon" /> */}
                            <i className="bi bi-search search-icon"></i>
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder={"Search.."}
                                className="search-input"
                                style={{ border: clearSearch && '4px solid #00aaff' }}
                            />
                            {clearSearch && <i className="bi bi-x-lg cross-icon" onClick={handleClearSearch} style={{ color: '#00aaff' }}></i>}
                        </div>
                        <button
                            className="submit-btn"
                            style={{
                                padding: "10px 14px",
                                borderRadius: "20px",
                                opacity: searchText.length <= 0 ? 0.5 : 1,
                                cursor: searchText.length <= 0 && "no-drop",
                            }}
                            onClick={getProductBySearchText}
                        >
                            Search
                        </button>
                    </div>
                    <button
                        className="add-category-button primary"
                        onClick={() => navigate(`/addProduct`)}
                    >
                        <i className="bi bi-plus-lg"></i> Add Product
                    </button>
                </div>
                {renderProducts.length === 0 && (
                    <p className="no-record">No Product Found</p>
                )}

                <div className="above-product">
                    <div style={{ display: "flex", gap: "14px" }}>
                        <button
                            className={`submit-btn ${selectedProductOfAllPage.length <= 0 && "disableDelete"
                                }`}
                            onClick={handleDownloadCsv}
                            style={{ height: "35px" }}
                        >
                            download CSV
                        </button>

                        <div className="delete-div">
                            <button
                                type="button"
                                className={`btn delete-btn ${selectedProductOfAllPage.length <= 0 && "disableDelete"
                                    }`}
                                onClick={
                                    selectedProductOfAllPage.length > 0
                                        ? handleDeleteBtnClicked
                                        : null
                                }
                            >
                                <i
                                    className="bi bi-trash3-fill"
                                    style={{ marginRight: "4px" }}
                                ></i>
                                Delete
                            </button>
                        </div>
                    </div>
                    <div className="upload-csv-div">
                        <span onClick={handlecsvUpload}>Upload .csv file and update data</span>
                    </div>
                </div>

                <div className="above-product-list containerr">
                    <div className="">
                        <input
                            type="checkbox"
                            className="product-checkboxx"
                            style={{ marginRight: "7px" }}
                            onClick={(e) => handleAllCheckBoxClicked(e)}
                            checked={isAllProdSelected}
                        />
                        <span onClick={(e) => handleAllCheckBoxClicked(e)}>
                            Select All Product
                        </span>
                    </div>
                    {/* {renderProducts.length > 0 && ( */}
                    <p className="">Total Products: {totalProduct}</p>
                    {/* )} */}
                </div>


                {/* <div style={{ margin: '0 auto' }} className='grid-container'> */}
                <div className="product-list">
                    {renderProducts.length <= 0 && <p className="no-record">No Record Found</p>}

                    {renderProducts?.map((prod, i) => (
                        <>
                            <div
                                key={i}
                                className={`product-card ${i === 0 && "first-product"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/product/${prod._id}`)}
                            >
                                <img src={imageReader(prod, "mainImage")} alt={prod.name} />
                                <div className="product-info">
                                    <div className="product-name">
                                        <label className="" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="product-checkboxx"
                                                value={prod._id}
                                                checked={selectedProductOfAllPage.includes(prod._id)}
                                                onClick={(e) => handleCheckBoxClick(e)}
                                            />
                                        </label>
                                        <div className="act-btn">
                                            <h6> {prod.productName}</h6>
                                            <div className="actions">
                                                {/* <i className="bi bi-pencil-fill edit-icon"></i> */}
                                                <p>Rs {' '} {prod.salePrice}</p>
                                                <i
                                                    className="bi bi-trash3-fill delete-iconn"
                                                    onClick={(e) => deleteIconClicked(e, prod)}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                {/* </div> */}
            </div>
            <Pagination
                totalItems={totalProduct}
                pageSizeOptions={[5, 10, 20, 50]}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
                pageNo={pageNo}
                pageSize={pageSize}
            // getProducts={getProducts}
            />
        </>
    );
};

export default AllProducts;
