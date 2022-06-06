const express = require('express')
const app = express()
const session = require('express-session')
require('dotenv').config()


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

app.set('view engine', 'ejs')

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
}));


app.get('/', (req, res) => {
    res.render('pages/auth')
})

// Passport code
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
// Passport code

//GOOGLE AUTH

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = CLIENT_ID;
const GOOGLE_CLIENT_SECRET = CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });

//GOOGLE AUTH

app.get("*", (req, res) => {
    const currDateTime = new Date();
    const serverDateTime = {
        time: currDateTime.toLocaleTimeString(),
        day: currDateTime.getDate(),
        month: currDateTime.getMonth(),
        year: currDateTime.getFullYear(),
        date: currDateTime.toLocaleDateString()
    }
    res.status(200).json({
        message: "Welcome",
        detail: "this might not be the page you are looking for",
        time: serverDateTime
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Nodejs server listening at http://localhost:${PORT}...`)
})