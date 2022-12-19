const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const childcatSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    subcatId: {
        type: Schema.Types.ObjectId,
        ref: 'subcat',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const ChildSubCat = mongoose.model('childcat', childcatSchema);
module.exports = ChildSubCat;