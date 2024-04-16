require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const app = express();

const port = process.env.PORT || 5000; 

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MongoDB_URI
    }),
    // cookie: { maxAge: new Date(Date.now() + (3600000)) }
}));

//passport method
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Database Connnection
connectDB();

//Static Files
app.use(express.static('public'));

//Templating engines
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Routes for URL
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));
app.use('/', require('./server/routes/auth'));

// 404 Handling Route
app.get('*', (req, res) => {
    // res.status(404).send('404 PAGE NOT FOUND')
    res.status(404).render('404')
})


//PORT Number
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})


