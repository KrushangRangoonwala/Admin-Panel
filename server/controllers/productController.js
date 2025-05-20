import product from "../models/productSchema.js";
import { json2csv } from 'json-2-csv'

export async function getAllProduct(req, res) {
    try {
        const allProduct = await product.find({})
        console.log('allProduct', allProduct);

        res.send({
            success: true,
            allProduct,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            message: 'Error in getAllProduct API',
            error,
        })
        console.log('error', error)
    }
}

export async function addProduct(req, res) {
    // console.log('\n\n\n\nreq.body', req.body);
    const newProduct = {
        ...req.body,
    }
    // console.log('\n\n\n\nreq.files', req.files);
    if (req.files.mainImage) {
        newProduct.mainImage = {
            data: req.files.mainImage[0].buffer,
            contentType: req.files.mainImage[0].mimetype,
            originalName: req.files.mainImage[0].originalname,
        };
    }
    if (req.files.subImages) {
        newProduct.subImages = req.files.subImages.map((file) => ({
            data: file.buffer,
            contentType: file.mimetype,
            originalName: file.originalname,
        }));
    }
    try {
        const addedProduct = await product.create(newProduct);
        console.log('addedProduct', addedProduct);
        res.status(200).send({
            success: true,
            message: 'Product added',
            addedProduct,
        })
    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: 'Error in addProduct API',
            error,
        })
    }
}

export async function getProductById(req, res) {
    const id = req.params.id;
    console.log('id', id);
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
    const newProduct = {
        ...req.body,
    }
    delete newProduct.isRemoveMainImg;
    delete newProduct.indexToRemoveSubImg;
    const isRemoveMainImg = req.body.isRemoveMainImg;
    console.log(' newProduct', newProduct);
    console.log('\n\n\n\nreq.files', req.files);

    if (isRemoveMainImg === 'true') {
        newProduct.mainImage = null;
    } else if (req.files.mainImage) {
        newProduct.mainImage = {
            data: req.files.mainImage[0].buffer,
            contentType: req.files.mainImage[0].mimetype,
            originalName: req.files.mainImage[0].originalname,
        };
    }

    const indexToRemoveSubImg = req.body.indexToRemoveSubImg;
    console.log('indexToRemoveSubImg', indexToRemoveSubImg)
    var oldSubImg = [];
    let updatedOldSubImg = [];
    var record;
    if (indexToRemoveSubImg?.length > 0 || Array.isArray(indexToRemoveSubImg)) {
        try {
            record = await product.findById(id);
            // console.log("record.data.subImages", record.subImages);
            oldSubImg = record.subImages;

            if (Array.isArray(indexToRemoveSubImg)) {
                indexToRemoveSubImg.forEach((val) => oldSubImg[val] = null);
            } else {
                oldSubImg[indexToRemoveSubImg] = null;
            }

            updatedOldSubImg = oldSubImg.filter(val => val !== null);
        } catch (error) {
            console.log('error', error);
        }
    }

    let newSubImg = [];
    if (req.files.subImages) {
        newSubImg = req.files.subImages.map((file) => ({
            data: file.buffer,
            contentType: file.mimetype,
            originalName: file.originalname,
        }));
    }

    const updateSub = updatedOldSubImg.length;
    const newSub = newSubImg.length;

    if (updateSub > 0 && newSub > 0) {
        newProduct.subImages = [...updatedOldSubImg, ...newSubImg]
    } else if (updateSub > 0) {
        newProduct.subImages = [...updatedOldSubImg]
    } else if (newSub > 0) {
        console.log('oldSubImg', oldSubImg);
        newProduct.subImages = [...oldSubImg, ...newSubImg]
    }

    try {
        const record = await product.findByIdAndUpdate(id, newProduct);
        res.status(200).send({
            success: true,
            message: 'Product updated',
            updatedProduct: record,
        })
    } catch (error) {
        console.log('error', error);
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

export async function getProductBySubCategory(req, res) {
    const subCategoryId = req.params.subCategoryId;
    console.log('subCategoryId', subCategoryId);
    try {
        const record = await product.find({ subCategoryId: subCategoryId });
        res.send({
            success: true,
            message: 'Product found',
            data: record,
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function getProductByCategory(req, res) {
    const categoryId = req.params.categoryId;
    console.log('categoryId', categoryId);
    try {
        const record = await product.find({ category: categoryId });
        res.send({
            success: true,
            message: 'Product found',
            data: record,
        })
    }
    catch (error) {
        res.status(404).send({
            success: false,
            error,
        })
    }
}

export async function getBySearchText(req, res) {
    const searchText = req.params.searchText || '';
    console.log('searchText', searchText);
    try {
        const response = await product.find({
            productName: { $regex: searchText, $options: 'i' }
        })
        console.log('response', response);
        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).send({
            success: false,
            message: "Search failed",
            error,
        })
    }
}

export async function downloadCsv(req, res) {
    const { selectedIds } = req.body;

    try {
        const response = await product.find({ _id: { $in: selectedIds } });
        // console.log('response', response);
        response.forEach(prod => {
            delete prod.mainImage;
            delete prod.subImages;
        });

        const options = {
            keys: ['_id', 'productName', 'quantity', 'price', 'weight', 'desc'],
            rename: {
                _id: 'Id',
                desc: 'Description',
                weight: "Weight",
                price: "Price",
                quantity: "Quantity",
                productName: "Product Name",
            }
        }

        const csv = await json2csv(response, options);

        res.setHeader('Content-Disposition', 'attachment; filename=selected_item123123s.csv');
        res.setHeader('Content-Type', 'text/csv');


        res.status(200).send(csv)
    } catch (error) {
        console.log('error in downloadCsv', error);
        res.status(400).send({
            success: false,
            error,
        })
    }
}