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
router.get('/', (req, res) => {
    res.render('search/main')
})

// // create a search results route
// router.get('/results', (req, res) => {
//     const exerciseApi = 'https://wger.de/api/v2/exercise/'
//     const eng = 'language=2'
//     const limit = 'limit=5000'
//     let muscleGroup = req.query.category

//     axios.get(`${exerciseApi}?category=${muscleGroup}&${eng}&${limit}`)
//     .then(apiRes => {
//         console.log('this is results of exercises\n', apiRes.data.results)
//         const results = apiRes.data.results
//         res.render('search/results', {results})
//     })
//     .catch(error => {
//         console.error
//     })
// })

router.get('/results', (req, res) => {
    const rootApi = 'https://v1.exercisedb.io/api/exercises'
    let muscleTargeted = req.query.bodyPart

    axios.get(`${rootApi}/bodyPart/${muscleTargeted}`, authHeader)
    .then(apiRes => {
        console.log('this is the apiRes', apiRes)
    })
    .catch(error => {
        console.error
    })
})

// // create a detailed exercise route
// router.get('/:exercise_id', (req, res) => {
//     let exerciseId = req.params.exercise_id
//     const rootApi = 'https://wger.de/api/v2/'
//     const eng = 'language=2'

//     axios.get(`${rootApi}exercise/${exerciseId}?${eng}`)
//     .then(apiRes => {
//         console.log('these are main exercise details \n', apiRes.data)
//         let name = apiRes.data.name
//         let muscleGroupId = apiRes.data.category
//         let description = apiRes.data.description
//         let primaryMuscle = apiRes.data.muscles[0]
//         let secondaryMuscle = apiRes.data.muscles[0]
        
//         axios.get(`${rootApi}exercisecategory/${muscleGroupId}`)
//             .then(categoryRes => {
//                 console.log('this is the muscle group \n', categoryRes.data)
//                 let muscleGroup = categoryRes.data.name

//                 res.render('search/details', {name, description, primaryMuscle, secondaryMuscle, muscleGroup})
//             })
//     })
//     .catch(error => {
//         console.error
//     })
// })

module.exports = router