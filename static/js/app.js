const hamburger = document.querySelector(".bi")
const menu = document.getElementById("hamburger-menu")

const openHamburger = () => {
  menu.classList.toggle("open")
}

hamburger.addEventListener("click", openHamburger)