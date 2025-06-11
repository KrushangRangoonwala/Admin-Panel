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
import ProductTable from "./ProductTable";
import Select from "../try/Select";
import SingleSelect from "../try/SingleSelect";
// import debounce from "lodash.debounce";

const AllProducts = ({
    productsList,
    isproductListReady,
    subCategoryId,
    categoryId,
}) => {
    const navigate = useNavigate();
    const debounceTimer = useRef(null);
    const [allCategory, setAllCategory] = useState([]);
    const [renderProducts, setRenderProducts] = useState([]);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePropmt, setDeletePropmt] = useState("");
    const [deleteProductid, setDeleteProductid] = useState("");
    const [deleteSingleOrMulti, setDeleteSingleOrMulti] = useState(null);
    const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedProductNameList, setSearchedProductNameList] = useState([]);
    const [clearSearch, setClearSearch] = useState(false);
    const [isSearchOn, setIsSearchOn] = useState(false);
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
    const [totalPages, setTotalPages] = useState();

    const [sortedField, setSortedField] = useState({ feild: '', order: 0 });

    const [EditInputVal, setEditInputVal] = useState();

    useEffect(() => {
        sortedField.feild !== '' && sortedField.order !== 0 ? getSortedProducts() : isSearchOn ? searchProduct() : getProducts();
    }, [pageNo, pageSize]);

    useEffect(() => {
        setPageNo(1);
        setTotalPages(Math.ceil(totalProduct / pageSize))
    }, [pageSize])

    useEffect(() => {
        setTotalPages(Math.ceil(totalProduct / pageSize))
    }, [totalProduct])

    // useEffect(() => {
    //     setPageNo(1);
    // }, [isSearchOn])

    async function searchProduct(txt = searchText) {  // txt is optional, if not passed it will take searchText state value
        console.log('txt', txt);
        try {
            const searchedProducts = await api.get(`/product/searchBy/${txt}?pageNo=${pageNo - 1}&pageSize=${pageSize}`);  // product api
            handleSortingField(''); // reset sorting when search is performed
            setRenderProducts(searchedProducts.data.data);
            setSearchedProductNameList(searchedProducts.data.data.map((prod) => prod.productName));
            setTotalProduct(searchedProducts.data.totalProduct);
        } catch (error) {
            console.log("error in search api", error);
        }
    }

    function debounce(func, delay) {
        // console.log('debounceTimer', debounceTimer.current);
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(func, delay);
    }

    function handleSearchTextChange(txt) {
        // const txt = e.target.value;
        setPageNo(1);
        setSearchText(txt);

        debounce(() => {
            console.log('Debounced value:', txt);
            if (txt.length > 3) {
                // console.log("if (txt.length > 0) {");
                setIsSearchOn(true);
                searchProduct(txt);
            } else {
                console.log("getProducts() called");
                setIsSearchOn(false);
                getProducts();
            }
        }, 800);
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

    async function getProducts() {
        // setIsSearchOn(false);
        try {
            const response = await api.get(
                `/product?pageNo=${pageNo - 1}&pageSize=${pageSize}`
            );  // product api
            // console.log("response.data", response.data);
            setRenderProducts(response.data.allProduct);
            setTotalProduct(response.data.totalProduct);
            // setSearchedProductNameList(response.data.allProduct.map((prod) => prod.productName));
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

    function handleCheckBoxClick(e) {
        e.stopPropagation();
        const { value, checked } = e.target;
        checked
            ? setSelectedProductOfAllPage((prev) => [...prev, value])
            : setSelectedProductOfAllPage((prev) => prev.filter((v) => v !== value));
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

    function handleIsAllProdSelected() {
        if (selectedProductOfAllPage.length > 0) {
            const flag = renderProducts.every((prod) => selectedProductOfAllPage.includes(prod._id));
            setIsAllProdSelected(flag);
        }
        // setIsAllProdSelected(false);
    }

    useEffect(() => {
        handleIsAllProdSelected();
        // console.log('selectedProductOfAllPage', selectedProductOfAllPage)
    }, [selectedProductOfAllPage])

    // function handleClickOutSide(e) {
    //     console.log('e.target.value', e.target.value);
    // }

    // const EditInput = () => {
    //     return (
    //         <input type='number' onBlur={handleClickOutSide} value={EditInputVal} onChange={(e) => setEditInputVal(e.target.value)} />
    //     )
    // }

    // function handledblClick(e) {
    //     console.log('e.target.value', e.target.value);
    //     e.target.innerHTML =  <EditInput />;
    // }

    async function updateProductByFewFields(id, fieldName, fieldValue) {
        try {
            const response = await api.put(`product/updateProductByFewField/id/${id}`, { [fieldName]: fieldValue });
            console.log('response', response);
            setTimeout(() => setPageNo(pageNo), 1000);  // setPageNo(pageNo) trigger ueffect, inside useEffect getProducts() clalls
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    const PriceCell = ({ id, fieldName, fieldValue }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(fieldValue);
        const inputRef = useRef(null);

        const handleDoubleClick = () => {
            setIsEditing(true);
        };

        const handleChange = (e) => {
            setValue(e.target.value);
        };

        const handleBlur = () => {
            fieldValue !== value && updateProductByFewFields(id, fieldName, value);
            setIsEditing(false);
            console.log('User input value:', value);
        };

        return (
            <td onDoubleClick={handleDoubleClick}>
                {isEditing ? (<>
                    ₹ <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={e => e.key === 'Enter' ? handleBlur() : null}
                        // onFocus={() => inputRef.current.select()}  // doesn't working
                        autoFocus
                        className="edit-input"
                    /></>
                ) : (
                    `₹ ${value}`
                )}
            </td>
        );
    };

    const StatusCell = ({ id, fieldName, fieldValue }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(fieldValue);
        const selectRef = useRef(null);
        const tdRef = useRef(null);

        // Detect clicks outside the <td> to exit editing mode
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (isEditing && tdRef.current && !tdRef.current.contains(event.target)) {
                    event.stopPropagation();
                    handleBlur();
                }
            };

            if (isEditing) {
                document.addEventListener('click', handleClickOutside);
            }

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }, [isEditing, value]); // Dependencies ensure the listener updates correctly


        const handleBlur = (e) => {
            setIsEditing(false); // Exit editing mode after selection
            console.log('Selected value:', value);
            if (fieldValue !== value) {
                updateProductByFewFields(id, fieldName, value);
            }
        };

        // Define options based on fieldName
        const options = ['Ready to Ship', 'On Booking'];

        return (
            <td ref={tdRef} onDoubleClick={() => setIsEditing(true)} className="border border-gray-300 px-4 py-2 relative">
                {isEditing ? (
                    <select
                        ref={selectRef}
                        value={value}
                        onBlur={handleBlur}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' ? handleBlur(e) : null}
                        className="status-select"
                        // autoFocus
                    >
                        <option value='ReadyToShip'>Ready to Ship</option>
                        <option value='onBooking'>On Booking</option>
                    </select>
                ) : (
                    `${fieldName === 'salePrice' ? '₹' : ''}${value}`
                )}
            </td>
        );
    };

    async function getAllCat() {
        try {
            const response = await api.get('/category');  // category api
            // console.log('Categories:', response.data);
            setAllCategory(response.data.allCategory);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function getCatName(id) {
        const cat = allCategory.find((val) => val._id === id);
        // console.log('cat', cat);
        return cat?.name;
    }

    useEffect(() => {
        getProducts();
        getAllCat();
    }, [])


    function handleSortingField(field) {
        console.log('field', field);
        // setPageNo(1);
        setSortedField((prev) => {
            if (prev.feild === field) {
                switch (prev.order) {
                    case 0: return { feild: field, order: 1 };
                    case 1: return { feild: field, order: -1 };
                    case -1: return { feild: field, order: 0 };
                    default: return { feild: field, order: 1 };
                }
            } else {
                return { feild: field, order: 1 }; // reset order to 0 for new field
            }
        });
        // console.log('sortedField', sortedField);
    }

    async function getSortedProducts() {
        try {
            const response = await api.get(`/product/sort?sortBy=${sortedField.feild}&order=${sortedField.order}&pageNo=${pageNo - 1}&pageSize=${pageSize}`);
            console.log("response.data", response.data);
            setRenderProducts(response.data.allProduct);
            setTotalProduct(response.data.totalProduct);
        } catch (error) {
            console.log("error in sorting", error);
        }
    }

    useEffect(() => {
        if (sortedField.feild !== '' && sortedField.order !== 0) {
            getSortedProducts();
        } else if (searchText.length <= 0) {
            console.log('searchText', searchText);
            getProducts();
        }
    }, [sortedField])

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

    function SortingArrows({ order }) {  // use {} to wrap the order prop
        // console.log('order', order);
        // console.log('order === 1', order == 1);
        return <span >
            <sup><i className="bi bi-caret-up-fill up-arrow" style={{ opacity: order === 1 && "0.5" }}></i></sup>
            <sub><i className="bi bi-caret-down-fill down-arrow" style={{ opacity: order === -1 && "0.5" }}></i></sub>
        </span>
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

            <div className="table-container">
                <div className="table-box">
                    <div className="add-prod-btn">
                        <h3 className="">All Products</h3>

                        <button
                            className="btn submit-btn"
                            onClick={() => navigate(`/addProduct`)}
                            style={{ padding: "10px 14px" }}
                        >
                            <i className="bi bi-plus-lg"></i> Add Product
                        </button>
                    </div>
                    <div className="top-actions">
                        {/* <div className="search-bar">
                            <i class="bi bi-search search-icon"></i>
                            <input type="text"
                                placeholder="Search Product..."
                                onChange={e => handleSearchTextChange(e.target.value)}
                                style={{ outline: isSearchOn ? "2px solid #00aaff" : null }}
                                value={searchText}
                            />
                        </div> */}

                        {/* <div className="form-groupp"> */}
                        {/* <label style={{ marginBlock: '5px' }}>SubCategory:</label> */}
                        <div className="add-select">
                            <SingleSelect optionsData={searchedProductNameList}
                                selected={searchText}
                                onChange={handleSearchTextChange}
                                setSelected={setSearchText}
                                fieldName="Products" />
                        </div>
                        {/* </div> */}

                        <div className="action-buttons">
                            <button
                                className={`btn submit-btn ${selectedProductOfAllPage.length <= 0 && "disableDelete"}`}
                                onClick={selectedProductOfAllPage.length > 0 ? handleDownloadCsv : null}
                            ><i className="bi bi-download"></i> Download CSV</button>
                            <button
                                className={`btn delete-btn ${selectedProductOfAllPage.length <= 0 && "disableDelete"}`}
                                onClick={selectedProductOfAllPage.length > 0 ? handleDeleteBtnClicked : null}
                            >Delete All</button>
                            <button
                                className={`btn edit-btn`}
                                onClick={handlecsvUpload}
                            ><i className="bi bi-upload"></i> Upload CSV</button>
                        </div>
                    </div>

                    <div className="
                    ">
                        <div className="entries-select">
                            <span>Showing
                                {' '} <b>{(pageNo - 1) * pageSize + 1}</b> {' '}
                                to {' '}<b>{pageNo === totalPages ? totalProduct : (pageNo * pageSize)} </b>{' '}
                                of {' '}<b>{totalProduct}</b>{' '}
                                products</span>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox"
                                            className="product-checkboxx"
                                            onChange={(e) => handleAllCheckBoxClicked(e)}
                                            checked={isAllProdSelected} />
                                    </th>
                                    <th>Main Image</th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('productName')
                                    }}>
                                        <div className="sort-th">
                                            Product
                                            <SortingArrows order={sortedField.feild === 'productName' && sortedField.order} />
                                        </div>
                                    </th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('category')
                                    }}>
                                        {/* <div className="sort-th"> */}
                                        Category
                                        {/* <SortingArrows order={sortedField.feild === 'category' && sortedField.order} /> */}
                                        {/* </div> */}
                                    </th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('mrpPrice')
                                    }}>
                                        <div className="sort-th">
                                            MRP Price
                                            <SortingArrows order={sortedField.feild === 'mrpPrice' && sortedField.order} />
                                        </div>
                                    </th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('salePrice')
                                    }}>
                                        <div className="sort-th">
                                            Sale Price
                                            <SortingArrows order={sortedField.feild === 'salePrice' && sortedField.order} />
                                        </div>
                                    </th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('status')
                                    }}>
                                        <div className="sort-th">
                                            Status
                                            <SortingArrows order={sortedField.feild === 'status' && sortedField.order} />
                                        </div>
                                    </th>
                                    <th onClick={() => {
                                        setSearchText('');
                                        handleSortingField('weight')
                                    }}>
                                        <div className="sort-th">
                                            Weight
                                            <SortingArrows order={sortedField.feild === 'weight' && sortedField.order} />
                                        </div>
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            < tbody >
                                {
                                    renderProducts.length === 0 ? (<>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td className="no-record">No Product Found</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </>)
                                        : renderProducts?.map((prod, i) => (
                                            <tr key={i}>

                                                <td>
                                                    <input type="checkbox"
                                                        className="product-checkboxx"
                                                        value={prod._id}
                                                        checked={selectedProductOfAllPage.includes(prod._id)}
                                                        onChange={(e) => handleCheckBoxClick(e)} />
                                                </td>

                                                <td onClick={() => navigate(`/product/${prod._id}`)} style={{ cursor: 'pointer' }}><img src={imageReader(prod, "mainImage")} alt={prod.productName} /></td>

                                                <td>{prod.productName}</td>
                                                <td>{getCatName(prod.categoryId)}</td>
                                                {/* <td>₹ {prod.mrpPrice}</td> */}
                                                <PriceCell id={`${prod._id}`} fieldName="mrpPrice" fieldValue={prod.mrpPrice} />
                                                {/* <td>₹ {prod.salePrice}</td> */}
                                                <PriceCell id={`${prod._id}`} fieldName="salePrice" fieldValue={prod.salePrice} />
                                                {/* <td>
                                                    {prod.status === "ReadyToShip" ? "Ready to Ship" : prod.status === "onBooking" ? "On Booking" : " - "}
                                                </td> */}
                                                <StatusCell id={`${prod._id}`} fieldName="status" fieldValue={prod.status} />

                                                <td>{prod.weight} kg</td>
                                                <td>
                                                    <button
                                                        className="action-btnn btn edit-btn"
                                                        onClick={() => navigate(`/product/${prod._id}`)}
                                                    ><i className="bi bi-pencil-fill"></i></button>
                                                    <button
                                                        className="action-btnn btn delete-btn"
                                                        onClick={(e) => deleteIconClicked(e, prod)}
                                                    ><i className="bi bi-trash-fill"></i></button>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        totalProduct={totalProduct}
                        totalPages={totalPages}
                        pageSizeOptions={[5, 10, 20, 50]}
                        setPageNo={setPageNo}
                        setPageSize={setPageSize}
                        pageNo={pageNo}
                        pageSize={pageSize}
                    // getProducts={getProducts}
                    />
                </div>
            </div >

            {/* <ProductTable /> */}

        </>
    );
};

export default AllProducts;
