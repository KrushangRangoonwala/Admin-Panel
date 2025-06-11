import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import './ProductForm.css';
import { useNavigate, useParams } from 'react-router';
import api from '../axiosConfig';
import imageReader, { multipleImageReader } from '../helpers/imageReader';
import Navbar from '../components/Navbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SubCategoryForm from '../components/SubCategoryForm';
import CategoryForm from '../components/CategoryForm';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import Popup from '../components/Popup';
import Select from '../try/Select';
import Step from '../try/Step';
import ImageUpload from '../try/ImageUpload';
import { MdCloudUpload } from 'react-icons/md';

const AddProductForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { categoryId, subCategoryId } = useParams();
    const popupContainer = useRef(null);

    const [category, setcategory] = useState([])
    const [subCategory, setSubCategory] = useState([]);
    const [allSize, setAllSize] = useState([]);
    const [editProductData, setEditProductData] = useState(null);

    const [previewMainImgUrl, setPreviewMainImgUrl] = useState('');

    const [previewSubImageUrls, setPreviewSubImageUrls] = useState([]);
    const [previewSubImgData, setPreviewSubImgData] = useState([]);
    const [newlySelectedSubImg, setNewlySelectedSubImg] = useState([]);
    const [uploadedSubImgData, setUploadedSubImgData] = useState([]);
    const [indexesToRemoveSubImg, setIndexesToRemoveSubImg] = useState([]);
    const [selectedDuplicateSubImgNames, setSelectedDuplicateSubImgNames] = useState([]);
    // const [isDuplicateSubImgSelected, setIsDuplicateSubImgSelected] = useState(false);

    // const [uploadedSubImageUrl, setUploadedSubImageUrl] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imgIcon, setImgIcon] = useState('');
    const [isRemoveMainImg, setIsRemoveMainImg] = useState(false)

    const [isSubCatListOpen, setIsSubCatListOpen] = useState(false);
    const [selectedSubCat, setSelectedSubCat] = useState([]);
    const [isSelectedSubCatSet, setIsSelectedSubCatSet] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [stockSizeList, setStockSizeList] = useState([{ size: '', stock: '' }]);
    // setStockSizeList(prev => [...prev, { size: 'aabc', stock: 21   }])
    const [remainingSizes, setRemainingSizes] = useState([]);
    const addStockBtn = useRef(null);

    const [isSizeListOpen, setIsSizeListOpen] = useState(false);
    const [popupContent, setPopupContent] = useState('');
    const [isImgLarger, setIsImgLarger] = useState(false);

    const [isCatFormOpen, setIsCatFormOpen] = useState(false);
    const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);

    let str;

    // useEffect(() => {
    //   setIsSelectedSubCatSet(true);
    //   console.log('###selectedSubCat', selectedSubCat);
    // }, [selectedSubCat])

    async function getAllCategory() {
        try {
            const response = await api.get('/category');  // category api
            console.log('Categories:', response.data);
            setcategory(response.data.allCategory);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getSubCatByCat(categoryId) {
        try {
            const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);  // subCategory api
            console.log('Subcategories:', response.data);
            setSubCategory(response.data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getAllSize() {
        try {
            const response = await api.get("/size");  // size api
            // console.log("Sizes:", response.data);
            setAllSize(response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getSizeById(id) {
        try {
            const response = await api.get(`/size/id/${id}`);  // size api
            // console.log('response.data.data', response.data.data);
            return response.data.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    async function getSubcatById(id) {
        try {
            const response = await api.get(`/subCategory/id/${id}`);  // subCategory api
            // console.log('response.data.data', response.data.data);
            return response.data.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        getAllSize();
        async function setCatandSubCat(categoryId, subCategoryId) {
            await getAllCategory();
            // await getAllSize();
            if (categoryId) {
                formik.setFieldValue('categoryId', categoryId);
                await getSubCatByCat(categoryId);
            }
            subCategoryId && formik.setFieldValue('subCategoryId', subCategoryId);
            // console.log('subCategoryId in useEffcet', subCategoryId)
        }
        setCatandSubCat(categoryId, subCategoryId);

        async function getProductById() {
            try {
                await getAllCategory();
                // await getAllSize();
                const response = await api.get(`/product/id/${productId}`);  // product api
                console.log('Product Data:', response.data);
                const productData = response.data.data;
                console.log('productData', productData)
                await getSubCatByCat(productData.categoryId);
                setEditProductData(productData);
                // formik.setValues(productData);
                formik.setFieldValue('categoryId', productData.categoryId);
                formik.setFieldValue('productName', productData.productName);
                formik.setFieldValue('quantity', productData.quantity);
                formik.setFieldValue('mrpPrice', productData.mrpPrice);
                formik.setFieldValue('salePrice', productData.salePrice);
                formik.setFieldValue('status', productData.status);
                formik.setFieldValue('weight', productData.weight);
                formik.setFieldValue('desc', productData.desc);
                formik.setFieldValue('mainImage', null);
                setStockSizeList(productData.stockSize)
                // formik.setFieldValue('subImages', [null]);

                const prevSelectedSubCat = [];
                // const prevSelectedSize = [];

                productData.subCategoryId.forEach(async (id) => {
                    const sub = await getSubcatById(id);
                    prevSelectedSubCat.push({ id: sub._id, name: sub.name })
                })

                // productData.size.forEach(async (id) => {
                //   const size = await getSizeById(id);
                //   prevSelectedSize.push({ id: size._id, name: size.name, shortName: size.shortName })
                // })

                setTimeout(() => {
                    console.log('prevSelectedSubCat', prevSelectedSubCat);
                    setSelectedSubCat(prevSelectedSubCat);
                    // setSelectedSizes(prevSelectedSize);
                }, 500);

                setUploadedSubImgData(productData.subImages);
                const mainImg = imageReader(productData, "mainImage");
                const subImg = multipleImageReader(productData.subImages);
                setUploadedImageUrl(mainImg);
                setPreviewMainImgUrl(mainImg);
                productData.mainImage && setImgIcon('trash');
                // setUploadedSubImageUrl(multipleImageReader(productData.subImages));
                setPreviewSubImageUrls(subImg);
                // console.log('productData.subImages', productData.subImages)
                setPreviewSubImgData(productData.subImages);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        productId && getProductById();
    }, []);

    useEffect(() => {
        console.log('selectedSubCat', selectedSubCat);
    }, [selectedSubCat])

    async function handleSubmit(values) {
        console.log('Form Values:', values);

        // append values in formData
        const formData = new FormData();
        for (const key in values) {
            if (key === 'mainImage') {
                console.log('values.mainImage', values.mainImage);
                values.mainImage && formData.append('mainImage', values.mainImage);
            } else {
                console.log('key', key);
                formData.append(key, values[key]);
            }
        }
        // console.log('%%% selectedSubCat', selectedSubCat);
        console.log("dfsfsfsdfsdfsfsdfsfsd")
        selectedSubCat.forEach((val) => {
            console.log('val', val);
            console.log('val._id', val._id);
            console.log('typeof val._id', typeof val._id);
            formData.append('subCategoryId', JSON.stringify(val._id))
        });
        stockSizeList.forEach((val) => formData.append('stockSize', JSON.stringify(val)));
        // selectedSizes.forEach((val) => formData.append('size', val.id));

        newlySelectedSubImg.forEach((val) => formData.append('subImages', val));
        console.log('indexesToRemoveSubImg', indexesToRemoveSubImg);
        indexesToRemoveSubImg.forEach((val) => formData.append('indexToRemoveSubImg', val));
        // formData.append('indexToRemoveSubImg', indexesToRemoveSubImg)
        try {
            if (editProductData) {
                formData.append('isRemoveMainImg', isRemoveMainImg);
                const response = await api.put(`/product/id/${productId}`, formData, {  // product api
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Product edited successfully:', response.data);
                navigate(-1);
            } else {
                const response = await api.post('/product', formData, {  // product api
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Product created successfully:', response.data);
                // formik.resetForm(); // resets form to its initialValues.
                // setPreviewSubImageUrls([]);
                // setPreviewMainImgUrl('');
                // setImgIcon('');
                // setSelectedSubCat([]);
                // setSelectedSizes([]);
            }
            // setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            // window.location.reload();
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (error) {
            console.error('Error submitting product form:', error);
        }
    }

    // function isAtleastOneSizeprovided() {

    // }

    const formik = useFormik({
        initialValues: {
            categoryId: '',  // categoryId in backend
            // subCategoryId: '',  // subCategoryId in backend
            productName: '',
            mainImage: null,
            quantity: '',
            mrpPrice: '',
            salePrice: '',
            status: '',
            weight: '',
            desc: ''
        },
        onSubmit: (values) => {
            if (selectedSubCat.length <= 0) {
                setPopupContent('emptySubCat');
            }
            // else if (selectedSizes.length <= 0) {
            //   setPopupContent('emptySize')
            // } 
            else {
                handleSubmit(values)
            }
        }
    });

    const handleCategoryChange = (e) => {
        e.target.value && getSubCatByCat(e.target.value);
        formik.setFieldValue('categoryId', e.target.value);
        // formik.setFieldValue('subCategoryId', '');
        setSelectedSubCat([]);
    };

    async function handleSubImgChange(e) {
        const files = e.currentTarget.files;
        const fileArray = Array.from(files);
        const filteredFiles = [];
        const arr = [];

        fileArray.forEach((file) => {
            console.log('previewSubImgData.some(val => val.originalName === file.name)', previewSubImgData.some(val => val.originalName === file.name))
            if (file.size > 400 * 1024) {
                !isImgLarger && setIsImgLarger(true);
            } else if (uploadedSubImgData.some(val => val.originalName === file.name)
                || previewSubImgData.some(val => val.name === file.name)) {
                arr.push(file.name);
            } else {
                setPreviewSubImgData(prev => [...prev, file]);
                setNewlySelectedSubImg(prev => [...prev, file]);
                filteredFiles.push(file)
            }
        })

        setSelectedDuplicateSubImgNames(arr);
        const previewUrls = filteredFiles.map(file => URL.createObjectURL(file));
        setPreviewSubImageUrls(prev => [...prev, ...previewUrls]);
    }

    function handleRemoveSubImgUpload(index, orgName) {
        console.log(' previewSubImgData', previewSubImgData);
        console.log('previewSubImgData[index].originalName', previewSubImgData[index].originalName);
        const updatedSubImages = [...previewSubImgData];
        updatedSubImages.splice(index, 1);
        setPreviewSubImgData(updatedSubImages);

        const updatedPreviewUrls = [...previewSubImageUrls];
        updatedPreviewUrls.splice(index, 1);
        setPreviewSubImageUrls(updatedPreviewUrls);

        setNewlySelectedSubImg(prev => prev.filter(val => val.orginalName !== orgName))
        console.log('orgName', orgName);
        if (productId) {
            const uploadedSubImgIndex = uploadedSubImgData.findIndex((val, idx) => {
                console.log('val', val);
                return val.originalName === orgName;
            })
            console.log('uploadedSubImgIndex', uploadedSubImgIndex);
            if (uploadedSubImgIndex !== -1) {
                setIndexesToRemoveSubImg(prev => [...prev, uploadedSubImgIndex])
            }
        }
    }

    async function handleMainImgChange(e) {
        const file = e.currentTarget.files[0];
        if (file) {
            if (file.size < 400 * 1024) {
                setIsRemoveMainImg(false);
                formik.setFieldValue('mainImage', file);
                setPreviewMainImgUrl(URL.createObjectURL(file));
                setImgIcon('cross');
            } else {
                setIsImgLarger(true);
            }
        }
    }

    function handleCancelMainImgUpload() {
        formik.setFieldValue('mainImage', '');
        if (uploadedImageUrl) {
            setPreviewMainImgUrl(uploadedImageUrl);
            setImgIcon('trash');
        } else {
            setImgIcon('');
            setPreviewMainImgUrl('');
            document.getElementById('mainImage').value = ''
        }
    }

    function handleRemoveMainImg() {
        setIsRemoveMainImg(true);
        setUploadedImageUrl('')
        document.getElementById('mainImage').value = ''
        formik.setFieldValue('mainImage', '');
        setImgIcon('');
        setPreviewMainImgUrl('');
    }

    function handleSubCatClick(e, subCat) {
        console.log('handleSubCatClick');
        e.stopPropagation()
        const exists = selectedSubCat.some(item => item.id === subCat.id);

        if (exists) {
            setSelectedSubCat(prev => prev.filter(item => item.id !== subCat.id));
        } else {
            setSelectedSubCat(prev => [...prev, subCat]);
        }
    }

    function handleSizeClick(size) {
        const exists = selectedSizes.some(item => item.id === size.id);

        if (exists) {
            setSelectedSizes(prev => prev.filter(item => item.id !== size.id));
        } else {
            setSelectedSizes(prev => [...prev, size]);
        }
    }

    function handleAddStockBtnClicked() {
        const obj = { size: '', stock: '' };
        setStockSizeList(prev => [...prev, obj])
    }

    function handleStockSizeChange(idx, field, value) {
        const tempArr = [...stockSizeList];
        tempArr[idx] = { ...tempArr[idx], [field]: value }

        setStockSizeList(tempArr);
    }

    function handleDeleteStockSize(idx) {
        if (stockSizeList.length <= 1) {
            setPopupContent('emptySize');
        } else {
            const tempArr = [...stockSizeList];
            tempArr.splice(idx, 1)
            setStockSizeList(tempArr);
            console.log('tempArr', tempArr);
        }
    }

    function setRemainingSizeList() {
        const arr = allSize.filter(val => {
            return stockSizeList.every(x => {
                return x.size !== val._id
            })
        })
        setRemainingSizes(arr);
    }

    useEffect(() => {
        setRemainingSizeList();
    }, [stockSizeList]);

    useEffect(() => {
        setRemainingSizeList();
    }, [allSize])


    function removeSelectedSubCat(id) {
        setSelectedSubCat(prev => prev.filter(item => item.id !== id));
    }

    function removeSelectedSize(id) {
        setSelectedSizes(prev => prev.filter(item => item.id !== id));
    }

    function handleClick() {
        if (isSubCatListOpen || isSizeListOpen) {
            console.log('Event listner added..');
        } else {
            console.log('Event listner Removed..');
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupContainer.current && !popupContainer.current.contains(event.target)) {
                setIsSubCatListOpen(false);
            }
        }

        if (isSubCatListOpen) {
            setTimeout(() => document.addEventListener('click', handleClickOutside), [300])
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSubCatListOpen]);

    return (
        <>
            <Navbar />
            {/* <DeleteConfirmDialog /> */}
            {popupContent &&
                <Popup message={popupContent === 'emptySubCat' ?
                    'Please Select atleast one Sub category'
                    : popupContent === 'emptySize' && 'Please Select atleast one Available Size and its Stock'
                }
                    onClose={() => setPopupContent('')} />}

            {isImgLarger &&
                <Popup message={`Files greater then 400kb can't upload!\nThat will be excluded.`}
                    onClose={() => setIsImgLarger(false)} />}

            {selectedDuplicateSubImgNames.length > 0 && <>
                {str = selectedDuplicateSubImgNames.join(',  ')}
                <Popup message={`<i style="font-family: monospace;">${str}</i> 
        <br><b style="margin-top: 13px;display: block;">Above Sub Images already exist! <br>You can't upload it again.</b>`}
                    onClose={() => setSelectedDuplicateSubImgNames([])} /> </>}

            {isCatFormOpen && (
                <CategoryForm
                    isOpen={isCatFormOpen}
                    onSubmit={getAllCategory}
                    onClose={() => setIsCatFormOpen(false)}
                />
            )}

            {isSubCatFormOpen && (
                <SubCategoryForm
                    isOpen={isSubCatFormOpen}
                    onSubmit={() => getSubCatByCat(formik.values.categoryId)}
                    onClose={() => setIsSubCatFormOpen(false)}
                />
            )}
            {/* <div> */}
            <div className="add-product-form">
                <h2 className='add-product-title'>{editProductData ? 'Edit ' : 'Add '} Product</h2>
                <form onSubmit={formik.handleSubmit} className="">
                    <Step index={1} title="Product Info" description="Fill all information below">
                        <div className="form-container">
                            <div className="form-grid">
                                <div className="form-groupp">
                                    <label htmlFor="categoryId">Category:</label>

                                    <div className="add-select">
                                        <select
                                            name="categoryId"
                                            value={formik.values.categoryId}
                                            onChange={handleCategoryChange}
                                            style={{ width: '100%' }}
                                            className="form-control mt-label"
                                            required >
                                            <option value="">-- Select Category --</option>
                                            {category.map((cat, index) => (
                                                <option key={index} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button type='button'
                                            className="add-category-button"
                                            onClick={() => setIsCatFormOpen(true)}
                                            // style={{ maxHeight: '20px' }}
                                            style={{ minWidth: '175px' }}
                                        >
                                            <i className="bi bi-plus-lg"></i> Add Category
                                        </button>
                                    </div>
                                </div>

                                <div className="form-groupp">
                                    <label style={{ marginBlock: '5px' }}>SubCategory:</label>
                                    <div className="add-select">
                                        <Select optionsData={subCategory}
                                            selected={selectedSubCat}
                                            setSelected={setSelectedSubCat}
                                            fieldName="Subcategory" />
                                        <button type='button'
                                            className="add-category-button"
                                            onClick={() => setIsSubCatFormOpen(true)}
                                            style={{ minWidth: '175px' }}
                                        >
                                            <i className="bi bi-plus-lg"></i> Add SubCategory
                                        </button>
                                    </div>
                                </div>

                                <div className="form-groupp">
                                    <label>
                                        Product Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formik.values.productName}
                                        onChange={formik.handleChange}
                                        className="form-control mt-label"
                                        required />
                                </div>

                                <div className="form-groupp">
                                    <label> Weight (in kg):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="weight"
                                        value={formik.values.weight}
                                        onChange={formik.handleChange}
                                        step="any"
                                        className="form-control mt-label"
                                        required
                                    />
                                </div>

                                <div className="form-groupp">
                                    <label style={{ marginTop: '10px' }}>
                                        <div style={{ marginBottom: '6px' }}>Description:</div>
                                    </label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={formik.values.desc}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            formik.setFieldValue('desc', data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Step>

                    <Step index={2} title="Product Images" description="Upload product images">
                        <div className="form-container">
                            <div className="image-upload-container">
                                <div className="main-image-section">
                                    <h4 className='image-title'>Main Image</h4>
                                    <label className="image-box">
                                        {previewMainImgUrl ? (
                                            <img src={previewMainImgUrl} alt="Main" className="preview-image" />
                                        ) : (
                                            <div className="upload-icon">
                                                <MdCloudUpload size={40} />
                                                <p>Upload</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="mainImage"
                                            id="mainImage"
                                            onChange={handleMainImgChange}
                                            hidden />
                                    </label>
                                </div>

                                <div className="sub-images-section">
                                    <h4 className='image-title'>SubImages</h4>
                                    <div className="sub-image-grid">
                                        {previewSubImageUrls.map((img, idx) => (
                                            <div className="image-box" style={{ marginTop: '0px' }}>
                                                <img src={img} alt={`Subimage-${idx + 1}`} className="preview-image" />
                                                <i
                                                    className="bi bi-x-circle img-upload-icon"
                                                    onClick={() => handleRemoveSubImgUpload(idx, previewSubImgData[idx].originalName)
                                                    }
                                                ></i>
                                                <div className='img-upload-icon cancel-btn-bg'></div>
                                            </div>
                                        ))}


                                        <label className="image-box" style={{ marginTop: '0px' }}>
                                            <div className="upload-icon">
                                                <MdCloudUpload size={32} />
                                                <p>Upload</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="subImages"
                                                onChange={handleSubImgChange}
                                                multiple
                                                hidden
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Step>

                    <Step index={3} title="Product Pricing" description="Set product pricing and stock">
                        <div className="form-container">
                            <div className="price-div">
                                <label className='price-label'>
                                    <div className='label-cls'>MRP</div>
                                    <input
                                        type="number"
                                        name="mrpPrice"
                                        className="form-control mt-label"
                                        style={{ paddingLeft: '40px', width: '100%' }}
                                        value={formik.values.mrpPrice}
                                        onChange={formik.handleChange}
                                        required
                                    />
                                    <span className='rs-class'>Rs</span>
                                </label>

                                <label className='price-label'>
                                    <div className='label-cls'>Sale Price</div>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        style={{ paddingLeft: '40px', width: '100%' }}
                                        value={formik.values.salePrice}
                                        onChange={formik.handleChange}
                                        className="form-control mt-label"
                                        required
                                    />
                                    <span className='rs-class'>Rs</span>
                                </label>
                            </div>
                            <div className="price-grid">
                                <label>
                                    <div className='label-cls'>Select Status:</div>
                                    <select
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        className='form-control mt-label stockSelect'
                                        required
                                    >
                                        <option value="">-- Select Status --</option>
                                        <option value="ReadyToShip">Ready To Ship</option>
                                        <option value="onBooking">On Booking</option>
                                    </select>
                                </label>

                                <div style={{ marginBottom: '15px' }}>
                                    <div className='label-cls'>Add Stock by Size</div>
                                    <div className=''>
                                        {stockSizeList.map((val, idx) => {
                                            const sizeObj = allSize.find(x => x._id === val.size)
                                            const selectedOp = sizeObj && <option key={'qweqweqwe'} value={sizeObj._id} style={{ display: 'none' }}> {sizeObj.shortName} {" - "} {sizeObj.name} </option>

                                            return (
                                                <div key={idx} className="stockSize">
                                                    <select
                                                        value={val.size}
                                                        onChange={(e) => handleStockSizeChange(idx, 'size', e.target.value)}
                                                        className="form-control"
                                                        required
                                                    >
                                                        <option value="">-- Select Size --</option>
                                                        {remainingSizes.map((size) => (
                                                            <option key={size._id} value={size._id}>
                                                                {size.shortName} - {size.name}
                                                            </option>
                                                        ))}
                                                        {selectedOp}
                                                    </select>

                                                    <input
                                                        type="number"
                                                        value={val.stock}
                                                        onChange={(e) => handleStockSizeChange(idx, 'stock', e.target.value)}
                                                        className="form-control"
                                                        placeholder="Available Quantity"
                                                        required
                                                    />

                                                    <i
                                                        className="bi bi-trash3-fill deleteIcon"
                                                        onClick={() => handleDeleteStockSize(idx)}
                                                    ></i>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <button type='button' ref={addStockBtn} onClick={handleAddStockBtnClicked} className='form-control mt-label add-size-btn'>
                                        <i className="bi bi-plus-lg"></i> Add Size</button>
                                </div>
                            </div>

                        </div>
                    </Step>

                    <div className="product-form-actions">
                        <button type="button" className="act-btnn cancel-product">
                            Cancel
                        </button>
                        <button type="submit" className='act-btnn submit-product'>{editProductData ? 'Update Product' : 'Add Product'}</button>
                    </div>
                </form>
            </div >

            {/* </div> */}
            {/* <ImageUpload /> */}
        </>
    );
};

export default AddProductForm;
