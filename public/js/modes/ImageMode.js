const normal_threshold = 0.2;
const reduced_threshold = 0.01;
class ImageMode extends Mode {
  constructor(options) {
    super(options);

    this._cropModal = new CropModal(document.getElementById('body'), this._options.imageWidth, this._options.imageHeight, {
      onClose: (url) => { this._onCropModalClose(url); }
    });

    this._slideOut = null;
    this._imagePicker = null;
    this._removeBtn = null;
  }

  async setup(parent) {
    let w = this._options.imageWidth;
    let h = this._options.imageHeight;

    let uploadControlDiv = $(`<div></div>`).appendTo(parent);
    this._imageUploadInput = $(`<input accept="image/*" class="form-control" type="file" style="display: none;">`).appendTo(uploadControlDiv).get(0);
    this._imageUploadInput.addEventListener('change', () => { this._imageInputChanged() });

    this._slideOut = new SlideOut(document.getElementById('body'));
    this._imagePicker = new ImagePicker((select) => { this._onImagePickerClose(select); });
    this._imagePicker.setup(this._slideOut.root());

    let buttonAdd = $(`<a href="#!" class="waves-effect waves-light btn blue" style="margin-right: 10px;">Add New Image</a>`).appendTo(this._slideOut.root());
    buttonAdd.get(0).addEventListener('click', () => { this._imageUploadInput.click() });


    //add remove image button
    let buttonRemove = $(`<a href="#!" class="waves-effect waves-light btn blue" style="margin-right: 10px;">Remove</a>`).appendTo(this._slideOut.root());
    buttonRemove.get(0).addEventListener('click', () => { this._onRemoveImage() });
    self._removeBtn = buttonRemove;
    $(`<br> </br>`).appendTo(this._slideOut.root())

    //add clear all images button
    let buttonClear = $(`<a href="#!" class="waves-effect waves-light btn red" style="margin-right: 10px;">Remove All</a>`).appendTo(this._slideOut.root());
    buttonClear.get(0).addEventListener('click', () => { this._onClearImage() });

    //add reset default images button
    let buttonDefault = $(`<a href="#!" class="waves-effect waves-light btn red" style="margin-right: 10px;">Reset to Default</a>`).appendTo(this._slideOut.root());
    buttonDefault.get(0).addEventListener('click', () => { this._onDefaultImages() });
    $(`<br> </br>`).appendTo(this._slideOut.root())

    let buttonClose = $(`<a href="#!" class="waves-effect waves-light btn blue" style="margin-right: 10px;">Close</a>`).appendTo(this._slideOut.root());
    buttonClose.get(0).addEventListener('click', () => { this._slideOut.close(); });

    let masterColumn = $(`<div class="column center-content""></div>`).appendTo(parent);

    let row = $(`<div class="row side-by-side" style="position: relative; margin-bottom: 0px; align-items: start;"></div>`).appendTo(masterColumn);

    let echoAndMaxPoolingDiv = $(`<div class="column center-content"></div>`).appendTo(row);

    this._parentEcho = $(`<div"></div>`).appendTo(echoAndMaxPoolingDiv).get(0);
    this._parentHorizontalOutput = $(`<div class="green-bg"></div>`).appendTo(echoAndMaxPoolingDiv).get(0);

    let convoDiv = $(`<div class="margin-sm"></div>`).appendTo(row);
    this._parentConvolution1 = convoDiv.get(0);

    this._videoElements = [];
    this._imageElements = [];

    let div = $(`<div class="row side-by-side no-margin"></div>`).appendTo(this._parentEcho);

    let holder1 = $(`<div style="position: relative" class="margin-sm"></div>`).appendTo(div);
    let video = $(`<video class="video video-stream" width=${w}" height="${h}" autoplay muted playsinline></video>`).appendTo(holder1);
    this._video = video.get(0);
    this._videoManuallyPaused = false;
    this._video.addEventListener('pause', () => {
      if (!this._videoManuallyPaused) {
        this._video.play()
      }
    })
    this._videoElements.push(this._video);
    this._video.srcObject = null; // will be set later

    this._image = $(`<img width=${w} height=${h}></img>`).appendTo(holder1).get(0); // src will be set later
    this._imageElements.push(this._image);

    let overlay = $(`<canvas class="overlay" width=${w} height=${h}/>`).appendTo(holder1);
    let controlsHolder = $(`<div class="overlay column center-contents"></div>`).appendTo(holder1);
    let buttonSwitchToVideo = $('<a class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Switch to Video" style="margin-bottom: 2px;"><i class="material-icons">videocam</i></a>').appendTo(controlsHolder);
    buttonSwitchToVideo.get(0).addEventListener('click', () => { this._setFeed(0) });
    this._imageElements.push(buttonSwitchToVideo.get(0));

    this._captureImageCanvas = $(`<canvas width=${w} height=${h} style="display: none;"/>`).appendTo(controlsHolder).get(0);
    let buttonToggle = $(`<a data-playing="true" style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Pause/Resume Video"></a>`).appendTo(controlsHolder);
    this._buttonToggleVideo = buttonToggle.get(0);
    this._videoElements.push(this._buttonToggleVideo);
    this._buttonToggleVideo.addEventListener('click', () => { this._toggleVideo() });
    this._buttonToggleVideoIcon = $(`<i class="material-icons">pause</i>`).appendTo(buttonToggle).get(0);
    let buttonCapture = $(`<a style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Capture Image"><i class="material-icons">camera_alt</i></a>`).appendTo(controlsHolder);
    this._videoElements.push(buttonCapture.get(0));
    buttonCapture.get(0).addEventListener('click', () => { this._captureImage() });

    let buttonLib = $('<a style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Image Library" style="margin-bottom: 2px;"><i class="material-icons">photo_library</i></a>').appendTo(controlsHolder);
    // let buttonLib = $('#buttonLib');
    buttonLib.get(0).addEventListener('click', () => { this._slideOut.open() });

    let buttonAddInline = $('<a style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Add Image" style="margin-bottom: 2px;"><i class="material-icons">file_upload</i></a>').appendTo(controlsHolder);
    buttonAddInline.get(0).addEventListener('click', () => { this._imageUploadInput.click() });

    this.buttonToggleThreshold = $('<a style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Decrease detector threshold" style="margin-bottom: 2px;"><i id="icon" class="material-icons">remove</i></a>').appendTo(controlsHolder);
    this.buttonToggleThreshold.get(0).addEventListener('click', () => {
      this._toggleThreshold()
    })

    this._parentResultOutput = $(`<div></div>`).appendTo(div).get(0);

    let resultOutput = new ResultOutput(this._parentResultOutput, overlay.get(0));
    await resultOutput.setup();
    this.addOutput(resultOutput);

    let convolutionOutput = new ConvolutionLayer1Output(this._parentConvolution1);
    await convolutionOutput.setup();
    this.addOutput(convolutionOutput);

    this._horizontalOutput = null;
    //let initialHorizontalOutputLayer = 4;

    let horizontalTitleAndControls = $(`<div class="title-and-dropdown row side-by-side no-margin"></div>`).appendTo(this._parentHorizontalOutput).get(0);
    $(`<h5 style="text-align: center; margin-top: -4px;">Max-Pooling Layer</h5>`).appendTo(horizontalTitleAndControls);

    let layer_options = [
      { value: 3, name: '3' },
      { value: 4, name: '4', selected: true },
      { value: 5, name: '5' },
//      { value: 6, name: '6' }
    ];
    this._hozizontalOutputSelect = App.setupSelect(horizontalTitleAndControls, 50, null, null, layer_options);

    this._hozizontalOutputSelect.addEventListener('change', () => { this._onHorizontalOutputSelectChange(); })

    this._autoScaleButton = $(`<a href="#!" class="waves-effect waves-green btn-flat btn">Auto-scaling</a>`).appendTo(horizontalTitleAndControls).get(0);

    this._horizontalOutputBody = $(`<div></div>`).appendTo(this._parentHorizontalOutput).get(0);
    this._onHorizontalOutputSelectChange(); // simulate the firing of the event for initial set up

    this._setFeed(0); // video

    $('.tooltipped').tooltip();
    this._onImageSelectChange();
  }

