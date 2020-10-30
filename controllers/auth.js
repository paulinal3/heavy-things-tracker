const express = require('express')
const router = express.Router()

router.get('/signup', (req, res)=>{
    res.send('GET signup.ejs')
})

router.post('/signup', (req, res)=>{
    res.send('POST form data from signup.ejs, then redirect')
})

router.get('/login', (req, res)=>{
    res.send('GET login.ejs')
})

router.post('/login', (req, res)=>{
    res.send('POST form data, validate users email/password')
})

module.exports = router