import subCategory from "../models/subCategorySchema.js";

export async function getAllSubCategory(req, res) {
    try {
        const allSubCategory = await subCategory.find({})
        console.log('allCategory', allSubCategory);

        res.send({
            success: true,
            allSubCategory: allSubCategory,
        })
    } catch (error) {
        console.log('error', error)
    }
}

export async function addSubCategory(req, res) {
    console.log('req.body', req.body);
    try {
        const addedSubCategory = await subCategory.create(req.body);
        res.status(200).send({
            success: true,
            message: 'SubCategory added',
            addedSubCategory: addedSubCategory,
        })
    } catch (error) {
        console.log('error', error)
        res.send({
            success: false,
            message: 'Error in addSubCategory API',
            error,
        })
    }
}

export async function getSubCategoryById(req, res) {
    const id = req.params.id;
    console.log('id',id);
    try {
        const record = await subCategory.findById(id);
        res.send({
            success: true,
            message: 'SubCategory found',
            data: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function updateSubCategory(req, res) {
    const id = req.params.id;
    try {
        const record = await subCategory.findByIdAndUpdate(id, req.body, {
            new: true, // return updated data
            runValidators: true, // validate for updating 
        });
        res.status(404).send({
            success: true,
            message: 'SubCategory updated',
            updatedSubCategory: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function deleteSubCategory(req, res) {
    const id = req.params.id;
    try {
        await subCategory.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'SubCategory deleted',
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function getSubCategoryByCategory(req,res) {
    const id = req.params.categoryId;
    try {
        const data = await subCategory.find({categoryId: id});
        res.status(200).send({
            success: true,
            message: 'SubCategory found',
            data: data,
        })
    } catch (error) {
        console.log('error', error)
        res.status(404).send({
            success: false,
            error,
        })
    }
}