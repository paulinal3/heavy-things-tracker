require('dotenv').config()
const express = require('express')
const router = express.Router()
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
// const { application } = require('express')
const multer = require('multer')
const upload = multer({ dest: './uploads/'})
const cloudinary = require('cloudinary')
cloudinary.config(process.env.CLOUDINARY_URL)

// NEW route for user to log a workout
router.get('/new', isLoggedIn, (req, res) => {
    res.render('workouts/new')
})

// POST route to create workout in db based on user input
// router.post('/new', isLoggedIn, (req, res) => {
//     const workoutData = req.body
//     console.log('these are the workout details\n', workoutData)
//     db.workout.create({
//         date: workoutData.date,
//         duration: workoutData.duration,
//         type: workoutData.type,
//         completed: true,
//         comments: workoutData.comments,
//         userId: res.locals.currentUser.id
//     })
//         .then(createdWorkout => {
//             console.log('workout added to db\n', createdWorkout)
//             res.redirect('/workouts')
//         })
//         .catch(error => {
//             console.error
//         })
// })

// // POST route to create workout in db based on user input
router.post('/new', isLoggedIn, upload.single('myFile'), (req, res) => {
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

// GET/INDEX route to display a list of the user's workout history
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

// INDEX route to display all planned workouts
router.get('/scheduled', isLoggedIn, (req, res) => {
    db.workout.findAll({
        where: {
            userId: res.locals.currentUser.id,
            completed: false
        }
    })
    .then(foundPlannedWorkouts => {
        console.log('these are the users planned workouts\n', foundPlannedWorkouts)
        res.render('workouts/indexPlan', {results: foundPlannedWorkouts})
    })
})

// NEW route for user to plan a workout
router.get('/newPlan', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: { id: res.locals.currentUser.id }
    })
        .then(user => {
            user.getExercises()
                .then(saves => {
                    // console.log('these are all the users saved exercises\n', saves)
                    res.render('workouts/newPlan', { exerciseSaves: saves })
                })
        })
        .catch(error => {
            console.error
        })
})

// POST route to add a planned workout to db
router.post('/newPlan', isLoggedIn, (req, res) => {
    const plannedWorkoutData = req.body
    console.log('these are the planned workout details\n', plannedWorkoutData)
    addNameArr = plannedWorkoutData.name

    addNameArr.forEach(exerciseName => {
        db.workout.findOrCreate({
            where: {
                userId: res.locals.currentUser.id,
                scheduledDate: plannedWorkoutData.scheduledDate,
                type: plannedWorkoutData.type
            }
        })
            .then(([workout, created]) => {
                db.exercise.findOrCreate({
                    where: { name: exerciseName }
                })
                    .then(([exercise, created]) => {
                        workout.addExercise(exercise)
                    })
                    .then(workoutExercise => {
                        console.log('this is the  workoutExercise\n', workoutExercise)
                    })
            })
        res.redirect('/workouts/newPlan')
    })
    .catch(error => {
        console.error
    })
})

// POST route that will add a saved exercise to a planned workout
// router.post('/newPlan', isLoggedIn, (req, res) => {
//     const plannedWorkoutData = req.body
//     console.log('these are the planned workout details\n', plannedWorkoutData)
//     addNameArr = plannedWorkoutData.name
//     addNameArr.forEach(exerciseName => {
//         db.exercise.findOne({
//             where: {name: exerciseName}
//         })
//         .then(foundExercise => {
//             foundExercise.createWorkout({
//                 scheduledDate: plannedWorkoutData.date,
//                 type: plannedWorkoutData.type
//             })
//             .then(createdWorkout => {
//                 res.redirect('/workouts/newPlan')
//             })
//         })
//     })
// })

// GET route to render edit planned workout page
router.get('/scheduled/edit/:scheduledDate/:type', isLoggedIn, (req, res) => {
    db.workout.findAll({
        where: {
            scheduledDate: req.params.scheduledDate,
            type: req.params.type,
            userId: res.locals.currentUser.id
        }
    })
    .then(foundWorkout => {
        console.log('these are the found planned workouts\n', foundWorkout)
        workout.getExercises()
        .then(foundWorkoutExercises => {
            foundWorkoutExercises.forEach(workoutExercise => {
                console.log('these are the workout exercises\n', workoutExercise)
            })
            // console.log('these are the workout exercises\n', foundWorkoutExercises)
            
            res.render('workouts/editPlan', { scheduledDate: req.params.scheduledDate, type: req.params.type})
        })
    })
})

// SHOW route to display details of a logged workout
router.get('/scheduled/:scheduledDate/:type', isLoggedIn, (req, res) => {
    console.log(`this is the scheduled workout date: ${req.params.scheduledDate} and type: ${req.params.type}`)
    db.workout.findOne({
        where: {
            scheduledDate: req.params.scheduledDate,
            type: req.params.type,
            userId: res.locals.currentUser.id
        }
    })
        .then(foundWorkout => {
            res.render('workouts/showPlan', { scheduledDate: req.params.scheduledDate, type: req.params.type})
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
            res.render('workouts/edit', { workoutId, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type })
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
router.get('/:id', isLoggedIn, (req, res) => {
    console.log('this is the workout id\n', req.params.id)
    db.workout.findOne({
        where: {
            id: req.params.id,
            userId: res.locals.currentUser.id
        }
    })
        .then(foundWorkout => {
            res.render('workouts/show', { workoutId: req.params.id, date: foundWorkout.date, duration: foundWorkout.duration, type: foundWorkout.type })
        })
        .catch(error => {
            console.error
        })
})

module.exports = router