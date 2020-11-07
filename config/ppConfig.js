const passport = require('passport')
const db = require('../models')

/*
 Passport "serializes" objects to make them easy to store,
 converting the user to an identifier (id)
*/
passport.serializeUser((user, doneCallback) => {
    doneCallback(null, user.id)
})
   
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then((err, foundUser) => {
        doneCallback(err, foundUser)
    })
    .catch((err)=>{
        console.log("error deserializing user")
    })
})

module.exports = passport