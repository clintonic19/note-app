const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { captureRejectionSymbol } = require('connect-mongo');
const { Strategy } = require('passport-google-oauth20');


//GOOGLE AUTH REQUEST
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},

    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }
        // console.log(profile.emails[0].value);
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            } else {
                user = await User.create(newUser);
                return done(null, user);
            }

        } catch (error) {
            console.log(error)
        }
    }
));

//GOOGLE LOGIN ROUTE
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

//RETRIEVE USER DATA
router.get('/google/callback',
    passport.authenticate('google',
        {
            failureRedirect: '/login-fail',
            successRedirect: '/dashboard'
        })
    //   function(req, res) {
    //     // Successful authentication, redirect home.
    //     res.redirect('/');
);

//LOGIN FAILURE
router.get('/login-fail', (req, res) => {
    res.send("Email and Password Incorrect try again...")
});

// Logout route && destroy user session
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Logout Error');
        } else {
            res.redirect('/')
        }
    })
});

// PERSIST USER DATA AFTER SUCCESSFUL AUTHENTICATION
passport.serializeUser((user, done) => {
    // done(null, user.id)
    try {
        return done(null, user.id);
    } catch (error) {
        console.log(error)
    }
});

//RETRIEVE USER DATA FROM SESSION.
passport.deserializeUser(async (id, done) => {
    try {
        return done(null, await User.findById(id));
    } catch (error) {
        return done(error)
    }
});

module.exports = router;