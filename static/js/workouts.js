const addedArr = []
let exerciseList = document.getElementById('exerciseList')
const addSavedExercise = () => {
    exerciseList.innerText = ''
    let nameValue = document.getElementById('nameValue')
    console.log('this is the name\n', nameValue.value)
    addedArr.push(nameValue.value)
    console.log('this is the addedArr\n', addedArr)
    const olAdded = document.createElement('ol')
    for (let i = 0; i < addedArr.length; i++) {
        const liExercise = document.createElement('li')
        liExercise.textContent = addedArr[i]
        olAdded.appendChild(liExercise)
    }
    exerciseList.appendChild(olAdded)
}

document.querySelectorAll('.addBtn').forEach(addBtn => {
    addBtn.addEventListener('click', addSavedExercise, {
        once: true
    })
})