"use strict"

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal")
const overlay = document.querySelector(".overlay")
const btnCloseModal = document.querySelector(".btn--close-modal")
const btnsOpenModal = document.querySelectorAll(".btn--show-modal")
const btnScrollto = document.querySelector(".btn--scroll-to")
const section1 = document.querySelector("#section--1")
const nav = document.querySelector(".nav")
const tabs = document.querySelectorAll(".operations__tab")
const tabsContainer = document.querySelector(".operations__tab-container")
const tabsContent = document.querySelectorAll(".operations__content")

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove("hidden")
  overlay.classList.remove("hidden")
}

const closeModal = function () {
  modal.classList.add("hidden")
  overlay.classList.add("hidden")
}
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal))

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal)

btnCloseModal.addEventListener("click", closeModal)
overlay.addEventListener("click", closeModal)

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal()
  }
})
//*btn scroll

btnScrollto.addEventListener("click", function () {
  //get btn coo
  const s1coords = section1.getBoundingClientRect()
  console.log(s1coords)

  section1.scrollIntoView({ behavior: "smooth" })
})

//navigation
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault()
//     const id = this.getAttribute("href")
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" })
//   })
// })

//*event delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault()
  //select only the links
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href")
    document.querySelector(id).scrollIntoView({ behavior: "smooth" })
  }
})

//*tabbed

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab")
  //guard clause
  if (!clicked) return
  //remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"))
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"))

  //activate tab
  clicked.classList.add("operations__tab--active")
  //activate content are
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active")
})

//*menu fade animation
const handleHover = function (e) {
  // console.log(this)
  if (e.target.classList.contains("nav__link")) {
    const link = e.target

    const siblings = link.closest(".nav").querySelectorAll(".nav__link")
    const logo = link.closest(".nav").querySelector("img")
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this
    })

    logo.style.opacity = this
    // console.log(Number(logo.style.opacity))
  }
}

nav.addEventListener("mouseover", handleHover.bind(0.5))

nav.addEventListener("mouseout", handleHover.bind(1))
//////////////////////////////////////////////////////////////////////
//sticky nav
//use scroll not efficient
// const initialCoords = section1.getBoundingClientRect()
// window.addEventListener("scroll", function (e) {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky")
//   } else {
//     nav.classList.remove("sticky")
//   }
// })
//////////////////////////////////////////////////////////////////////

//*sticky with intersection obs api
//
const header = document.querySelector(".header")
const navheight = nav.getBoundingClientRect()
const stickyNav = function (entries) {
  //destructuring
  //same as entries[0]
  const [entry] = entries
  if (!entry.isIntersecting) nav.classList.add("sticky")
  else nav.classList.remove("sticky")
}

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  //null for all viewport
  threshold: 0,

  //basically add a box of 90px around nav
  //means it activates 90px before threshold is reached
  rootMargin: "-90px",
  /*
  !rootMargin: `-${navheight}px` WHY WONT WORK
  !not the same as direct variable
  */
})

headerObs.observe(header)

//*reveal sections
const allSec = document.querySelectorAll(".section")

const revealSec = function (entries, observer) {
  const [entry] = entries

  if (!entry.isIntersecting) return

  entry.target.classList.remove("section--hidden")
  observer.unobserve(entry.target)
}

const sectionObs = new IntersectionObserver(revealSec, {
  root: null,
  threshold: 0.15,
})

allSec.forEach(function (section) {
  sectionObs.observe(section)
  section.classList.add("section--hidden")
})

//lazy loading img
//select all img with data src property
const imgTargets = document.querySelectorAll("img[data-src]")
const loadImg = function (entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src //replace src with dataset src
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img") //when img has loaded then swap src
  })
  observer.unobserve(entry.target)
}
const imgObs = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
})

imgTargets.forEach((img) => imgObs.observe(img))

//*Slider
//(*) to not pollute namespace
const slider = function () {
  let curSlide = 0
  const slides = document.querySelectorAll(".slide")
  const slider = document.querySelector(".slider")
  const btnLeft = document.querySelector(".slider__btn--left")
  const btnRight = document.querySelector(".slider__btn--right")
  const maxSlides = slides.length
  const dotContainer = document.querySelector(".dots")
  //training again
  // slider.style.transform = "translateX(50%)"
  // slider.style.transform = "scale(0.2)"
  // slider.style.overflow = "visible"

  const createDots = function () {
    slides.forEach(function (_, i) {
      //create more buttons in the empty container
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  }

  const activateDots = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"))
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active")
  }

  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    )
  }

  // slides.forEach(
  //   (s, index) => (s.style.transform = `translateX(${100 * index}%)`)
  // )
  //0% 100% 200%....

  //*next slide
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) {
      curSlide = 0
    } else {
      curSlide++
    }
    goToSlide(curSlide)
    activateDots(curSlide)
  }

  //*prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides - 1
    }
    curSlide--

    goToSlide(curSlide)
    activateDots(curSlide)
  }

  //(*)INIT function
  const init = function () {
    goToSlide(0)
    createDots()

    activateDots(0)
  }
  init()

  //*events
  btnRight.addEventListener("click", nextSlide)
  btnLeft.addEventListener("click", prevSlide)
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide()
  })

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset
      goToSlide(slide)
      activateDots(slide)
    }
  })
}
slider()
//curSlide=1 -100% 0% 100% 200%....
//////////////////////////////////////////////////////////////////////
///training//////////////////////////////////////////
// message = document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function () {
//     message.remove
//   })

// message.style.backgroundColor = "#37383d"
// message.style.width = "120%"
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px"

//old way scroll
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: "smooth",
// })

//sticky with intersection obs api
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entries)
//   })
// }
// const obsOptions = {
//   //root aka target element
//   //null for all viewport
//   root: null,
//   threshold: [0, 0.2],
//   //target intersect viewport when it enters and it leaves
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)
