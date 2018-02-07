/* global alert, FileReader, Image, URL */

let canvasBlob

function loadImage () { // eslint-disable-line no-unused-vars
  var input, file, fr, img

  if (typeof window.FileReader !== 'function') {
    alert('The file API isn\'t supported on this browser yet.')
    return
  }

  input = document.getElementById('imgfile')
  if (!input) {
    alert('Um, couldnt find the imgfile element.')
  } else if (!input.files) {
    alert('This browser doesn\'t seem to support the `files` property of file inputs.')
  } else if (!input.files[0]) {
  } else {
    file = input.files[0]
    fr = new FileReader()
    fr.onload = createImage
    fr.readAsDataURL(file)
  }

  function createImage () {
    img = new Image()
    img.onload = imageLoaded
    img.src = fr.result
  }

  function imageLoaded () {
    var canvas = document.getElementById('canvas')
    canvas.width = 500
    canvas.height = 500
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (img.width > img.height) ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.width / img.width * img.height)
    else if (img.width < img.height) ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height / img.height * img.width, canvas.height)
    else ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
    ctx.font = `bold ${Math.min(canvas.width / img.width * img.height, 500) / 25}px Inconsolata`
    ctx.globalCompositeOperation = 'difference'
    ctx.fillStyle = 'rgba(255, 255, 255, .70)'
    ctx.fillText((document.getElementById('text').value === '') ? 'PKMNGOTS' : document.getElementById('text').value, Math.min(canvas.width / img.width * img.height, 500) / 100, Math.min(canvas.width / img.width * img.height, 500) / 25)
    let hidden = document.getElementById('hidden')
    hidden.width = img.width
    hidden.height = img.height
    var hiddenCtx = hidden.getContext('2d')
    hiddenCtx.font = `bold ${img.height / 25}px Inconsolata`
    hiddenCtx.globalCompositeOperation = 'difference'
    hiddenCtx.fillStyle = 'rgba(255, 255, 255, .70)'
    hiddenCtx.fillText('PKMNGOTS', img.height / 100, img.height / 25)
    hiddenCtx.drawImage(img, 0, 0, img.width, img.height)
    hidden.toBlob((blob) => {
      canvasBlob = blob
    })
  }
}

document.getElementById('text').addEventListener('input', () => {
  loadImage()
})

function downloadCanvas (link, canvasId, filename) {
  link.href = URL.createObjectURL(canvasBlob)
  link.download = filename
}

document.getElementById('download').addEventListener('click', function () {
  downloadCanvas(this, 'hidden', document.getElementById('imgfile').files[0].name.replace(/\.[^/.]+$/, '') + '-marked.png')
}, false)
