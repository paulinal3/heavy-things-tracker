const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send("auth_practice home route")
})

app.get('/auth/signup', (req, res)=>{
    res.send('GET signup.ejs')
})

app.post('/auth/signup', (req, res)=>{
    res.send('POST form data from signup.ejs, then redirect')
})

app.get('/auth/login', (req, res)=>{
    res.send('GET login.ejs')
})

app.post('/auth/login', (req, res)=>{
    res.send('POST form data, validate users email/password')
})

app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})