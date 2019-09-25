const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user')
const validHost = require('../models/validHost')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

passport.use(new GoogleStrategy({

  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret

  }, (accessToken, requestToken, profile, done) => {

    User.findOne({
      googleId: profile.id
    }).then((currentUser) => {
      if(currentUser)
        console.log("not a new user")

      else{
        let isHost = false
        let doc = mongoose.model('hosts')
        let record = doc.findOne({email: profile.emails[0].value})
        if(record)
        isHost = true
        new User({
          username: profile.displayName,
          googleId: profile.id,
          image: profile.photos[0].value,
          isHost: isHost

        }).save().then((newUser) => {
            console.log(newUser)
        })
      }
    })
  })
)