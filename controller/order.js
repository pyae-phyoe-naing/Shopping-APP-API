const DB = require('../model/order');
const orderItemDB = require('../model/orderitem');
const productDB = require('../model/product');
const {
    responseMsg
} = require('../utils/helper');


const add = async (req, res, next) => {
    const user = req.user;
    const items = req.body.items;

    let saveOrder = new DB();
    let orderItemsArr = [];
    let total = 0;

    try {

        for await (let item of items) {
            let product = await productDB.findById(item.id);
            let name = item.name ? item.name : product.name;
            let price = item.price ? item.price : product.price;
            let obj = {
                order: saveOrder._id,
                productId: product._id,
                count: item.count,
                name: name,
                price: price
            }
            orderItemsArr.push(obj);
            total += item.count * price;
        }

        // Save OrderItem DB
        let saveOrderItems = await orderItemDB.insertMany(orderItemsArr);
        let orderItemsId = saveOrderItems.map(item => item._id);

        // Save Order DB
        saveOrder.user = user._id;
        saveOrder.items = orderItemsId;
        saveOrder.count = orderItemsId.length;
        saveOrder.total = total;
        let order = await (await saveOrder.save()).populate({
            path: 'user',
            select: ['name', 'phone']
        });
        responseMsg(res, true, 'Order add', order);

    } catch (e) {
        next(new Error('Error => ' + e.toString()));
    }


}

const getAllOrders = async (req, res, next) => {
    let orders = await DB.find().populate({
        path: 'user',
        select: ['name', 'phone']
    });
    responseMsg(res, true, 'All Orders', orders);
}
const getMyOrders = async (req, res, next) => {
    let user = req.user;
    let orders = await DB.find({
        user: user._id
    }).populate({
        path: 'user',
        select: ['name', 'phone']
    }).populate({
        path: 'items',
        populate: {
            path: 'productId',
            model: 'product'
        }
    });
    responseMsg(res, true, 'Get My Orders', orders);
}
const deleteOrder = async (req, res, next) => {
    let existDB = await DB.findById(req.params.id);
    if (!existDB) {
        next(new Error('Order not found with that ID'));
        return;
    }
    try {
        // Delete OrderItems
        existDB.items.map(async (item) => await orderItemDB.findByIdAndDelete(item._id));
        // Delete Order
        await DB.findByIdAndDelete(existDB._id);
        responseMsg(res, true, 'Delete Order');
    } catch (e) {
        next(new Error('Error =>' + e));
    }

}
module.exports = {
    add,
    getAllOrders,
    getMyOrders,
    deleteOrder
}