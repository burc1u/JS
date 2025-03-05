"use strict"

const screenshotBtn = document.querySelector("#src-btn")
let screenshotPreview = document.querySelector(".src-preview")
let closeBtn = screenshotPreview.querySelector("#close-btn")

const captureScreen = async () => {
  //hide btn so it wont apear over screenshot
  screenshotBtn.classList.add("hide")
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      preferCurrentTab: true, //by default select the tab you are viewing
    })

    const video = document.createElement("video")
    video.addEventListener("loadedmetadata", () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      //canvas size = video size
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      //play so img is not black/blank
      video.play()
      //drawImg(video,x-coo,y-coo,width,height) draw the video into the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      //stop the screen recording
      stream.getVideoTracks()[0].stop()
      // document.body.appendChild(canvas) //append canvas to body
      //return img url
      screenshotPreview.querySelector("img").src = canvas.toDataURL()
      screenshotPreview.classList.add("show")
      screenshotBtn.classList.remove("hide")
    })

    video.srcObject = stream //pass the data stream as video source obj
  } catch (error) {
    alert("Failed to capture screenshot") //if from any resoan screenshot can not be performed
  }
}
closeBtn.addEventListener("click", () =>
  screenshotPreview.classList.toggle("show")
)
screenshotBtn.addEventListener("click", captureScreen)
