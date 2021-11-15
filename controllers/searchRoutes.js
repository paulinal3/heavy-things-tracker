const express = require('express')
const router = express.Router()
const axios = require ('axios')

// create search route
router.get('/', (req, res) => {
    res.render('search/main')
})

// create a search results route
router.get('/results', (req, res) => {
    const exerciseApi = 'https://wger.de/api/v2/exercise/'
    const eng = 'language=2'
    const limit = 'limit=500'
    let muscleGroup = req.query.category

    axios.get(`${exerciseApi}?category=${muscleGroup}&${eng}&${limit}`)
    .then(apiRes => {
        console.log('this is results of exercises\n', apiRes.data.results)
        const results = apiRes.data.results
        res.render('search/results', {results})
    })
    .catch(error => {
        console.error
    })
})

// create a detailed exercise route
router.get('/:exercise_id', (req, res) => {
    let exerciseId = req.params.exercise_id
    const exerciseApi = 'https://wger.de/api/v2/exercise/'
    const eng = 'language=2'

    axios.get(`${exerciseApi}${exerciseId}?${eng}`)
    .then(apiRes => {
        console.log('this is apiRes.data \n', apiRes.data)
        let name = apiRes.data.name
        let muscleGroup = apiRes.data.category
        let description = apiRes.data.description
        let primaryMuscle = apiRes.data.muscles[0]
        let secondaryMuscle = apiRes.data.muscles[0]

        res.render('search/details', {name, muscleGroup, description, primaryMuscle, secondaryMuscle})
    })
})

module.exports = router