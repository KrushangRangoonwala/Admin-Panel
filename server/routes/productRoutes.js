import express from 'express';
import { addProduct, deleteProduct, downloadCsv, getAllProduct, getBySearchText, getProductByCategory, getProductById, getProductBySubCategory, updateProduct } from '../controllers/productController.js';
import { uploadProductImages } from '../middleware/uploadFiles.js';

const router = express.Router();

router.route('/').get(getAllProduct).post(uploadProductImages,addProduct);

router.route('/id/:id')
.get(getProductById)
.put(uploadProductImages,updateProduct)
.delete(deleteProduct);

router.get('/productByCategory/:categoryId', getProductByCategory);
router.get('/productBySubCategory/:subCategoryId', getProductBySubCategory);

router.get('/searchBy/:searchText',getBySearchText);

router.post('/downloadCsv', downloadCsv)

export default router;