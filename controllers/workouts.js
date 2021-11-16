require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
const authHeader = {
    headers: {
        'Authorization': process.env.API_KEY
    }
}

module.exports = router