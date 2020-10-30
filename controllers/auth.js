const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    db.user.create(req.body)
    .then(createdUser=>{
        console.log("just created the following user:", createdUser)
    })
    .catch(err =>{
        console.log(err)
    })
    console.log('signup form data:', req.body)
    res.send('POST form data from signup.ejs, then redirect')
})

router.get('/login', (req, res)=>{
    res.render('auth/login')
})

router.post('/login', (req, res)=>{
    console.log('login form data:', req.body)
    res.send('POST form data, validate users email/password')
})

module.exports = router