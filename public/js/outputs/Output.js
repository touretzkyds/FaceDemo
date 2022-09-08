class Output {
  constructor(layer, imageWidth, imageHeight) { // for now the assumption is that one output can only support one layer. This may need to change in the future.
    this._autoRefreshing = true;
    this._feed = null; // should be set later

    this._layer = layer;
    this._imageWidth = imageWidth;
    this._imageHeight = imageHeight;

    switch (this._layer) {
      case 3:
        this._kernelSize = 28;
        this._numberKernels = 64;
        break;
      case 4:
        this._kernelSize = 14;
        this._numberKernels = 128;
        break;
      case 5:
        this._kernelSize = 7;
        this._numberKernels = 256;
        break;
      case 6:
        this._kernelSize = 7;
        this._numberKernels = 512;
        break;
      }
  }

  clear() {
    this.stopAutoRefresh();
  }

  setFeed(feed) {
    this.stopAutoRefresh();
    this._feed = feed;

    if (this._feed.nodeName == 'VIDEO') {
      this._autoRefreshing = true;
      this._autoRefresh();
    } else {
      this._autoRefreshing = false;
      this.refresh();
    }
  }

  stopAutoRefresh() {
    this._autoRefreshing = false;
  }

  _autoRefresh() {
    if (this._autoRefreshing) {
      this.refresh();
      setTimeout(() => this._autoRefresh());
    }
  }

  async _drawKernelOverlay(kernel, canvas) {
    if (!canvas) {
      return;
    }

    const grayScale = await faceapi.nets.tinyFaceDetector.getGrayscale_maxN(this._layer, this._kernelSize, kernel);
    if (grayScale) {
      this._drawKernelOverlayData(grayScale, canvas);
    }
  }

  async _drawKernelOverlayData(data, canvas) {
    if (!canvas) {
      return;
    }

    canvas.width = this._kernelSize;
    canvas.height = this._kernelSize;

    let ctx = canvas.getContext('2d');
    let idata = ctx.createImageData(canvas.width, canvas.height);

    let transparency = .7;
    for (let i = 3; i < data.length; i += 4) { // alpha is every 4th element
      data[i] = 255 * transparency;
    }

    idata.data.set(data);
    ctx.putImageData(idata, 0, 0);
  }
}
