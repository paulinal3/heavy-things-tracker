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
})

module.exports = router