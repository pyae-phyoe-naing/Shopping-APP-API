const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'orderitem'
    }],
    count: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.model('order', orderSchema);
module.exports = Order;