const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')

app.set('view engine', 'ejs')
app.use(ejsLayouts)

// controllers middleware
app.use('/auth', require('./controllers/auth'))


app.get('/', (req, res)=>{
    res.send("auth_practice home route")
})


app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})