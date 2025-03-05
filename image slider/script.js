"use strict"
const carousel = document.querySelector(".carousel")
let firstImg = carousel.querySelectorAll("img")[0]
let arrowIcons = document.querySelectorAll(".wrapper i")

let isDragStart = false,
  prevPageX,
  prevScrollLeft,
  positionDiff,
  isDraggin = false

const showHideIcons = () => {
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth
  arrowIcons[0].style.display = carousel.scrollLeft === 0 ? "none" : "block" //if scroll left is 0 hide icon else show it
  arrowIcons[1].style.display =
    carousel.scrollLeft === scrollWidth ? "none" : "block"
}
arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14 //get first img width +14 margin
    // console.log(firstImg.clientWidth)
    carousel.scrollLeft += icon.id === "left" ? -firstImgWidth : firstImgWidth
    setTimeout(() => showHideIcons(), 60)
  })
})

const dragStart = (e) => {
  isDragStart = true
  prevPageX = e.pageX || e.touches[0].pageX
  prevScrollLeft = carousel.scrollLeft
}

const autoSlide = () => {
  //if no img is left to scroll
  if (
    carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 ||
    carousel.scrollLeft <= 0
  )
    return

  positionDiff = Math.abs(positionDiff)
  let firstImgWidth = firstImg.clientWidth + 14
  let ValDifference = firstImgWidth - positionDiff //value to scroll for middle img slide

  if (carousel.scrollLeft > prevScrollLeft) {
    //if user scroll more than 33%of img autoscroll to next img
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? ValDifference : -positionDiff) //if user scroll left
  }
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? ValDifference : -positionDiff //if user scroll right
}

const dragStop = () => {
  isDragStart = false
  carousel.classList.remove("dragging")
  if (!isDraggin) return
  isDraggin = false
  autoSlide()
}
//scrollLeft set or return the nb of pixels scrolled horizontally
//pageX horizontal mouse position
const dragging = (e) => {
  if (!isDragStart) return
  e.preventDefault() //wont let img being dragged
  isDraggin = true
  carousel.classList.add("dragging")
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX
  carousel.scrollLeft = prevScrollLeft - positionDiff
  showHideIcons()
}

carousel.addEventListener("mousedown", dragStart)
carousel.addEventListener("touchstart", dragStart)

carousel.addEventListener("mousemove", dragging)
carousel.addEventListener("touchmove", dragging)

carousel.addEventListener("mouseup", dragStop)
carousel.addEventListener("mouseleave", dragStop)
carousel.addEventListener("touchend", dragStop)
