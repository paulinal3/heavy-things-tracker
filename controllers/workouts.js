require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const authHeader = {
    headers: {
        'Authorization': process.env.API_KEY
    }
}

// create new route for user to log a workout
router.get('/new', isLoggedIn, (req, res) => {
    res.render('workouts/new')
})

// <------------ id not working -------------->
// create post route to workout user inputted
router.post('/new', isLoggedIn, (req, res) => {
    const workoutData = req.body
    console.log('these are the workout details\n', workoutData)
    db.workout.create({
        date: workoutData.date,
        duration: workoutData.duration,
        type: workoutData.type,
        // userId = res.locals.currentUser.id
    })
    .then(createdWorkout => {
        console.log('workout added to db\n', createdWorkout)
        res.redirect('/workouts/history')
    })
    .catch(error => {
        console.error
    })
})

// create a new route for user to plan a workout
router.get('/newPlan', isLoggedIn, (req, res) => {
    res.render('workouts/newPlan')
})

// create an index route to display a list of all of user's workouts
router.get('/history', isLoggedIn, (req, res) => {
    db.workout.findAll()
    .then(workouts => {
        res.render('workouts/index', {results:  workouts})
    })
    .catch(error => {
        console.error
    })
})

// create a show route to display details of a logged workout
router.get('/details', isLoggedIn, (req, res) => {
    res.render('workouts/show')
})

module.exports = router