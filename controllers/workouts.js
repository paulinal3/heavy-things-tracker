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

// create post route to workout user inputted
router.post('/new', isLoggedIn, (req, res) => {
    const workoutData = req.body
    console.log('these are the workout details\n', workoutData)
    db.workout.create({
        date: workoutData.date,
        duration: workoutData.duration,
        type: workoutData.type,
        userId: res.locals.currentUser.id
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


// create a get route to render the edit workout page
router.get('/edit/:id', isLoggedIn, (req, res) => {
    let workoutId = req.params.id
    console.log('this is the workout id\n', workoutId)
    db.workout.findOne({
        where: {
            id: workoutId,
            userId: res.locals.currentUser.id
        }
    })
    .then(foundWorkout => {
        res.render('workouts/edit', {workoutId, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type})
    })
})

// create a put route to edit workout
router.put('/edit/:id', isLoggedIn, (req, res) => {
    db.workout.findOne({
        where: {
            id: req.params.id,
            userId: res.locals.currentUser.id
        }
    })
    .then(foundWorkout => {
        console.log('updating workout to this id\n', foundWorkout.id)
        foundWorkout.update({
            date: req.body.date,
            duration: req.body.duration,
            type: req.body.type
        })
        res.redirect('/workouts/history')
    })
})

// create a show route to display details of a logged workout
router.get('/details/:id', isLoggedIn, (req, res) => {
    console.log('this is the workout id\n', req.params.id)
    db.workout.findOne({
        where: {
            id: req.params.id,
            userId: res.locals.currentUser.id
        }
    })
    .then(foundWorkout => {
        res.render('workouts/show', {workoutId: req.params.id, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type})
    })
})

module.exports = router