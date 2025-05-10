import express from 'express';
import category from '../models/categorySchema.js';
import subCategory from '../models/subCategorySchema.js';
import Products from '../models/productSchema.js';
import e from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const categoryCount = await category.countDocuments();
    const subCategoryCount = await subCategory.countDocuments();
    const productCount = await Products.countDocuments();
    try {
        res.send({
            success: true,
            message: 'All counts',
            categoryCount,
            subCategoryCount,
            productCount,
        });
    } catch (error) {
        console.log('error', error);
    }
})

export default router;