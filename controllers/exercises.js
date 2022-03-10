require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const authHeader = {
    headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY
    }
}

// create search route
router.get('/search', (req, res) => {
    res.render('exercises/search', { user: res.locals.currentUser })
})

// INDEX route based on search results
router.get('/', (req, res) => {
    const rootApi = 'https://exercisedb.p.rapidapi.com/exercises'
    let muscleTargeted = req.query.bodyPart

    axios.get(`${rootApi}/bodyPart/${muscleTargeted}`, authHeader)
    .then(apiRes => {
        console.log('this is the apiRes data arr of exercises', apiRes.data)
        const results = apiRes.data
        res.render('exercises/index', { results, user: res.locals.currentUser })
    })
    .catch(error => {
        console.error
    })
})

// POST route that will save exercise
router.post('/', isLoggedIn, (req, res) => {
    const exerciseData = JSON.parse(JSON.stringify(req.body))
    // console.log('this is the exercise data to be saved', exerciseData)
    db.user.findOne({
        where: {id: res.locals.currentUser.id}
    })
    .then(foundUser => {
        console.log('saving exercise to this user\n', foundUser.name)
        foundUser.createExercise({
            name: exerciseData.name,
            bodyPart: exerciseData.bodyPart,
            equipment: exerciseData.equipment,
            muscleTargeted: exerciseData.muscleTargeted,
            exerciseDemo: exerciseData.exerciseDemo 
        })
        .then(saveExercise =>{
            res.redirect('/exercises/saves')
        })
    })
    .catch(error => {
        console.error
    })
})

// INDEX route that will display all saved exercises
router.get('/saves', isLoggedIn, (req, res) => {
    db.user.findOne({
        where: {id: res.locals.currentUser.id}
    })
    .then(user => {
        user.getExercises()
        .then(saves => {
            res.render('exercises/indexSaves', {exerciseSaves: saves})
        })
    })
})

// SHOW route based on exercise clicked on
router.get('/:exercise_name', (req, res) => {
    const rootApi = 'https://exercisedb.p.rapidapi.com/exercises'
    let exerciseName = req.params.exercise_name

    axios.get(`${rootApi}/name/${exerciseName}`, authHeader)
    .then(apiRes => {
        // console.log('these are the exercise details', apiRes.data)
        const results = apiRes.data[0]
        let name = results.name
        let bodyPart = results.bodyPart
        let equipment = results.equipment
        let demoVid = results.gifUrl
        let targetMuscle = results.target

        res.render('exercises/show', {name, bodyPart, equipment, demoVid, targetMuscle, user: res.locals.currentUser })
    })
    .catch(error => {
        console.error
    })
})

// SHOW route based on saved exercise clicked
router.get('/saves/:id', isLoggedIn, (req, res) => {
    let savedId = req.params.id
    db.exercise.findOne({
        where: {id: savedId},
        // include: [db.user, db.exercise]
    })
    .then(foundSave => {
        res.render('exercises/showSaves', {id: savedId, name: foundSave.name, bodyPart: foundSave.bodyPart, equipment: foundSave.equipment, muscleTargeted: foundSave.muscleTargeted, exerciseDemo: foundSave.exerciseDemo})
    })
    .catch(error => {
        console.error
    })
})

// DELETE route for a saved exercise
router.delete('/saves/:id', isLoggedIn, (req, res) => {
    db.exercise.destroy({
        where: {id: req.params.id}
    })
    .then(deletedSave => {
        res.redirect('/exercises/saves')
    })
    .catch(error => {
        console.error
    })
})

module.exports = router