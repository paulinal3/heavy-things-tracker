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

// create an index route to display a list of all of user's workouts
router.get('/history', (req, res) => {
    res.render('workouts/index')
})

// create a show route to display details of a logged workout
router.get('/details', (req, res) => {
    res.render('workouts/show')
})

module.exports = router