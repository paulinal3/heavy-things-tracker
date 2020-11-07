const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log(`just created the following user:`, createdUser)
            // res.send('POST form data from signup.ejs, then redirect')
            passport.authenticate('local', {
                successRedirect: '/',
            })(req, res) // why does this need to be an IIFE???
        } else {
            console.log('An account associated with that email address already exists! Did you mean to login?')
            res.redirect('/auth/login')
        }
    })
    .catch(err =>{
        console.log(err)
    })
})

router.get('/login', (req, res)=>{
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/'
    })
)

router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})

module.exports = router