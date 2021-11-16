require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
const authHeader = {
    headers: {
        'Authorization': process.env.API_KEY
    }
}

// create search route
router.get('/search', (req, res) => {
    res.render('exercises/search')
})

module.exports = router