import express from 'express';
import { addProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from '../controllers/productController.js';
import e from 'express';

const router = express.Router();

router.route('/').get(getAllProduct).post(addProduct);

router.route('/id/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;