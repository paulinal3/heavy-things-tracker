const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig')

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// body parser middelware
app.use(express.urlencoded({extended:false}))

// session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// controllers middleware
app.use('/auth', require('./controllers/auth'))

// home route
app.get('/', (req, res)=>{
    if(req.user){
        res.send(`req.user: ${req.user.name}`)
    } else {
        res.send("no user currently logged in")
    }
})


app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})