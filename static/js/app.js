const hamburger = document.querySelector(".bi")
const closeBtn = document.querySelector(".close-btn")
const menu = document.getElementById("hamburger-menu")

const openHamburger = () => {
  menu.classList.toggle("open")
}

hamburger.addEventListener("click", openHamburger)
closeBtn.addEventListener("click", closeHamburger)