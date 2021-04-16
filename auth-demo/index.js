const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Database is connected');
    })
    .catch(err => {
        console.log(`Database Error: ${err}`);
    })

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) return res.redirect('/login');
    next();
}

app.get('/', (req, res) => {
    res.send('Home');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

//  password hashing while user.save() and password verification when logging was done on userSchema using (pre and statics)

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password }); //we will hash it on the userSchema pre save, never save literal password;
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.verifyUser(username, password);
    if (!user) return res.send('not welcome');
    req.session.user_id = user._id;
    res.send('welcome');
});

app.post('/logout', (req, res) => { //post route is better for it;
    req.session.user_id = null;
    res.redirect('/login');
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
});

app.get('/moresecret', requireLogin, (req, res) => {
    res.send('<h1>moresecret</h1>');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});