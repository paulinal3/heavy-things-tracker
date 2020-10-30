const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send("auth_practice home route")
})

app.listen(3000, ()=>{
    console.log("auth_practice running on port 3000")
})