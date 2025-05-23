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

const ProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { categoryId, subCategoryId } = useParams();
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

  // const [uploadedSubImageUrl, setUploadedSubImageUrl] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imgIcon, setImgIcon] = useState('');
  const [isRemoveMainImg, setIsRemoveMainImg] = useState(false)

  const [isSubCatListOpen, setIsSubCatListOpen] = useState(false);
  const [selectedSubCat, setSelectedSubCat] = useState([]);
  const [isSelectedSubCatSet, setIsSelectedSubCatSet] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isSizeListOpen, setIsSizeListOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [isImgLarger, setIsImgLarger] = useState(false)

  const [isCatFormOpen, setIsCatFormOpen] = useState(false);
  const [isSubCatFormOpen, setIsSubCatFormOpen] = useState(false);

  // useEffect(() => {
  //   setIsSelectedSubCatSet(true);
  //   console.log('###selectedSubCat', selectedSubCat);
  // }, [selectedSubCat])

  async function getAllCategory() {
    try {
      const response = await api.get('/category');
      console.log('Categories:', response.data);
      setcategory(response.data.allCategory);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getSubCatByCat(categoryId) {
    try {
      const response = await api.get(`/subCategory/subCategoryByCategory/${categoryId}`);
      console.log('Subcategories:', response.data);
      setSubCategory(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getAllSize() {
    try {
      const response = await api.get("/size");
      // console.log("Sizes:", response.data);
      setAllSize(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getSizeById(id) {
    try {
      const response = await api.get(`/size/id/${id}`);
      // console.log('response.data.data', response.data.data);
      return response.data.data;
    } catch (error) {
      console.log('error', error);
    }
  }

  async function getSubcatById(id) {
    try {
      const response = await api.get(`/subCategory/id/${id}`);
      // console.log('response.data.data', response.data.data);
      return response.data.data;
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    async function setCatandSubCat(categoryId, subCategoryId) {
      await getAllCategory();
      await getAllSize();
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
        await getAllSize();
        const response = await api.get(`/product/id/${productId}`);
        console.log('Product Data:', response.data);
        const productData = response.data.data;
        console.log('productData', productData)
        await getSubCatByCat(productData.categoryId);
        setEditProductData(productData);
        // formik.setValues(productData);
        formik.setFieldValue('categoryId', productData.categoryId);
        formik.setFieldValue('productName', productData.productName);
        formik.setFieldValue('quantity', productData.quantity);
        formik.setFieldValue('priceType', productData.priceType);
        formik.setFieldValue('priceValue', productData.priceValue);
        formik.setFieldValue('status', productData.status);
        formik.setFieldValue('weight', productData.weight);
        formik.setFieldValue('desc', productData.desc);
        formik.setFieldValue('mainImage', null);
        // formik.setFieldValue('subImages', [null]);

        const prevSelectedSubCat = [];
        const prevSelectedSize = [];

        productData.subCategoryId.forEach(async (id) => {
          const sub = await getSubcatById(id);
          prevSelectedSubCat.push({ id: sub._id, name: sub.name })
        })

        productData.size.forEach(async (id) => {
          const size = await getSizeById(id);
          prevSelectedSize.push({ id: size._id, name: size.name, shortName: size.shortName })
        })

        setTimeout(() => {
          setSelectedSubCat(prevSelectedSubCat);
          setSelectedSizes(prevSelectedSize);
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

    selectedSubCat.forEach((val) => formData.append('subCategoryId', val.id));
    selectedSizes.forEach((val) => formData.append('size', val.id));

    newlySelectedSubImg.forEach((val) => formData.append('subImages', val));
    console.log('indexesToRemoveSubImg', indexesToRemoveSubImg);
    indexesToRemoveSubImg.forEach((val) => formData.append('indexToRemoveSubImg', val));
    // formData.append('indexToRemoveSubImg', indexesToRemoveSubImg)
    try {
      if (editProductData) {
        formData.append('isRemoveMainImg', isRemoveMainImg);
        const response = await api.put(`/product/id/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Product edited successfully:', response.data);
        navigate(-1);
      } else {
        const response = await api.post('/product', formData, {
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

  const formik = useFormik({
    initialValues: {
      categoryId: '',  // categoryId in backend
      // subCategoryId: '',  // subCategoryId in backend
      productName: '',
      mainImage: null,
      // subImages: [],
      // size: '',
      quantity: '',
      // price: '',
      priceType: '',
      priceValue: '',
      status: '',
      weight: '',
      desc: ''
    },
    onSubmit: (values) => {
      if (selectedSubCat.length <= 0) {
        setPopupContent('emptySubCat');
      } else if (selectedSizes.length <= 0) {
        setPopupContent('emptySize')
      } else {
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

  // function waitForClick(element) {
  //   return new Promise(resolve => {
  //     const handler = (event) => {
  //       element.removeEventListener('click', handler);
  //       resolve(event);
  //     };
  //     element.addEventListener('click', handler);
  //   });
  // }

  // async function handleSubImgChange(e) {
  //   const files = e.currentTarget.files;
  //   console.log(' e.currentTarget.files', files);
  //   const fileArray = Array.from(files);
  //   const filteredFiles = await fileArray.map(async (file) => {
  //     if (file.size > 400 * 1024) {
  //       setIsImgLarger(file.name);
  //       const btn = document.getElementById('userConfirm')
  //       await waitForClick(btn);  // await gives error of async, but i have written async
  //       console.log('User clicked! Continue code...');
  //     } else {
  //       setPreviewSubImgData(prev => [...prev, file]);
  //       setNewlySelectedSubImg(prev => [...prev, file]);
  //       return file;
  //     }
  //   })

  //   setPreviewSubImgData(prev => [...prev, ...filteredFiles]);
  //   setNewlySelectedSubImg(prev => [...prev, ...filteredFiles]);

  //   const previewUrls = filteredFiles.map(file => URL.createObjectURL(file));
  //   setPreviewSubImageUrls(prev => [...prev, ...previewUrls]);
  // }


  async function handleSubImgChange(e) {
    const files = e.currentTarget.files;
    const fileArray = Array.from(files);
    const filteredFiles = [];

    fileArray.forEach((file) => {
      if (file.size > 400 * 1024) {
        !isImgLarger && setIsImgLarger(true);
      } else {
        setPreviewSubImgData(prev => [...prev, file]);
        setNewlySelectedSubImg(prev => [...prev, file]);
        filteredFiles.push(file)
      }
    })

    const previewUrls = filteredFiles.map(file => URL.createObjectURL(file));  //line no 307
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

  function handleSubCatClick(subCat) {
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

  function removeSelectedSubCat(id) {
    setSelectedSubCat(prev => prev.filter(item => item.id !== id));
  }

  function removeSelectedSize(id) {
    setSelectedSizes(prev => prev.filter(item => item.id !== id));
  }

  // useEffect(() => {
  //   console.log('previewSubImageUrls', previewSubImageUrls);
  // }, [previewSubImageUrls])



  return (
    <>
      <Navbar />
      {/* <DeleteConfirmDialog /> */}
      {popupContent &&
        <Popup message={popupContent === 'emptySubCat' ?
          'Please Select atleast one Sub category'
          : popupContent === 'emptySize' && 'Please Select atleast one Available size'
        }
          onClose={() => setPopupContent('')} />}

      {isImgLarger &&
        <Popup message={`Files greater then 400kb can't upload!\nThat will be excluded.`}
          onClose={() => setIsImgLarger(false)} />}

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

      <div className="product-form-container">
        <h2>{editProductData ? 'Update ' : 'Add '} Product</h2>
        <form onSubmit={formik.handleSubmit} className="product-form">
          <label>
            Select Category:
            <div className="add-select">
              <select
                name="categoryId"
                value={formik.values.categoryId}
                onChange={handleCategoryChange}
                style={{ width: '63%' }}
                required
              >
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
          </label>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginBlock: '5px' }}>
              Select SubCategory:
            </label>

            <div className="selected-subcat-chip">
              {selectedSubCat.map((val, idx) => {
                return <div className="chip" key={idx}>
                  {val.name}  {<span className="closebtn" onClick={() => removeSelectedSubCat(val.id)}>&times;</span>}
                </div>
              })}
            </div>

            <div className="add-select">
              <div className="subcat-dropdown-container">

                <div className="subcat-dropdown-header" onClick={() => setIsSubCatListOpen(!isSubCatListOpen)}>
                  {isSubCatListOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                  -- Select SubCategory --
                </div>
                {isSubCatListOpen && (
                  <ul className="subcat-dropdown-list">
                    {subCategory.length <= 0 && <li className='no-record'>No Sub Category Found</li>}
                    {subCategory?.map((sub, index) => (
                      <li key={index} onClick={() => handleSubCatClick({ id: sub._id, name: sub.name })}>
                        <span>{sub.name}</span>
                        {selectedSubCat.some(item => item.id === sub._id) &&
                          <i className="bi bi-check-lg" style={{ color: 'green' }}></i>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type='button'
                className="add-category-button"
                onClick={() => {  // when i clicked on this <div className="subcat-dropdown-header" onClick={() => setIsSubCatListOpen(!isSubCatListOpen)}> , button's click event also runs
                  console.log('add sub cat clicked')
                  setIsSubCatFormOpen(true)
                }}
                style={{ minWidth: '175px' }}
              >
                <i className="bi bi-plus-lg"></i> Add Sub Category
              </button>
            </div>
          </div>

          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              required
            />
          </label>

          {/* <label> */}
          Select Main Image:
          {/* </label> */}
          {previewMainImgUrl && <img src={previewMainImgUrl} alt="preview" className="img" />}

          {imgIcon === 'cross' &&
            <i className="bi bi-x-circle img-upload-icon"
              style={{ cursor: 'pointer' }}
              onClick={handleCancelMainImgUpload}></i>}

          {imgIcon === 'trash' &&
            <i className="bi bi-trash-fill img-upload-icon"
              style={{ cursor: 'pointer' }}
              onClick={handleRemoveMainImg}></i>}
          <label>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              id='mainImage'
              onChange={(e) => handleMainImgChange(e)}
            // required
            />
          </label>
          {/* <label> */}
          Select Sub Images:
          {/* </label> */}
          {previewSubImageUrls?.map((img, index) => (
            <div key={index} className='subImg-div'>
              <img key={index} src={img} alt={`preview-${index}`} />
              <i
                className="bi bi-x-circle img-upload-icon"
                onClick={() => handleRemoveSubImgUpload(index, previewSubImgData[index].originalName)}
              ></i>
            </div>
          ))}
          <label>
            <input
              type="file"
              name="subImages"
              accept="image/*"
              multiple
              onChange={(e) => handleSubImgChange(e)}
            />
          </label>

          <label style={{ marginBlock: '0px' }}>
            Price:
          </label>
          <div className="add-select">
            <select
              name="priceType"
              value={formik.values.priceType}
              onChange={formik.handleChange}
              style={{ width: '27%', margin: '11px 0px' }}
              required
            >
              <option value="">-- Price Type --</option>
              <option value={'MRP'}> MRP </option>
              <option value={'salePrice'}> Sale Price </option>
            </select>

            <div className="price-label">
              <input
                type="number"
                name="priceValue"
                min="0"
                step="any"
                style={{ paddingLeft: '40px', width: '93%', marginTop: '0px' }}
                value={formik.values.priceValue}
                onChange={formik.handleChange}
                required
              />
              <span className='rs-class'>Rs</span>
            </div>

          </div>
          {/* <label>
            Select Size:
            <select
              name="size"
              value={formik.values.size}
              onChange={formik.handleChange}
              // onFocus={getAllSize}
              required
            >
              <option value="">-- Select Size --</option>
              {allSize.map((size, index) => (
                <option key={index} value={size._id}>
                  {size.shortName} {" - "}{size.name}
                </option>
              ))}
            </select>
          </label> */}


          <div style={{ marginBottom: '15px' }}>
            <label style={{ marginBlock: '5px' }}>
              Select Size:
            </label>

            <div className="selected-subcat-chip">
              {selectedSizes?.map((val, idx) => {
                return <div className="chip" key={idx}>
                  {val.shortName} {<span className="closebtn" onClick={() => removeSelectedSize(val.id)}>&times;</span>}
                </div>
              })}
            </div>

            <div className="add-select">
              <div className="subcat-dropdown-container">

                <div className="subcat-dropdown-header" onClick={() => setIsSizeListOpen(!isSizeListOpen)}>
                  {isSizeListOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                  -- Select Size --
                </div>

                {isSizeListOpen && (
                  <ul className="subcat-dropdown-list">
                    {allSize.length <= 0 && <li className='no-record'>No Size Available</li>}

                    {allSize?.map((size, index) => (
                      <li key={index} onClick={() => handleSizeClick({ id: size._id, name: size.name, shortName: size.shortName })}>
                        <span>{size.shortName} {" - "} {size.name}</span>
                        {selectedSizes.some(item => item.id === size._id) &&
                          <i className="bi bi-check-lg" style={{ color: 'green' }}></i>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <label>
            Select Status:
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="ReadyToShip">Ready To Ship</option>
              <option value="onBooking">On Booking</option>
            </select>
          </label>

          <label>
            No of Product in Stock:
            <input
              type="number"
              name="quantity"
              min="0"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              required
            />
          </label>

          <label>
            Weight (in kg):
            <input
              type="number"
              min="0"
              name="weight"
              value={formik.values.weight}
              onChange={formik.handleChange}
              step="any"
              required
            />
          </label>

          <label style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '6px' }}>Description:</div>
            <CKEditor
              editor={ClassicEditor}
              data={formik.values.desc}
              onChange={(event, editor) => {
                const data = editor.getData();
                formik.setFieldValue('desc', data);
              }}
            />
          </label>

          <div className="product-form-actions">
            <button type="submit">{editProductData ? 'Update ' : 'Add '}</button>
            {/* <button type="button" className="cancel-btn">
              Cancel
            </button> */}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
