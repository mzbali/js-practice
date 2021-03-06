const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const Farm = require('./models/farm');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const sessionConfig = { secret: 'secret', resave: false, saveUninitialized: false }

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig))
app.use(flash()); //adds flash method to req object
app.use((req, res, next) => {
    res.locals.messages = req.flash('messages');
    next();
})

const categories = ['fruit', 'vegetable', 'dairy'];

mongoose.connect('mongodb://localhost:27017/expressRelation', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('connection established with the shop database');
    })
    .catch(e => {
        console.log('Error connecting with the database');
        console.log(e);
    })

//Farms
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})


app.get('/farms/new', (req, res) => {
    res.render('farms/new');
});

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findOne({ _id: req.params.id }).populate('products', 'name');
    res.render('farms/show', { farm });
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash('messages', 'Succesfully saved new farm :)');
    res.redirect('/farms');
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm });
});


app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id); //farm id needed to find out whose product the newly product is.
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    //console.log(farm); //data already there thats why full product shows.
    //console.log(product);
    await farm.save();
    await product.save()
    res.redirect(`/farms/${id}`);
});

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id);
    req.flash('messages', 'Succesfully deleted farm :||');
    res.redirect(`/farms`);
});



//Products
app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (!category) {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' });
    } else {
        const products = await Product.find({ category });
        res.render('products/index', { products, category });
    }
});

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
});

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products');
});

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('farm', 'name');
        if (!product) res.send("product not found");
        res.render('products/show', { product });
    } catch (e) {
        next(e);
    }
});

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
});

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/products/${id}`);
});

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

app.use((err, req, res, next) => {
    res.send("Error products not found")
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});