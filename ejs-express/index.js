const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));


app.listen(8080, () => {
    console.log('listening on port 8080');
})

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/r/:subreddit', (req, res) => {   //Everytime /r/something pattern request run this code
    const { subreddit } = req.params;      //Take the parameter or route name
    const data = redditData[subreddit];    //Request the parameter requested data drom Database
    if (data) {
        res.render('subreddit', { ...data }); // Render from template depending on the data
    } else {
        res.render('error', { name: subreddit });
    }

})

app.get('/rand', (req, res) => {
    const num = Math.floor(Math.random() * 10) + 1;
    res.render('random', { num });
})