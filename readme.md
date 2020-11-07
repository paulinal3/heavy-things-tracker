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
const passport = require('config/ppConfig.json')
```

* Serialize the user because the [docs](https://www.npmjs.com/package/passport#sessions) tell us we have to for sessions:
```javascript
passport.serializeUser((user, doneCallback) => {
    doneCallback(null, user.id)
})
   
passport.deserializeUser((id, doneCallback) => {
    db.user.findByPk(id)
    .then((err, foundUser) => {
        doneCallback(err, foundUser)
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




