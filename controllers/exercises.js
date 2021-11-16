require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require ('axios')
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

module.exports = router