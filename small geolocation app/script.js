"use strict"

const btn = document.querySelector(".btn-country")
const countriesContainer = document.querySelector(".countries")
const country = "romania"
///////////////////////////////////////
// const getCountryData = function (country) {
//   const request = new XMLHttpRequest()
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`)
//   request.send()

//   request.addEventListener("load", function (e) {
//     const [data] = JSON.parse(this.responseText)
//     console.log(data)
//     //console.log(data.name.official)
//     // console.log(data.languages[0])
//     // console.log(Object.keys(data.languages)[0])
//     // console.log(Object.values(data.currencies)[0].name)
//     const html = ` <article class="country">
//     <img class="country__img" src="${data.flags.png}" />
//     <div class="country__data">
//       <h3 class="country__name">${data.name.official}</h3>
//       <h4 class="country__region">${data.region}</h4>
//       <p class="country__row"><span>👫</span>${(
//         +data.population / 1000000
//       ).toFixed(1)}</p>
//       <p class="country__row"><span>🗣️</span>${
//         Object.values(data.languages)[0]
//       }</p>
//       <p class="country__row"><span>💰</span>${
//         Object.values(data.currencies)[0].name
//       }</p>
//     </div>
//   </article>`
//     countriesContainer.insertAdjacentHTML("beforeend", html)
//     countriesContainer.style.opacity = 1
//   })
// }
// getCountryData("bulgaria")
// getCountryData("usa")

//(*)/////////////////////////////////////////////////////////////////////

const renderCountry = function (data, className = "") {
  //   console.log(data.flags.png)

  const html = ` <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.official}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(data.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>`

  countriesContainer.insertAdjacentHTML("beforeend", html)
  countriesContainer.style.opacity = 1
}

// const getCountryAndNeighbourData = function (country) {
//   //AJAX call current country
//   const request = new XMLHttpRequest()
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`)
//   request.send()

//   request.addEventListener("load", function (e) {
//     const [data] = JSON.parse(this.responseText)
//     console.log(data)
//     //render current country
//     renderCountry(data)

//     //render neighbours countries
//     //take only the first one, for all just use all arr
//     const [neighbour] = data.borders

//     if (!neighbour) return

//     //AJAX call neighbour country
//     const request2 = new XMLHttpRequest()
//     request2.open("GET", `https://restcountries.com/v3.1/alpha/${neighbour}`)
//     request2.send()
//     request2.addEventListener("load", function () {
//       const [data2] = JSON.parse(this.responseText)
//       console.log(data2)
//       //console.log(typeof data)
//       //console.log(typeof data2)

//       renderCountry(data2, "neighbour") //second parm not necessary
//     })
//   })
// }
// getCountryAndNeighbourData("romania")

//fetch method
// const request = fetch(`https://restcountries.com/v3.1/name/romania`)

const getJson = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`)

    return response.json()
  })
}

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg)
  //   countriesContainer.style.opacity = 1
}

// const getCountryData = function (country) {
//   //country1
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then((response) => {
//       if (!response.ok) throw new Error(`Country not found(${response.status})`)

//       return response.json()
//     })

//     .then((data) => {
//       renderCountry(data[0])
//       const neighbour = data[0].borders[0]
//       if (!neighbour) return
//       //country2

//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
//     })
//     .then((response) => {
//       if (!response.ok) throw new Error(`Country not found(${response.status})`)

//       return response.json()
//     })
//     .then((data) => renderCountry(data[0], "neighbour"))
//     .catch((err) => {
//       //catch err if internet connection is lost
//       alert(err)
//       renderError(`Something went wrong  ${err.message}. Try again! `)
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1
//     })
// }

// const getCountryData = function (country) {
//   //country1
//   getJson(`https://restcountries.com/v3.1/name/${country}`, "Country not found")
//     .then((data) => {
//       console.log(data)
//       renderCountry(data[0])
//       const neighbour = data[0].borders[0]
//       if (!neighbour) throw new Error("No neighbour found")
//       //country2

//       return getJson(
//         `https://restcountries.com/v3.1/alpha/${neighbour}`,
//         "Something went wrong"
//       )
//     })

//     .then((data) => renderCountry(data[0], "neighbour"))
//     .catch((err) => {
//       //catch err if internet connection is lost
//       alert(err)
//       renderError(`Something went wrong  ${err.message}. Try again! `)
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1
//     })
// }

// btn.addEventListener("click", function (e) {
//   getCountryData("romania")
// })

//(*)///////////////////////////////////////////
//reverse-geocode
//************************************************************** */
// const getPosition = function () {
//   return new Promise(function (resolve, reject) {
//     //navigator.geolocation.getCurrentPosition(
//     // position=>resolve(position),err=>reject(err)
//     // )
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//   })
// }
// // getPosition().then(pos=>console.log(pos))

// const whereAmI = function () {
//   getPosition()
//     .then((pos) => {
//       const { latitude: lat, longitude: lng } = pos.coords
//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
//       )
//     })
//     .then((res) => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`)
//       return res.json()
//     })
//     .then((data) => {
//       console.log(data)
//       console.log(data.city, data.countryName)
//       return fetch(`https://restcountries.com/v3.1/name/${data.countryName}`)
//     })
//     .then((res) => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`)
//       return res.json()
//     })
//     .then((data) => renderCountry(data[0]))
//     .catch((err) => console.log(err.message))
//     .finally(() => {
//       countriesContainer.style.opacity = 1
//     })
// }
// // whereAmI(30.50354, -1.12768)
// btn.addEventListener("click", whereAmI)

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    //navigator.geolocation.getCurrentPosition(
    // position=>resolve(position),err=>reject(err)
    // )
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

const whereAmI = async function () {
  //geolocation
  try {
    const pos = await getPosition()
    const { latitude: lat, longitude: lng } = pos.coords
    //reverse geocode

    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    )
    if (!resGeo.ok) throw new Error(`Problem getting location data`)
    const dataGeo = await resGeo.json()

    //country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
    )
    if (!res.ok) throw new Error(`Problem getting country`)
    const data = await res.json()

    renderCountry(data[0])
    console.log(data[0])
  } catch (err) {
    console.error(err)
    renderError(`Something went wrong ${err}`)
  }
}

whereAmI()
//todo promise for neighbour
const get3countries = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJson(`https://restcountries.com/v3.1/name/${c1}`)
    // const [data2] = await getJson(`https://restcountries.com/v3.1/name/${c2}`)
    // const [data3] = await getJson(`https://restcountries.com/v3.1/name/${c3}`)
    const data = await Promise.all([
      getJson(`https://restcountries.com/v3.1/name/${c1}`),
      getJson(`https://restcountries.com/v3.1/name/${c2}`),
      getJson(`https://restcountries.com/v3.1/name/${c3}`),
    ])
    console.log(data.map((d) => d[0].capital))
  } catch (err) {
    console.error(err)
  }
}
//promise.race