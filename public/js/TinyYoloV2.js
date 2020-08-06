const inputSize = 224
const scoreThreshold = 0.2
let kernel2 = 2
let kernel8 = 8
let kernel11 = 11

function getFaceDetectorOptions() {
  return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

function onIncrease1() {
  kernel2 = Math.min(faceapi.utils.round(kernel2 + 1), 15)
  $('#kernel2').val(kernel2)
  updateResults()
}

function onDecrease1() {
  kernel2 = Math.max(faceapi.utils.round(kernel2 - 1), 0)
  $('#kernel2').val(kernel2)
  updateResults()
}

function onIncrease2() {
  kernel8 = Math.min(faceapi.utils.round(kernel8 + 1), 15)
  $('#kernel8').val(kernel8)
  updateResults()
}

function onDecrease2() {
  kernel8 = Math.max(faceapi.utils.round(kernel8 - 1), 0)
  $('#kernel8').val(kernel8)
  updateResults()
}

function onIncrease3() {
  kernel11 = Math.min(faceapi.utils.round(kernel11 + 1), 15)
  $('#kernel11').val(kernel11)
  updateResults()
}

function onDecrease3() {
  kernel11 = Math.max(faceapi.utils.round(kernel11 - 1), 0)
  $('#kernel11').val(kernel11)
  updateResults()
}

function getCurrentFaceDetectionNet() {
  return faceapi.nets.tinyFaceDetector
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

async function loadFaceDetector() {
  $('#loader').show()
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('weights')
  }
  $('#loader').hide()
}