class CropModal extends Modal {
  /*
    options:
      onOpen(): called when the modal opens
      onClose(url): called when a new images has been cropped and is ready to use (with the URL) or with null is cancelled
  */
  constructor(parent, width, height, options) {
    super(parent, "Crop Image");

    this._options = options || {};
    this._width = width;
    this._height = height;
    this._cropper = null;

    super.setup();
  }

  open(url) {
    this._image.src = url; // when the image is done loading, an event handler will be called

    if (this._options.onOpen) {
      this._options.onOpen();
    }

    super.open();
  }

  // private
  _setup_contents(parent) {
    let imageContainerDiv = $(`<div class="img-container">`).appendTo(parent);
    this._imageContainer = imageContainerDiv.get(0);
    let image = $(`<img>`).appendTo(imageContainerDiv);
    this._image = image.get(0);
    this._image.onload = () => { this._onImageLoaded(); };
  }

  _setup_footer(parent) {
    let cancelButton = $(`<a href="#!" class="waves-effect waves-green btn-flat">Cancel</a>`).appendTo(parent);
    cancelButton.get(0).addEventListener('click', () => { this._close(false); });
    let readyButton = $(`<a href="#!" class="waves-effect waves-green btn blue">Ready!</a>`).appendTo(parent);
    readyButton.get(0).addEventListener('click', () => { this._close(true); });

    // temporary canvas for image manipulation
    this._tempCanvas = $(`<canvas width="${this._width}" height="${this._height}" style="display: none;"></canvas>`).appendTo(parent).get(0);
  }

  _onImageLoaded() {
    /*
      const imageW = this._image.naturalWidth; const imageH = this._image.naturalHeight;
    */
    if (this._cropper) {
      this._cropper.destroy();
    }

    let img_height = window.innerHeight * 0.5;
    this._imageContainer.style.height = `${img_height}px`;

    this._cropper = new Cropper(this._image, {
      autoCropArea: 0.8,
      aspectRatio: 1,
      ready: () => {
        //Should set crop box data first here
        // this._cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
      }
    });
  }

  _close(use) {
    super.close();

    if (this._options.onClose) {
      let url = null;
      if (use) {
        const data = this._cropper.getData();
        const ctx = this._tempCanvas.getContext('2d');
        ctx.drawImage(this._image, data.x, data.y, data.width, data.height, 0, 0, this._width, this._height);
        // const result = document.getElementById('cropper-result');
        url = this._tempCanvas.toDataURL();
      }
      this._options.onClose(url);
    }

    if (this._cropper) {
      this._cropper.destroy();
    }
  }
}
