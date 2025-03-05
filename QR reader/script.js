"use strict"

const wrapper = document.querySelector(".wrapper"),
  form = wrapper.querySelector("form"),
  fileInp = form.querySelector("input"),
  infoText = form.querySelector("p"),
  txtArea = wrapper.querySelector("textarea"),
  formImg = form.querySelector("img"),
  copyBtn = wrapper.querySelector(".copy"),
  closeBtn = wrapper.querySelector(".close")

function fetchRequest(formData, file) {
  infoText.innerText = "Scanning QR Code"
  //sending post request to api with passing
  //form data as body and getting respone from it
  fetch("http://api.qrserver.com/v1/read-qr-code/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      result = result[0].symbol[0].data
      infoText.innerText = result ? "Upload QR Code" : "Couldn't Scan QR Code"
      if (!result) return
      txtArea.innerText = result
      formImg.src = URL.createObjectURL(file)
      wrapper.classList.add("active")
      //console.log(result)
    })
    .catch(() => {
      infoText.innerText = "Couldn't Scan QR Code"
    })
}

fileInp.addEventListener("change", (e) => {
  let file = e.target.files[0] //getting selected file
  if (!file) return
  let formData = new FormData()
  formData.append("file", file) //add selected file to FormData
  fetchRequest(formData, file)
})

copyBtn.addEventListener("click", () => {
  let text = txtArea.textContent
  //write txt into system clipboard
  navigator.clipboard.writeText(text)
})

closeBtn.addEventListener("click", () => wrapper.classList.remove("active"))

form.addEventListener("click", () => fileInp.click())
