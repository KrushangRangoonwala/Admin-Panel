import product from "../models/productSchema.js";
import { csv2json, json2csv } from 'json-2-csv'
import csvtojson from 'csvtojson'

export async function getProductByPage(req, res) {
    const pageNo = parseInt(req.query.pageNo) ?? 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    console.log('#pageNo', pageNo);
    console.log('#pageSize', pageSize);
    const skipProduct = pageNo * pageSize;
    try {
        const totalProduct = await product.countDocuments({});
        if (skipProduct > totalProduct) {
            console.log('joijfisjfskfsfls;f');
            res.status(400).send({ success: false, message: 'page out of the range' })
        }

        const allProduct = await product.find({}).skip(skipProduct).limit(pageSize);

        res.send({
            success: true,
            allProduct,
            totalProduct,
        })
    } catch (error) {
        console.log('##error', error);
        res.status(404).send({
            success: false,
            message: 'Error in fetching Product API',
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
    console.log(' newProduct.stockSize', newProduct.stockSize);

    (Array.isArray(newProduct?.stockSize)) ?
        newProduct.stockSize = newProduct.stockSize.map((val) => JSON.parse(val))  // line: 42
        : newProduct.stockSize = JSON.parse(newProduct.stockSize);
    // const newProduct = JSON.parse(strProductData);
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

        (Array.isArray(newProduct.stockSize)) ?
        newProduct.stockSize = newProduct.stockSize.map((val) => JSON.parse(val))
        : newProduct.stockSize = JSON.parse(newProduct.stockSize);

    console.log('\n\n\n\n@@@@@@@@@@@@@@@@\n\n\n\n');
    console.log('typeof newProduct.stockSize[0]', typeof newProduct.stockSize[0])
    console.log('newProduct.stockSize', newProduct.stockSize);
    delete newProduct.isRemoveMainImg;
    delete newProduct.indexToRemoveSubImg;
    const isRemoveMainImg = req.body.isRemoveMainImg;
    const indexToRemoveSubImg = req.body.indexToRemoveSubImg;
    // console.log(' newProduct', newProduct);
    // console.log('\n\n\n\nreq.files', req.files);
    // console.log('indexToRemoveSubImg', indexToRemoveSubImg)

    if (isRemoveMainImg === 'true') {
        newProduct.mainImage = null;
    } else if (req.files.mainImage) {
        newProduct.mainImage = {
            data: req.files.mainImage[0].buffer,
            contentType: req.files.mainImage[0].mimetype,
            originalName: req.files.mainImage[0].originalname,
        };
    }

    var oldSubImg = [];
    let updatedOldSubImg = [];
    var record;

    try {
        record = await product.findById(id);
        // console.log("record.data.subImages", record.subImages);
        oldSubImg = record.subImages;
        // console.log('insider oldSubImg', oldSubImg);
    } catch (error) {
        console.log('error', error);
    }

    if (indexToRemoveSubImg?.length > 0 || Array.isArray(indexToRemoveSubImg)) {
        if (Array.isArray(indexToRemoveSubImg)) {
            indexToRemoveSubImg.forEach((val) => oldSubImg[val] = null);
        } else {
            oldSubImg[indexToRemoveSubImg] = null;
        }
        updatedOldSubImg = oldSubImg.filter(val => val !== null);
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
        // console.log('oldSubImg', oldSubImg);
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
            message: 'Products found',
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
    const pageNo = parseInt(req.query.pageNo) ?? 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skipProduct = pageNo * pageSize;
    console.log('req.query.pageSize', req.query.pageSize);
    console.log('req.query.pageNo', req.query.pageNo);

    try {
        const totalProduct = await product.countDocuments({
            $or: [
                { productName: { $regex: searchText, $options: 'i' } },
                { desc: { $regex: searchText, $options: 'i' } }
            ]
        });

        if (skipProduct > totalProduct) {
            res.status(400).send({ success: false, message: 'page out of the range' })
        }

        console.log('skipProduct', skipProduct);
        console.log('pageSize', pageSize);
        const response = await product.find({
            $or: [
                { productName: { $regex: searchText, $options: 'i' } },
                { desc: { $regex: searchText, $options: 'i' } }
            ]
        }).skip(skipProduct).limit(pageSize);  // limit is not working

        res.send({
            success: true,
            data: response,
            totalProduct,
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
            keys: ['_id', 'productName', 'quantity', 'mrpPrice', 'salePrice', 'weight', 'desc'],
            rename: {
                _id: 'Id',
                desc: 'Description',
                weight: "Weight",
                salePrice: "price Value",
                mrpPrice: "price Type",
                quantity: "Quantity",
                productName: "Product Name",
            }
        }

        const tempObj = [...response]
        console.log("Object.keys(tempObj[0]) ", Object.keys(tempObj[0]))
        console.log("tempObj", tempObj)
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

export async function uploadCsv(req, res) {
    try {
        // console.log('req.file', req.file);
        const jsonOfcsv = await csvtojson().fromFile(req.file.path);
        // console.log('jsonOfcsv', jsonOfcsv);

        for (const item of jsonOfcsv) {
            const idStr = item._id;  // "682c2456575121f97947820c"
            const id = idStr.slice(1, idStr.length - 1)
            console.log('id', id);
            delete item._id;
            try {
                await product.findByIdAndUpdate(id, item)
            } catch (error) {
                console.log('error in ', id, item.productName);
                console.log('error', error);
            }
        }

        res.send({
            success: true,
            message: 'data Updated.'
        })
    } catch (error) {
        console.log('error in csv file upload', error);
        res.status(500).send({
            success: false,
        })
    }
}
