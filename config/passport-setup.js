const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user')
const validHost = require('../models/validHost')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


passport.serializeUser((user,done) => {
  done(null, user.id)
})


passport.deserializeUser((id,done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})



passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
}, (accessToken, requestToken, profile, done) => {

  User.findOne({
    googleId: profile.id
    }).then((currentUser) => {

      if(currentUser){
        console.log(currentUser)
        done(null, currentUser)
      }

      else{
        // console.log(profile)
        let isHost ;
        mongoose.model('hosts').find({"email": profile.emails[0].value}, function(err, result){
          // console.log(result)
          if(result[0])
          isHost = true
          else
          isHost = false
          new User({
            username: profile.displayName,
            googleId: profile.id,
            image: profile.photos[0].value,
            isHost: isHost
          }).save().then((newUser) => {
            console.log(newUser)
            done(null, newUser)
          })
        })
        // if(Object.keys(record).length >= 0)
        // isHost = true
        
        // new User({
        //   username: profile.displayName,
        //   googleId: profile.id,
        //   image: profile.photos[0].value,
        //   isHost: isHost
        // }).save().then((newUser) => {
        //   console.log(newUser)
        //   done(null, newUser)
        // })
      }
    })
  })
)