class ImageMode extends Mode {
  constructor(options) {
    super();

    this._options = options || {};
    this._options.imageWidth = this._options.imageWidth || 441;
    this._options.imageHeight = this._options.imageHeight || 441;

    this._cropModal = new CropModal(document.getElementById('body'), this._options.imageWidth, this._options.imageHeight, {
      onClose: (url) => { this._onCropModalClose(url); }
    });

    this._slideOut = null;
    this._imagePicker = null;
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
    let buttonClose = $(`<a href="#!" class="waves-effect waves-light btn blue" style="margin-right: 10px;">Close</a>`).appendTo(this._slideOut.root());
    buttonClose.get(0).addEventListener('click', () => { this._slideOut.close(); });

    let masterColumn = $(`<div class="column center-content""></div>`).appendTo(parent);

    let row = $(`<div class="row side-by-side" style="position: relative; margin-bottom: 0px; align-items: start;"></div>`).appendTo(masterColumn);

    // let buttonLib = $('<a class="hoverable btn-floating btn-large waves-effect waves-light blue tooltipped" data-position="right" data-tooltip="Image Selector" style="margin-bottom: 2px;"><i class="material-icons">photo_library</i></a>').appendTo(chooserColumn);
    let buttonLib = $('#buttonLib');
    buttonLib.get(0).addEventListener('click', () => { this._slideOut.open() });

    let echoAndMaxPoolingDiv = $(`<div class="column center-content"></div>`).appendTo(row);

    this._parentEcho = $(`<div"></div>`).appendTo(echoAndMaxPoolingDiv).get(0);
    this._parentMaxPooling4 = $(`<div"></div>`).appendTo(echoAndMaxPoolingDiv).get(0);

    let convoDiv = $(`<div class="margin"></div>`).appendTo(row);
    this._parentConvolution1 = convoDiv.get(0);

    $('.tooltipped').tooltip();

    this._videoElements = [];
    this._imageElements = [];

    let div = $(`<div class="row side-by-side"></div>`).appendTo(this._parentEcho);

    let holder1 = $(`<div style="position: relative" class="margin"></div>`).appendTo(div);
    let video = $(`<video class="video video-stream" width=${w}" height="${h}" autoplay muted playsinline></video>`).appendTo(holder1);
    this._video = video.get(0);
    this._videoElements.push(this._video);
    this._video.srcObject = null; // will be set later

    this._image = $(`<img width=${w} height=${h}></img>`).appendTo(holder1).get(0); // src will be set later
    this._imageElements.push(this._image);

    let overlay = $(`<canvas class="overlay" width=${w} height=${h}/>`).appendTo(holder1);
    let videoControlsHolder = $(`<div class="overlay column center-contents"></div>`).appendTo(holder1);
    this._videoElements.push(videoControlsHolder.get(0));
    this._captureImageCanvas = $(`<canvas width=${w} height=${h} style="display: none;"/>`).appendTo(videoControlsHolder).get(0);
    let buttonToggle = $(`<a data-playing="true" style="margin-bottom: 2px;" class="btn-floating btn-small waves-effect waves-light blue"></a>`).appendTo(videoControlsHolder);
    this._buttonToggleVideo = buttonToggle.get(0);
    this._buttonToggleVideo.addEventListener('click', () => { this._toggleVideo() });
    this._buttonToggleVideoIcon = $(`<i class="material-icons">pause</i>`).appendTo(buttonToggle).get(0);
    let buttonCapture = $(`<a class="btn-floating btn-small waves-effect waves-light blue"><i class="material-icons">camera_alt</i></a>`).appendTo(videoControlsHolder);
    buttonCapture.get(0).addEventListener('click', () => { this._captureImage() });

    this._parentResultOutput = $(`<div></div>`).appendTo(div).get(0);

    let resultOutput = new ResultOutput(this._parentResultOutput, overlay.get(0));
    await resultOutput.setup();
    this.addOutput(resultOutput);

    let convolutionOutput = new ConvolutionLayer1Output(this._parentConvolution1);
    await convolutionOutput.setup();
    this.addOutput(convolutionOutput);

    let maxPoolingOutput = new MaxPoolingLayer4Output(this._parentMaxPooling4, w, h);
    await maxPoolingOutput.setup();
    this.addOutput(maxPoolingOutput);

    this._setFeed(0); // video
  }

  // private

  async _setFeed(index) {
    if (index == 0) {
      // video

      this._videoElements.forEach((el) => { el.style.display = "block"; });
      this._imageElements.forEach((el) => { el.style.display = "none"; });

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: this._options.imageWidth, height: this._options.imageHeight } })
      } catch (e) {
        console.log("Unable to setup video stream");
        return;
      }
      this._video.srcObject = stream;

      this._outputs.forEach((o) => { o.setFeed(this._video); });
      this._image.src = null;

    } else {
      // image

      this._videoElements.forEach((el) => { el.style.display = "none"; });
      this._imageElements.forEach((el) => { el.style.display = "block"; });

      let url = app.imageLibrary().imagePath(index);
      this._image.onload = () => {
        this._outputs.forEach((o) => {
          o.setFeed(this._image);
          this._video.srcObject = null;
        });
      }
      this._image.src = url;

      // close video stream, if open
      let stream = this._video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    }
  }

  _onImagePickerClose(select) {
    this._slideOut.close();
    this._setFeed(select.value());
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
      this._video.pause();
      $(this._buttonToggleVideo).attr("data-playing", "false");
      icon.html("play_arrow");
    } else {
      this._video.play();
      $(this._buttonToggleVideo).attr("data-playing", "true");
      icon.html("pause");
    }
  }
}
