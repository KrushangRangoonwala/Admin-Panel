import category from "../models/categorySchema.js";

export async function getAllCategory(req, res) {
    try {
        const allCategory = await category.find({})
        // console.log('allCategory', allCategory);

        res.send({
            success: true,
            allCategory,
        })
    } catch (error) {
        console.log('error', error)
    }
}

// export async function addCategory(req, res) {  // this should handle uploaded files
//     console.log('req.body', req.body);
//     try {
//         const addedCategory = await category.create(req.body);
//         res.status(200).send({
//             success: true,
//             message: 'Category added',
//             addedCategory,
//         })
//     } catch (error) {
//         console.log('error', error)
//         res.send({
//             success: false,
//             message: 'Error in addCategory API',
//             error,
//         })
//     }
// }

export async function getCategoryById(req, res) {
    const id = req.params.id;
    console.log('id', id);
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

// export async function updateCategory(req, res) {  // this should handle uploaded files
//     console.log('req.body', req.body);
//     const id = req.params.id;
//     try {
//         const record = await category.findByIdAndUpdate(id, req.body, {
//             new: true, // return updated data
//             runValidators: true, // validate for updating 
//         });
//         res.status(404).send({
//             success: true,
//             message: 'Category updated',
//             updatedCategory: record,
//         })
//     } catch (error) {
//         res.status(404).send({
//             success: false,
//             error,
//         })
//     }
// }

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

export async function addCategory(req, res) {
    try {
        const { name, slug, desc } = req.body;

        const newCategory = {
            name,
            slug,
            desc,
        };

        console.log('req.file', req.file)
        if (req.file) {
            newCategory.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname,
            };
        }
        // console.log('newCategory', newCategory);
        const addedCategory = await category.create(newCategory);
        res.status(200).json({
            success: true,
            message: 'Category added',
            addedCategory,
        });
    } catch (error) {
        console.error('Error in addCategory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function updateCategory(req, res) {
    try {
        const id = req.params.id;
        const { name, slug, desc, isRemoveImg } = req.body;

        const updateFields = {
            name,
            slug,
            desc,
        };
        console.log('req.file', req.file); // give undefined why?

        if (isRemoveImg === 'true') {
            // console.log("\n\nif (isRemoveImg === 'true')\n\n")
            updateFields.image = null; // or null depending on schema
        } else if (req.file) {
            // console.log("\n\nelse if (req.file)\n\n")
            updateFields.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname,
            };
        }
        // console.log('updateFields', updateFields);
        const updated = await category.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Category updated',
            updatedCategory: updated,
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}