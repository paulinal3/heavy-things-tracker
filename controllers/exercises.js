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

// create search route
router.get('/search', (req, res) => {
    res.render('exercises/search')
})

// create index route based on search results
router.get('/search/results', (req, res) => {
    const rootApi = 'https://v1.exercisedb.io/api/exercises'
    let muscleTargeted = req.query.bodyPart

    axios.get(`${rootApi}/bodyPart/${muscleTargeted}`, authHeader)
    .then(apiRes => {
        console.log('this is the apiRes data arr of exercises', apiRes.data)
        const results = apiRes.data
        res.render('exercises/index', {results})
    })
    .catch(error => {
        console.error
    })
})

// create an index route that will display all saved exercises
router.get('/saves', (req, res) => {
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

// create a post route that will save exercise
router.post('/saves/', (req, res) => {
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
        res.redirect('/exercises/saves')
    })
    .catch(error => {
        console.error
    })
})

// create a show route based on exercise clicked on
router.get('/:exercise_name', (req, res) => {
    const rootApi = 'https://v1.exercisedb.io/api/exercises'
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

        res.render('exercises/show', {name, bodyPart, equipment, demoVid, targetMuscle})
    })
    .catch(error => {
        console.error
    })
})

// create a show route based on saved exercise clicked
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

// create delete route for a saved exercise
router.delete('/saves/:id', (req, res) => {
    db.exercise.destroy({
        where: {id: req.params.id}
    })
    .then(deletedSave => {
        res.redirect('/exercises/saves')
    })
})

module.exports = router