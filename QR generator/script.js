"use strict"

const wrapper = document.querySelector(".wrapper"),
  generateBtn = wrapper.querySelector(".form button"),
  qrInput = wrapper.querySelector(".form input"),
  qrimg = wrapper.querySelector(".qr-code img")

generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value
  if (!qrValue) return //if return is empty return

  generateBtn.innerText = "Generating QR code..."
  qrimg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}` //using QR api

  qrimg.addEventListener("load", () => {
    wrapper.classList.add("active")
    generateBtn.innerText = "Generate QR code"
  })

  wrapper.classList.add("active")
})

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value) {
    wrapper.classList.remove("active")
  }
})
