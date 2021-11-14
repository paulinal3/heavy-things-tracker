const express = require('express')
const router = express.Router()
const axios = require ('axios')

// create search route
router.get('/', (req, res) => {
    res.render('search/index')
})

module.exports = router