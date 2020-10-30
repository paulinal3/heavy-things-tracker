const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// body parser middelware
app.use(express.urlencoded({extended:false}))

// controllers middleware
app.use('/auth', require('./controllers/auth'))


app.get('/', (req, res)=>{
    res.send("auth_practice home route")
})


app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})