import express from 'express';
import { addSubCategory, deleteSubCategory, getAllSubCategory, getSubCategoryById, updateSubCategory, getSubCategoryByCategory } from '../controllers/subCategoryController.js';
import { get } from 'mongoose';

const router = express.Router();

router.route('/').get(getAllSubCategory).post(addSubCategory);
router.route('/id/:id')
    .get(getSubCategoryById)
    .put(updateSubCategory)
    .delete(deleteSubCategory)  

router.get('subCategoryByCategory/:categoryId',getSubCategoryByCategory)

export default router;