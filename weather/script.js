"use strict"
//api key need to make acc on api website to get one
const apiKey = "eda0352d70c0b4aceb10f6f78c249f59"
let api
const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherIcon = wrapper.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i")

inputField.addEventListener("keyup", (e) => {
  //if user prest enter and has writen stg
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value)
  }
})

locationBtn.addEventListener("click", () => {
  //geolocation api
  if (navigator.geolocation) {
    //if can get data onSuccess will run else onError
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  } else {
    alert("Can't get location from browser")
  }
})

function onError(error) {
  infoTxt.innerText = error.message
  infoTxt.classList.add("error")
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords //get lat and lon of the user from coords obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  fetchData()
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  fetchData()
}

function fetchData() {
  infoTxt.innerText = "Getting weather details... "
  infoTxt.classList.add("pending")

  /**
   **get api response parse it into js obj and call weatherDetails with api result as param
   */
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result))
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.classList.replace("pending", "error")
    infoTxt.innerText = `${inputField.value} isn't a valid city name`
  } else {
    //get properties from info obj
    const city = info.name
    const country = info.sys.country
    const { description, id } = info.weather[0]
    const { feels_like, humidity, temp } = info.main

    if (id === 800) {
      weatherIcon.src = "icons/clear.svg"
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "icons/storm.svg"
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "icons/snow.svg"
    } else if (id >= 701 && id <= 781) {
      weatherIcon.src = "icons/haze.svg"
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "icons/cloud.svg"
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "icons/rain.svg"
    }

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp)
    wrapper.querySelector(".weather").innerText = description
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`

    infoTxt.classList.remove("pending", "error")
    wrapper.classList.add("active")
    console.log(info)
  }
}
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active")
  inputField.value = ""
  // console.log(infoTxt.innerText)
  //console.log(inputField.value)
})
