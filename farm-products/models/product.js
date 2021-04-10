const mongoose = require('mongoose');
const { Schema } = mongoose;
// not writing connection because we will call it from where routing is written

const productSchema = new Schema({
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
    },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' } //populate call then get data from Farm model/collection
})

module.exports = new mongoose.model('Product', productSchema);



