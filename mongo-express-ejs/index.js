const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const path = require('path');
const methodOverride = require('method-override');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('connection established with the shop database');
    })
    .catch(e => {
        console.log('Error connecting with the database');
        console.log(e);
    })

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (!category) {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    } else {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/detail', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/products/${id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})