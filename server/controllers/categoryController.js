import category from "../models/categorySchema.js";

export async function getAllCategory(req, res) {
    try {
        const allCategory = await category.find({})
        console.log('allCategory', allCategory);

        res.send({
            success: true,
            allCategory,
        })
    } catch (error) {
        console.log('error', error)
    }
}

export async function addCategory(req, res) {
    console.log('req.body', req.body);
    try {
        const addedCategory = await category.create(req.body);
        res.status(200).send({
            success: true,
            message: 'Category added',
            addedCategory,
        })
    } catch (error) {
        console.log('error', error)
        res.send({
            success: false,
            message: 'Error in addCategory API',
            error,
        })
    }
}

export async function getCategoryById(req, res) {
    const id = req.params.id;
    console.log('id',id);
    try {
        const record = await category.findById(id);
        res.send({
            success: true,
            message: 'Category found',
            data: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
            // message: 'category not found',
        })
    }
}

export async function updateCategory(req, res) {
    const id = req.params.id;
    try {
        const record = await category.findByIdAndUpdate(id, req.body, {
            new: true, // return updated data
            runValidators: true, // validate for updating 
        });
        res.status(404).send({
            success: true,
            message: 'Category updated',
            updatedCategory: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function deleteCategory(req, res) {
    const id = req.params.id;
    try {
        await category.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category deleted',
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}