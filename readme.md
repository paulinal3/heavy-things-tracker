### Set up Express Sessions
* install it
```
npm i express-session
```

* import it in `index.js`: 
```javascript
const session = require('express-session')
```
* set up session middleware: 
```javascript
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
```

* Change home route to say something useful for our next steps:

```javascript
app.get('/', (req, res)=>{
    if(req.user){
        res.send(`req.user: ${req.user.name}`)
    } else {
        res.send("no user currently logged in")
    }
})
```
---
### Set up Passport

* Install [passport](http://www.passportjs.org/)
```
npm i passport
```
* Create a configuration file `config/ppConfig.js` where we'll put all of the passport-specific set up code (so we don't make `index.js` super long)

```javascript
const passport = require('passport')

// put a bunch of configuration stuff in here to set up the strategy

module.exports = passport
```

* Import the code from the configuration file back into `index.js`:
```javascript
const passport = require('config/ppConfig.js')
```

* Serialize the user because the [docs](https://www.npmjs.com/package/passport#sessions) tell us we have to for sessions:
```javascript
passport.serializeUser((user, doneCallback) => {
    console.log("serializing user...")
    doneCallback(null, user.id)
})
   
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then(foundUser => {
        console.log("deserializing user....")
        doneCallback(null, foundUser)
    })
    .catch((err)=>{
        console.log("error deserializing user")
    })
})
```

* Set up passport middleware BELOW session middleware per [docs](https://www.npmjs.com/package/passport#middleware)

```javascript
app.use(passport.initialize())
app.use(passport.session())
```

* Install [passport local](http://www.passportjs.org/packages/passport-local/)

```
npm i passport-local
```

* Import `passport-local` into `config/ppConfig.js`
```javascript
const LocalStrategy = require('passport-local')
```

* Set up `passport-local` as the strategy in `config/ppConfig.js`

```javascript
const findAndLogInUser = (email, password, doneCallback) => {
    db.user.findOne({where:{email:email}})
    .then(foundUser=>{
        if (!foundUser || !foundUser.validPassword(password)) { 
            return doneCallback(null, false)
        } else {
            return doneCallback(null, foundUser);
        }
    })
    .catch(err=>doneCallback(err))
}

const fieldsToCheck = {
    usernameField: 'email',
    passwordField: 'password'
}

const strategy = new LocalStrategy(fieldsToCheck, findAndLogInUser)

passport.use(strategy)
```

* Import passport to your auth controller
```javascript
const passport = require('../config/ppConfig.js')
```

* Modify login route to use passport and check to see if loggin in works!

```javascript
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/'
    })
)
```

**> TEST NOW!!!!** Can you login?

* Modify sign up route to automatically log the new user in after a new user upon successful signup

```javascript
router.post('/signup', (req, res)=>{
    db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log(`just created the following user:`, createdUser)
            // res.send('POST form data from signup.ejs, then redirect')
            passport.authenticate('local', {
                successRedirect: '/',
            })(req, res) // why does this need to be an IIFE???
        } else {
            console.log('An account associated with that email address already exists! Did you mean to login?')
            res.redirect('/auth/login')
        }
    })
    .catch(err =>{
        console.log(err)
    })
})
```

* Add a logout route!

```javascript
router.get('/logout', (req, res)=>{
    req.logout()
    res.redirect('/')
})
```
---
### Set Up Flash Messages

* Install
```
npm i connect-flash
```

* Import to `index.js`
```javascript
const flash = require('connect-flash')
```

* Set up the `connect-flash` middleware **after** the session middlware (since it uses sessions to story the messages):

```javascript
app.use(flash())
```

* Add flash messages to the request object manually and via passport (look for `//!->FLASH<-!)` comments) to auth route:
```javascript
router.post('/signup', (req, res)=>{
    db.user.findOrCreate({
        where: {email: req.body.email},
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log(`just created the following user:`, createdUser)
            // res.send('POST form data from signup.ejs, then redirect')
            passport.authenticate('local', {
                successRedirect: '/', // !-> FLASH <-!
                successFlash: 'Account created and logged in!'
            })(req, res) // why does this need to be an IIFE???
        } else { // !-> FLASH <-!
            req.flash('error', 'email already exists, try logging in') 
            // console.log('An account associated with that email address already exists! Did you mean to login?')
            res.redirect('/auth/login')
        }
    })
    .catch(err =>{ // !-> FLASH <-!
        req.flash('error', error.message) 
        res.redirect('/auth/signup')
    })
})
```

```javascript
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/auth/login',
        successRedirect: '/', // !-> FLASH <-!
        failureFlash: 'Invalid username and/or password.',
        successFlash: 'You are now logged in.'
    })
)
```

```javascript
router.get('/logout', (req, res)=>{
    req.logout() // !-> FLASH <-!
    req.flash('Success! You\'re logged out.')
    res.redirect('/')
})
```

* Set up custom middlware (underneath the flash and session middleware) so our messages are always available in our ejs and we don't have to pass through `req.alerts` to our ejs manually (let's also do this with the user!):

```javascript
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next()
})
```
---
### Display the flash messages and current user

* Create a `views/partials/alerts.ejs` file with the following:

```markup
<% if (alerts.error) { %>
    <% alerts.error.forEach(msg => { %>
      <%= msg %>
    <% }) %>
<% } %>
<% if (alerts.success) { %>
    <% alerts.success.forEach(msg => { %>
        <%= msg %>
    <% }) %>
<% } %>
```

* Include your partial in your `layout.ejs`
```markup
    <%- include('partials/alerts') %>
```

* Create a `views/home.ejs` page

```markup
<h2>Express Auth Boilerplate Home Page</h2>
```

* Modify home route to show the new home ejs

```javascript
app.get('/', (req, res)=>{
    res.render('home')
})
```

* Add a nav bar to the `layout.ejs` header:

```markup
<nav>
    <ul>
        <% if (!currentUser) { %>
        <li><a href="/auth/signup">Signup</a></li>
        <li><a href="/auth/login">Login</a></li>
        <% } else { %>
        <li><a href="/auth/logout">Logout</a></li>
        <li><a href="/profile">Profile</a></li>
        <% } %>
    </ul>
    </nav>
```

* Add a `views/profile.ejs`
```markup
<h2><%= currentUser %>'s Profile</h2>
```

* Add a `/profile` route in `index.js`:
```javascript
app.get('/profile', (req, res)=>{
    res.render('profile')
})
```







