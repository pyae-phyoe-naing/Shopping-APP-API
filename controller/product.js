const DB = require('../model/product');
const {
    responseMsg,
    strCollect,
    firstWordUpperCase
} = require('../utils/helper');
const {
    deleteFile
} = require('../utils/gallergy');
const {
    db
} = require('../model/product');

// Get All Products
const paginate = async (req, res) => {
    let page = !req.params.page || req.params.page == 0 ? 1 : Number(req.params.page);
    const limit = Number(process.env.PAGE_LIMIT);
    const start = page == 1 ? 0 : page - 1;
    const skipCount = limit * start;
    let products = await DB.find().skip(skipCount).limit(limit).select('-__v');
    responseMsg(res, true, 'Get Products', products);
}

// Add New Product
const add = async (req, res, next) => {

    // Check Unique Product Name
    let products = await DB.find();
    let existName = products.find((product) => strCollect(product.name) == strCollect(req.body.name));

    if (existName) {
        let deleteImages = req.body.images.split(',');
        deleteImages.forEach((img) => deleteFile(img));
        next(new Error('Product name is already exist!'));
        return;
    }

    // Array Values Split
    req.body.features = req.body.features.split(',');
    req.body.colors = req.body.colors.split(',');
    req.body.delivery = req.body.delivery.split(',');
    req.body.warranty = req.body.warranty.split(',');
    req.body.images = req.body.images.split(',');
    req.body.name = firstWordUpperCase(req.body.name);

    // Add Product
    let product = await new DB(req.body).save();
    responseMsg(res, true, 'Add Product Success', product);
}

// Get Single Product
const get = async (req, res, next) => {
    let dbExist = await DB.findById(req.params.id);
    if (!dbExist) {
        next(new Error('Product not found with that ID'));
        return;
    }
    responseMsg(res, true, 'Get Single Product', dbExist);
}

// Delete Product
const drop = async (req, res, next) => {

    // Check Delete Product exist ID
    let dbExist = await DB.findById(req.params.id);
    if (!dbExist) {
        next(new Error('Product not found with that ID'));
        return;
    }
    // Delete Product
    try {
        dbExist.images.map((img) => deleteFile(img)); // Delete Product UPload Image
        await DB.findByIdAndDelete(dbExist._id);
        responseMsg(res, true, 'Delete Product');
    } catch (e) {
        next(new Error('Something Wrong'));
    }

}

// Update Product
const patch = async (req, res, next) => {

    // check ID Product exist or in DB
    let dbProduct = await DB.findById(req.params.id);
    if (!dbProduct) {
        let deleteImages = req.body.images.split(',');
        deleteImages.forEach((img) => deleteFile(img));
        next(new Error('Product not found with that ID!'));
        return;
    }

    // Check Product Name in already exist in DB without expert ID
    let products = await DB.find();
    let checkNameExist = products.find((product) => product._id.toString() !== req.params.id && req.body.name.split(' ').join('').toLowerCase() === product.name.split(' ').join('').toLowerCase());
    if (checkNameExist) {
        let deleteImages = req.body.images.split(',');
        deleteImages.forEach((img) => deleteFile(img));
        next(new Error('Product name is already in use'));
        return;
    }

    // Array Values Split
    req.body.features = req.body.features.split(',');
    req.body.colors = req.body.colors.split(',');
    req.body.delivery = req.body.delivery.split(',');
    req.body.warranty = req.body.warranty.split(',');
    req.body.name = firstWordUpperCase(req.body.name);

    // Update Product
    try {
        if (req.body.images) {
            let oldImages = dbProduct.images;
            oldImages.map((img) => deleteFile(img));
            req.body.images = req.body.images.split(',');
        }

        await DB.findByIdAndUpdate(dbProduct._id, req.body);
        let updateProduct = await DB.findById(dbProduct._id);
        responseMsg(res, true, 'Product update successfully', updateProduct);
    } catch (e) {
        next(new Error('Something wrong'));
    }

}

// Get Product By Category

const filteByType = async (req, res) => {
    let page = !req.params.page || req.params.page == 0 ? 1 : Number(req.params.page);
    const limit = Number(process.env.PAGE_LIMIT);
    const start = page == 1 ? 0 : page - 1;
    const skipCount = limit * start;

    let filterType = 'cat';
    let type = req.params.type;

    switch (type) {
        case 'cat':
            filterType = 'cat';
            break;
        case 'tag':
            filterType = 'tag';
            break;
        default:
            filteByType = 'cat';
            break;
    }

    let filterObj = {};
    filterObj[`${filterType}`] = req.params.id
    let products = await DB.find(filterObj).skip(skipCount).limit(limit).select('-__v');
    responseMsg(res, true, 'Get Products', products);
}

module.exports = {
    paginate,
    add,
    get,
    drop,
    patch,
    filteByType
}