require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
const authHeader = {
    headers: {
        'Authorization': process.env.API_KEY
    }
}

// create new route for user to log a workout
router.get('/new', (req, res) => {
    res.render('workouts/new')
})

module.exports = router