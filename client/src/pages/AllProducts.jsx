import React, { useEffect, useState } from 'react'
import './AllProducts.css'
import imageReader from '../helpers/imageReader'
import api from '../axiosConfig';
import { useNavigate } from 'react-router';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const AllProducts = ({ productsList, isproductListReady }) => {
    const [renderProducts, setRenderProducts] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePropmt, setDeletePropmt] = useState('');
    const [deleteProductid, setDeleteProductid] = useState('');
    const [showRenderProduct, setShowRenderProduct] = useState(false);
    const navigate = useNavigate();

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

    return (
        <>
            <DeleteConfirmDialog isOpen={deleteDialog} propmt={deletePropmt} id={deleteProductid} onConfirm={handleDeleteProduct} onCancel={() => setDeleteDialog(false)} />

            <div className="add-prod-btn">
                <button
                    className="add-category-button"
                    onClick={() => navigate("/addProduct")}
                >
                    <i className="bi bi-plus-lg"></i> Add Product
                </button>
            </div>

                {showRenderProduct && renderProducts.length === 0 && <p className='no-record'>No SubCategories Found</p>}
            <div className="product-list">
                {showRenderProduct && renderProducts.map((prod, i) => (
                    <div key={i} className="product-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${prod._id}`)}>
                        {/* {console.log('prod', prod)} */}
                        <img src={imageReader(prod, "mainImage")} alt={prod.name} />
                        <div className="product-info">
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
        </>
    )
}

export default AllProducts