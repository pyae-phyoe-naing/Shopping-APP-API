const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const warrantySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    remark: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Warranty = mongoose.model('warranty', warrantySchema);
module.exports = Warranty;