const addSavedExercise = () => {
    exerciseList.innerText = 'hello'
}

document.querySelectorAll('.addBtn').forEach(addBtn => addBtn.addEventListener('click', addSavedExercise))

// document.getElementsByClassName('addBtn').addEventListener('click', addSavedExercise, {
//     once: true
// })
