require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const db = require('./models')
const methodOverride = require('method-override')
// const multer = require('multer')
// const upload = multer({ dest: './uploads/'})
// const cloudinary = require('cloudinary')
// cloudinary.config(process.env.CLOUDINARY_URL)

// static css and js middleware
app.use('/static',express.static(__dirname + '/static/'))

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// method override middleware
app.use(methodOverride('_method'))

// body parser middelware
app.use(express.urlencoded({extended:false}))

// session middleware
app.use(session({
    secret: process.env.SUPER_SECRET_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware (must go AFTER session middleware)
app.use(flash())

// custom middleware
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next()
})

// controllers middleware 
app.use('/auth', require('./controllers/auth'))
app.use('/exercises', require('./controllers/exercises'))
app.use('/workouts', require('./controllers/workouts'))

// home route
app.get('/', (req, res)=>{
    res.render('home')
})

// profile route
// app.get('/profile', isLoggedIn, (req, res)=>{
//     db.workout.findAll()
//     .then(workouts => {
//         res.render('profile', {results:  workouts})
//     })
//     .catch(error => {
//         console.error
//     })
// })

// app.get('/profile', isLoggedIn, (req, res)=>{
//     db.workout.findAll({
//         where: {userId: res.locals.currentUser.id},
//         include: [db.user, db.exercise]
//     })
//     .then(workouts => {
//         console.log('these are all the workouts\n', workouts)
//         workouts.exercises.forEach(exercise => {
//             console.log('these are the saved exercises\n', exercise)
//             res.render('profile', {results: workouts, saves: exercise})
//         })
//         // db.exercise.findAll()
//         // .then(exercises => {
//         //     res.render('profile', {results: workouts, saves: exercises})
//         // })
//     })
//     .catch(error => {
//         console.error
//     })
// })

app.get('/profile', isLoggedIn, (req, res) => {
        db.user.findOne({
            where: {id: res.locals.currentUser.id}
        })
        .then(user => {
            user.getExercises()
            .then(exercise => {
                console.log('these are the saved exercises\n', exercise)
                db.workout.findAll({
                    where: {userId: res.locals.currentUser.id}
                })
                .then(workout => {
                    console.log('these are all the workouts\n', workout)

                    res.render('profile', {results: workout, saves: exercise})
                })
            })
        })
        .catch(error => {
            console.error
    })
})

// // post route to upload images
// app.post('/profile', upload.single('myFile'), (req, res) => {
//     cloudinary.uploader.upload(req.file.path, (result) => {
//         res.send(result)
//     })
// })

app.listen(3000, ()=>{
    console.log("heavy things grind 💪🏼🏋🏽‍♀️")
})