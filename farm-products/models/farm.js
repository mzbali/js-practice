const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: String,
    city: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});


farmSchema.post('findOneAndDelete', async (farm) => {
    console.log("Post")
    console.log(farm);
    if (farm.products.length)
        const result = await Product.deleteMany({ _id: { $in: farm.products } });
});


module.exports = mongoose.model('Farm', farmSchema);