  clear() {
    this._closeVideo();
    super.clear();
  }

  // private
  _onHorizontalOutputSelectChange() {
    let layer = parseInt(this._hozizontalOutputSelect.value);
      this._setupHorizontalLayerOutput(layer, this._autoScaleButton);
  }

  async _setupHorizontalLayerOutput(layer, autoScaleButton) {
    if (this._horizontalOutput) {
      this._horizontalOutput.clear();
      this.removeOutput(this._horizontalOutput);
      $(this._horizontalOutputBody).empty();
    }

    let w = this._options.imageWidth;
    let h = this._options.imageHeight;

    this._horizontalOutput = new HorizontalLayerOutput(this._horizontalOutputBody, layer, w, h, autoScaleButton);
    await this._horizontalOutput.setup();
    if (this._feed) {
      this._horizontalOutput.setFeed(this._feed);
    }
    this.addOutput(this._horizontalOutput);
  }

  _closeVideo() {
    // close video stream, if open
    let stream = this._video.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    }
  }

  async _setFeed(index) {
    if (index == 0) {
      // video
      
      this._videoElements.forEach((el) => { el.style.display = "block"; });
      this._imageElements.forEach((el) => { el.style.display = "none"; });

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: this._options.imageWidth, height: this._options.imageHeight } })
      } catch (e) {
        console.log(e);
        console.log("Unable to setup video stream");
        return;
      }
      this._video.srcObject = stream;

      this._feed = this._video;
      this._outputs.forEach((o) => { o.setFeed(this._video); });
      this._image.src = null;
    } else {
      // image

      this._videoElements.forEach((el) => { el.style.display = "none"; });
      this._imageElements.forEach((el) => { el.style.display = "block"; });

      let url = app.imageLibrary().imagePath(index);
      this._image.onload = () => {
        this._feed = this._image;
        this._outputs.forEach((o) => {
          o.setFeed(this._image);
          this._video.srcObject = null;
        });
      }

      this._image.src = url;
      this._closeVideo();
    }
    const ulElement = document.querySelector('.image_picker_selector');
    ulElement.addEventListener('click', () => {
      this._onImageSelectChange();
    });
  }

  _onImagePickerClose(select) {
    this._slideOut.close();
    this._setFeed(select.value());
  }

  _onRemoveImage() {
    var elementsToRemove = document.querySelectorAll(".thumbnail.selected")
    if(elementsToRemove.length > 0) {
      for(var i=0; i<elementsToRemove.length; i++) {
        var element = elementsToRemove[i];
        element.parentNode.removeChild(element);
      }
    }
    this._onImageSelectChange();
  }

  _onClearImage() {
    app.imageLibrary().clearImages()
    this._imagePicker.initialize(app.imageLibrary().nImages() - 1)
    // this._setFeed(app.imageLibrary().nImages() - 1)
    this._setFeed(0)
    console.log("clearing image")
  }

  _onDefaultImages() {
    app.imageLibrary().resetDefaultImages()
    //this._imagePicker.initialize(app.imageLibrary().nImages() - 1);
    this._imagePicker.initialize(0);
    // this._setFeed(app.imageLibrary().nImages() - 1);
    this._setFeed(0);
    console.log("setting images to default")
  }

  _onCropModalClose(url) {
    if (!url) {
      this._setFeed(0);
    } else {
      app.imageLibrary().add("Uploaded image", url);
      this._imagePicker.initialize(app.imageLibrary().nImages() - 1);
      this._setFeed(app.imageLibrary().nImages() - 1);
      this._slideOut.close();
    }
  }

  _captureImage() {
    this._captureImageCanvas.getContext('2d').drawImage(this._video, 0, 0, this._captureImageCanvas.width, this._captureImageCanvas.height);
    const url = this._captureImageCanvas.toDataURL();
    this._cropModal.open(url);
  }

  _imageInputChanged() {
    const [file] = this._imageUploadInput.files
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);
    this._cropModal.open(url);
  }

  _toggleVideo() {
    let icon = $(this._buttonToggleVideoIcon);

    if ($(this._buttonToggleVideo).attr("data-playing") == "true") {
      this._videoManuallyPaused = true;
      this._video.pause();
      $(this._buttonToggleVideo).attr("data-playing", "false");
      icon.html("play_arrow");
    } else {
      this._videoManuallyPaused = false;
      this._video.play();
      $(this._buttonToggleVideo).attr("data-playing", "true");
      icon.html("pause");
    }
  }

  _onImageSelectChange() {
    var selected = document.querySelectorAll(".thumbnail.selected")
    let shouldDisableRemove = false;
    if(selected.length > 0) {
      for(var i=0; i<selected.length; i++) {
        var element = selected[i];
        if(element.parentNode.classList.contains("first")) {
          shouldDisableRemove = true;
          break;
        }
      }
    }
    else
      shouldDisableRemove = true;

    //self._removeBtn.get(0).style.display = shouldDisableRemove? "none" : "";
    if(shouldDisableRemove)
    {
      if(!self._removeBtn.get(0).classList.contains("disabled"))
        self._removeBtn.get(0).classList.add("disabled");
    }
    else
      self._removeBtn.get(0).classList.remove("disabled");
  }

  _toggleThreshold() {
    var icon = document.getElementById('icon')
    if (window.detector_threshold==0.01) { //currently lowered threshold value
      window.detector_threshold = normal_threshold
      console.log("increased threshold to " + window.detector_threshold)
      this.buttonToggleThreshold[0].classList.remove('red')
      this.buttonToggleThreshold[0].classList.add('blue')
      icon.textContent = "remove"
      this.buttonToggleThreshold[0].dataset.tooltip = "Decrease detector threshold"
    } else {
      window.detector_threshold = reduced_threshold
      console.log("decreased threshold to " + window.detector_threshold)
      this.buttonToggleThreshold[0].classList.remove('blue')
      this.buttonToggleThreshold[0].classList.add('red')
      icon.textContent = "add"
      this.buttonToggleThreshold[0].dataset.tooltip = "Increase detector threshold"
    }
  }
}
