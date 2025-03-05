"use strict"

// prettier-ignore

const form = document.querySelector(".form")
const containerWorkouts = document.querySelector(".workouts")
const inputType = document.querySelector(".form__input--type")
const inputDistance = document.querySelector(".form__input--distance")
const inputDuration = document.querySelector(".form__input--duration")
const inputCadence = document.querySelector(".form__input--cadence")
const inputElevation = document.querySelector(".form__input--elevation")
let map, mapEvent

class Workout {
  date = new Date()
  id = (Date.now() + "").slice(-10)
  clicks = 0

  constructor(coords, distance, duration) {
    this.coords = coords //[lat,lng]
    this.distance = distance
    this.duration = duration
  }

  click() {
    this.clicks++
  }

  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = "running"
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration)
    this.cadence = cadence
    this.calcPace()
    this._setDescription()
  }
  calcPace() {
    this.pace = this.duration / this.distance
    return this.pace
  }
}

class Cycling extends Workout {
  type = "cycling"
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration)
    this.elevation = elevation
    this.calcSpeed()
    this._setDescription()
  }
  calcSpeed() {
    this.speed = this.distance / this.duration / 60
    return this.speed
  }
}

/////////////////////////////////////
//app arch
class App {
  #mapZoom = 13
  #map
  #mapEvent
  #workouts = []
  constructor() {
    this._getPosition()

    //get data from local storage
    this._getLocalStorage()

    form.addEventListener("submit", this._newWorkout.bind(this))

    inputType.addEventListener("change", this._toggleElevField)
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this))
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("can not get location")
      }
    )
  }

  _loadMap(position) {
    const { latitude } = position.coords
    const { longitude } = position.coords
    const coords = [latitude, longitude]
    //second parameter is zoom
    this.#map = L.map("map").setView(coords, this.#mapZoom)

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map)

    ///////////////////////////////////////////////////////////

    this.#map.on("click", this._showForm.bind(this))
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work)
    })
  }

  _showForm(mapE) {
    this.#mapEvent = mapE
    form.classList.remove("hidden")
    inputDistance.focus()
  }

  _hideForm() {
    //empty input
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        ""
    form.style.display = "none"
    form.classList.add("hidden")
    setTimeout(() => (form.style.display = "grid"), 1000)
  }

  //set local storage

  _toggleElevField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
  }

  _newWorkout(e) {
    const validInput = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp))
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0)
    e.preventDefault()

    const type = inputType.value
    const distance = +inputDistance.value //+for convert to int
    const duration = +inputDuration.value
    const { lat, lng } = this.#mapEvent.latlng
    let workout

    //if workout is running create running obj

    if (type === "running") {
      const cadence = +inputCadence.value
      //data validation
      if (
        //* !Number.isFinite(distance) ||
        //* !Number.isFinite(duration) ||
        //* !Number.isFinite(cadence)
        !validInput(distance, cadence, duration) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Input need to be a number")

      workout = new Running([lat, lng], distance, duration, cadence)
    }

    ///////////////////////////////////////////
    //if workout is cycling create cyc obj

    if (type === "cycling") {
      const elevation = +inputElevation.value
      //elevation can be negative
      if (
        !validInput(distance, elevation, duration) ||
        !allPositive(distance, duration)
      )
        return alert("Input need to be a number")
      workout = new Cycling([lat, lng], distance, duration, elevation)
    }
    //add workout
    this.#workouts.push(workout)

    // *Display marker
    //get coord of click and set the marker
    this._renderWorkoutMarker(workout)
    //render workout list
    this._renderWorkout(workout)
    //clear input field and hide form
    this._hideForm()
    //set local storage
    this._setLocalStorage()
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup()
  }
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
          <span class="workout__icon">${
            workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
      </div>
    <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
    </div> `

    if (workout.type === "running") {
      html += `
       <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadence}</span>
      <span class="workout__unit">spm</span>
    </div>
  </li>`
    }
    if (workout.type === "cycling") {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevation}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`
    }

    form.insertAdjacentHTML("afterend", html)
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout")
    if (!workoutEl) return

    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    )
    //leaflet method
    this.#map.setView(workout.coords, this.#mapZoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    })
    // this.click()
  }

  _setLocalStorage() {
    //set all workouts to local storage
    //JSON.stringify convert any obj to string
    localStorage.setItem("workouts", JSON.stringify(this.#workouts))
  }
  _getLocalStorage() {
    //convert from string to obj
    const data = JSON.parse(localStorage.getItem("workouts"))
    if (!data) return

    this.#workouts = data
    this.#workouts.forEach((work) => {
      this._renderWorkout(work)
    })
  }

  reset() {
    localStorage.removeItem("workouts")
    location.reload()
  }
}

const app = new App()
//! implement delete marker
