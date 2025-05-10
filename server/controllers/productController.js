import product from "../models/productSchema.js";

export async function getAllProduct(req, res) {
    try {
        const allProduct = await product.find({})
        console.log('allProduct', allProduct);

        res.send({
            success: true,
            allProduct,
        })
    } catch (error) {
        console.log('error', error)
    }
}

export async function addProduct(req, res) {
    console.log('req.body', req.body);
    try {
        const addedProduct = await product.create(req.body);
        res.status(200).send({
            success: true,
            message: 'Product added',
            addedProduct,
        })
    } catch (error) {
        console.log('error', error)
        res.send({
            success: false,
            message: 'Error in addProduct API',
            error,
        })
    }
}

export async function getProductById(req, res) {
    const id = req.params.id;
    console.log('id',id);
    try {
        const record = await product.findById(id);
        res.send({
            success: true,
            message: 'Product found',
            data: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
            // message: 'Product not found',
        })
    }
}

export async function updateProduct(req, res) {
    const id = req.params.id;
    try {
        const record = await product.findByIdAndUpdate(id, req.body, {
            new: true, // return updated data
            runValidators: true, // validate for updating 
        });
        res.status(404).send({
            success: true,
            message: 'Product updated',
            updatedProduct: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function deleteProduct(req, res) {
    const id = req.params.id;
    try {
        await product.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Product deleted',
        })
    } catch (error) {
        console.log('# delete error', error)
        res.status(404).send({
            success: false,
            error,
        })
    }
}