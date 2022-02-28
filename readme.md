# Heavy Things Tracker
A fullstack application that allows users to search over 1300 exercises to save for their next workout! User also have the ability to log details of a completed workout and view all logged workouts through their workout history.

## Deployed App
https://heavy-things-tracker.herokuapp.com/

## Userflow
![Userflow-diagram](./pitch-images/user-flowchart.png)

## Install
1. Download code to your terminal, then run `npm i` to install the following packages: 
     * `axios`
     * `method_override`
     * `cloudinary`
     * `multer`
2. Open code
3. In browser, go to https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/ and sign up for free account and subscribe to ExeciseDB API
4. Copy your X-RapidApi-Key and paste in the `.env` file
5. `.env` file should look like this:
     ```js
     RAPID_API_KEY=<yourApiKey>
     SUPER_SECRET_SECRET=<anyWordYouWant>
     ```
6. Go to https://cloudinary.com/ and sign up for a free account
7. Once you verify your account, go to Dashboard and copy your API Environment variable
8. Paste into your `.env` on a new line
     ```js
     CLOUDINARY_URL=<cloudinary://**************:**************@paulinal3>
     ```

## Tech Stack
* Postgres
* Express
* Node.JS
* CSS/Bootstrap

## Wireframes
* Welcome Page
![Wireframe](./pitch-images/welcome-page.png)
* User Profile
![Wireframe](./pitch-images/profile.png)
* Search
![Wireframe](./pitch-images/search.png)
* Similar Layout for Search Results and Saved Lists
![Wireframe](./pitch-images/search-saved-list.png)
* Detailed Exercise
![Wireframe](./pitch-images/detailed-exercise.png)
* Similar Layout for Creating/Editing Workouts
![Wireframe](./pitch-images/log-workout.png)
* List of All Logged Workouts
![Wireframe](./pitch-images/workout-list.png)

## ERD
![ERD](./pitch-images/erd.png)

## RESTful Routes
![RESTful Routes Table](./pitch-images/RESTfulRoutes.png)

## API
* ExerciseDB
* Cloudinary

## Examples of API Data
API root = https://exercisedb.p.rapidapi.com/exercises/<:param>
* Body Part = bodyPart/{bodyPart}
     1. "back"
     2. "chest",
     3. "lower arms",
     4. "lower legs",
     5. "shoulders",
     6. "upper arms",
     7. "upper legs",
     8. "waist"
* API results:
```js
[
  {
    "bodyPart": "string",
    "equipment": "string",
    "id": "string",
    "name": "string",
    "target": "string",
    "gifUrl": "string"
  }
]
```

## MVP
* Welcome/home page that renders login/sign up
* User profile page that displays user's saved exercises and logged workouts
* User will be able to search for exercises based on body part
* User will be able to save an exercise and their saved exercise index/list will be categorized by muscle group
* User will be able to log completed workouts with details of:
     * date completed
     * duration of workout
     * type of workout
     * comments on workout

## Stretch Goals
* Create second CRUD allowing users to
     * create planned workouts
     * display all planned workouts
     * update planned workouts
     * mark planned workouts as complete and display on workout history
* Use a second API to call for inspirational fitness quotes
* Allow users to upload progress photos/photos from workout
* Styling

## Potential Roadblocks
* Narrowing down what to search by
* Adding on too many ideas/changing which idea I want to develop