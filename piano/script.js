"use stric"

const piaboKeys = document.querySelectorAll(".piano-keys .key")
volumeSlider = document.querySelector(".volume-slider input")
keysCheckBox = document.querySelector(".keys-checkbox input")

let allKeys = [],
  audio = new Audio("tunes/a.wav") //create html audio element, by default audio src is "a" tune

const playTune = (key) => {
  audio.src = `tunes/${key}.wav` //matching tune with keys
  audio.play()

  const clickedKey = document.querySelector(`[data-key="${key}"]`)
  clickedKey.classList.add("active") //activate the "active class" aka shadow the pressed key

  setTimeout(() => {
    clickedKey.classList.remove("active")
  }, 150) //remove the class after 150ms
}

piaboKeys.forEach((key) => {
  allKeys.push(key.dataset.key)
  key.addEventListener("click", () => playTune(key.dataset.key)) //aka the letter on the key
})

const pressedKey = (e) => {
  if (allKeys.includes(e.key))
    //call function play only if key is in array aka key exists
    playTune(e.key) //play the tune mathcing the pressed key
}

const handleVolume = (e) => {
  audio.volume = e.target.value //the slider value is set as volume value
}

const showhideKeys = () => {
  piaboKeys.forEach((key) => key.classList.toggle("hide")) //toggle hide class for each key
}

volumeSlider.addEventListener("input", handleVolume)
document.addEventListener("keydown", pressedKey)
keysCheckBox.addEventListener("click", showhideKeys)
