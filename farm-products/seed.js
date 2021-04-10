// seed file used to populate the databsse whenever we need, without the need of our express app, just some data to work with, for making our web app.

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection established with the shop database');
    })
    .catch(e => {
        console.log('Error connecting with the database');
        console.log(e);
    })

const Product = require('./models/product');

const data = [
    {
        name: 'Tomato',
        price: 1.66,
        category: 'fruit'
    },
    {
        name: 'Schemed Milk',
        price: 3.66,
        category: 'dairy'
    },
    {
        name: 'Big Onion',
        price: 4.83,
        category: 'vegetable'
    },
    {
        name: 'Indian Garlic',
        price: 3.77,
        category: 'vegetable'
    },
    {
        name: 'Greek Curd',
        price: 8.99,
        category: 'dairy'
    },
    {
        name: 'Green Apple',
        price: 2.33,
        category: 'fruit'
    }
]


Product.insertMany(data)
    .then(d => console.log(d))
    .catch(e => console.log(e))