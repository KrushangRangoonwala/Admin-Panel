import express from 'express'
import { addCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/categoryController.js';
import { uploadSingleImage } from '../middleware/uploadFiles.js';

const router = express.Router();

router.route('/').get(getAllCategory).post(uploadSingleImage,addCategory);

router.route('/id/:id')
    .get(getCategoryById)
    .put(uploadSingleImage,updateCategory)
    .delete(deleteCategory)


export default router;

// import express from 'express';
// import {
// addCategory,
// deleteCategory,
// getAllCategory,
// getCategoryById,
// updateCategory,
// } from '../controllers/categoryController.js';

// const router = express.Router();

// router.route('/')
// .get(getAllCategory)
// .post(uploadSingleImage, addCategory); // Apply image upload middleware

// router.route('/id/:id')
// .get(getCategoryById)
// .put(uploadSingleImage, updateCategory) // Apply image upload middleware
// .delete(deleteCategory);

// export default router;