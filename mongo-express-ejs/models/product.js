const mongoose = require('mongoose');

// not writing connection because we will call it from where routing is written

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
        min: [0, "Price can't be Negetive"]
    },
    category: {
        type: String,
        required: true,
        enum: ['fruit', 'vegetable', 'dairy'],
        lowercase: true,
        trim: true
    }
})

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;



