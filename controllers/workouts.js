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

// NEW route for user to log a workout
router.get('/new', isLoggedIn, (req, res) => {
    res.render('workouts/new')
})

// POST route to create workout in db based on user input
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

// NEW route for user to plan a workout
router.get('/newPlan', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {id: res.locals.currentUser.id}
    })
    .then(user => {
        user.getExercises()
        .then(saves => {
            // console.log('these are all the users saved exercises\n', saves)
            res.render('workouts/newPlan', {exerciseSaves: saves})
        })
    })
    .catch(error => {
        console.error
    })
})

// // POST route that will add a saved exercise to a planned workout
// router.post('/newPlan', isLoggedIn, (req, res) => {
//     db.workout.findOne({
//         where: {userId: res.locals.currentUser.id},
//         include: [db.user, db.exercise]
//     })
//     .then(foundWorkout => {
//         foundWorkout.getExercises()
//         .then(exercise => {
//             name = exercise.name
//         })
//         .then(foundSavedExercise => {
//             res.redirect('/workouts/newPlan')
//         })
//         .catch(error => {
//             console.error
//         })
//     })
// })

// POST route that will add a saved exercise to a planned workout
router.post('/newPlan', isLoggedIn, (req, res) => {
    const exerciseData = req.body
    console.log('these are the exercise details\n', exerciseData)
    db.user.findOne({
        where: {id: res.locals.currentUser.id}
    })
    .then(foundUser => {
        foundUser.getExercises({
            where: {
                name: req.body.name,
                equipment: req.body.equipment
            }
        })
        .then(foundExercise => {
            res.redirect('/workouts/newPlan')
        })
    })
})

// GET/INDEX route to display a list of all of user's workouts
router.get('/', isLoggedIn, (req, res) => {
    db.workout.findAll({
        where: {userId: res.locals.currentUser.id}
    })
    .then(workouts => {
        res.render('workouts/index', {results:  workouts})
    })
    .catch(error => {
        console.error
    })
})

// GET route to render the edit workout page
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
    .catch(error => {
        console.error
    })
})

// PUT route to edit workout
router.put('/edit/:id', isLoggedIn, (req, res) => {
    console.log('this button works?')
    db.workout.findOne({
        where: {
            id: req.params.id,
            userId: res.locals.currentUser.id
        }
    })
    .then(foundWorkout => {
        console.log('updating workout to this id\n', foundWorkout.id)
        console.log('this should be the whole workout\n', req.body)
        foundWorkout.update({
            date: req.body.date,
            duration: req.body.duration,
            type: req.body.type
        })
        .then(res.redirect('/workouts'))
    })
    .catch(error => {
        console.error
    })
})

// SHOW route to display details of a logged workout
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
    .catch(error => {
        console.error
    })
})

module.exports = router