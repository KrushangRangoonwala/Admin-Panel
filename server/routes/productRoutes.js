import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getProductByCategory, getProductById, getProductBySubCategory, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getAllProduct).post(addProduct);

router.route('/id/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

router.get('/productByCategory/:categoryId', getProductByCategory);
router.get('/productBySubCategory/:subCategoryId', getProductBySubCategory);

export default router;