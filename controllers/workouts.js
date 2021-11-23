require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const multer = require('multer')
const upload = multer({ dest: './uploads/'})
const cloudinary = require('cloudinary')
cloudinary.config(process.env.CLOUDINARY_URL)

// INDEX route to display a list of the user's workout history
router.get('/', isLoggedIn, (req, res) => {
    db.workout.findAll({
        where: { userId: res.locals.currentUser.id }
    })
        .then(workouts => {
            res.render('workouts/index', { results: workouts })
        })
        .catch(error => {
            console.error
        })
})

// NEW route for user to log a workout
router.get('/new', isLoggedIn, (req, res) => {
    res.render('workouts/new')
})

// POST route to create workout in db based on user input
router.post('/', isLoggedIn, upload.single('myFile'), (req, res) => {
    const workoutData = req.body
    console.log('these are the workout details\n', workoutData)
    cloudinary.uploader.upload(req.file.path, (result) => {
        console.log('this is the img result\n', result)
        db.workout.create({
            date: workoutData.date,
            duration: workoutData.duration,
            type: workoutData.type,
            completed: true,
            comments: workoutData.comments,
            img: result.url,
            userId: res.locals.currentUser.id
        })
        .then(createdWorkout => {
            console.log('workout added to db\n', createdWorkout)
            res.redirect('/workouts')
        })
        .catch(error => {
            console.error
        })
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
            console.log('these are the found workout details\n', foundWorkout)
            res.render('workouts/edit', { workoutId, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type, comments: foundWorkout.comments, img: foundWorkout.img })
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
                type: req.body.type,
                comments: req.body.comments
            })
                .then(res.redirect('/workouts'))
        })
        .catch(error => {
            console.error
        })
})

// SHOW route to display details of a logged workout
router.get('/:id', isLoggedIn, (req, res) => {
    console.log('this is the workout id\n', req.params.id)
    db.workout.findOne({
        where: {
            id: req.params.id,
            userId: res.locals.currentUser.id
        }
    })
        .then(foundWorkout => {
            res.render('workouts/show', { workoutId: req.params.id, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type, comments: foundWorkout.comments, img: foundWorkout.img })
        })
        .catch(error => {
            console.error
        })
})

module.exports = router