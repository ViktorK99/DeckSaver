const express = require('express');
let handlebars = require('express-handlebars');
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.engine('hbs', handlebars({
        extname:'hbs', 
        helpers: {
            toLowerCase: function(str) {
                return str.toLowerCase();
            }
        }
    }));

    app.set('view engine','hbs');
    
    app.use(express.urlencoded({
        extended: true,
    }));
    
    app.use(express.static('static'));

    app.use(cookieParser());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.json()) 
};