
// stepOneBtn.addEventListener('click', () => {
//     stepOne.style.display = 'none'
//     buildContainer.style.display = 'block'
// })

// let addedArr = []
// const exerciseList = document.getElementById('exerciseList')

// const addSavedExercise = () => {
//     // reset inner text so loop won't overlap
//     exerciseList.innerText = ''
//     // find the exercise name based on the input value
//     let nameValue = document.getElementById('nameValue')
//     console.log('this is the name\n', nameValue.value)
//     // push the name into the array
//     addedArr.push(nameValue.value)
//     console.log('this is the addedArr\n', addedArr)
//     // create an ordered list
//     const olAdded = document.createElement('ol')
//     // loop through the array
//     for (let i = 0; i < addedArr.length; i++) {
//         // and give each exercise a list element
//         const liExercise = document.createElement('li')
//         // display each exercise name
//         liExercise.textContent = addedArr[i]
//         // append each exercise li to the ol
//         olAdded.appendChild(liExercise)
//     }
//     // display the ordered list of added exercises
//     exerciseList.appendChild(olAdded)
// }

// // add an event listener to each add to workout button
// document.querySelectorAll('.addBtn').forEach(addBtn => {
//     addBtn.addEventListener('click', addSavedExercise, {
//         once: true
//     })
// })

let addedArr = []
const exerciseList = document.getElementById('exerciseList')

const addSavedExercise = () => {
    // reset inner text so loop won't overlap
    exerciseList.innerText = ''
    // find the exercise name based on the input value
    let nameValue = document.getElementById('nameValue')
    console.log('this is the name\n', nameValue.value)
    // push the name into the array
    addedArr.push(nameValue.value)
    console.log('this is the addedArr\n', addedArr)
    // create an ordered list
    const olAdded = document.createElement('ol')
    // loop through the array
    addedArr.forEach((added) => {
        // and give each exercise a list element
        const liExercise = document.createElement('li')
        // display each exercise name
        liExercise.textContent = added
        // append each exercise li to the ol
        olAdded.appendChild(liExercise)
    })
    // display the ordered list of added exercises
    exerciseList.appendChild(olAdded)
}

// add an event listener to each add to workout button
document.querySelectorAll('.addBtn').forEach(addBtn => {
    addBtn.addEventListener('click', addSavedExercise, {
        once: true
    })
})