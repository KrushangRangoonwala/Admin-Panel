import express from 'express'
import { addCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getAllCategory).post(addCategory);

router.route('/id/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory)


export default router;