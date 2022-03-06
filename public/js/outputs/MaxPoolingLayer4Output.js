class MaxPoolingLayer4Output extends Output {
  static BEST_EYES_INDEX = 1;
  static meta = [
    {
      name: "Best Overall",
      short: "Overall",
      kernels: [24, 27, 37, 58, 84, 111]
    },
    {
      name: "Best Eye Detectors",
      short: "Best Eyes",
      kernels: [26, 36, 46, 112]
    },
    {
      name: "Other Eye Detectors",
      short: "Eyes",
      kernels: [46, 112, 89, 45, 72, 79, 122, 24, 27, 31, 37, 53, 58, 66, 84, 85, 101, 111, 38]
    },
    {
      name: "Nose Detectors",
      short: "Nose",
      kernels: [89, 109, 45, 72, 95, 24, 27, 37, 48, 53, 57, 58, 84, 85, 111]
    },
    {
      name: "Mouth Detectors",
      short: "Mouth",
      kernels: [89, 13, 24, 27, 31, 37, 53, 58, 84, 85, 101, 111, 114, 116, 117, 125]
    },
    {
      name: "Hair Detectors",
      short: "Hair",
      kernels: [46, 38, 68, 72, 122, 24, 27, 37, 58, 66, 84, 111]
    },
    {
      name: "Chin Detectors",
      short: "Chin",
      kernels: [112, 13, 18, 24, 27, 28, 37, 53, 58, 84, 111]
    },
  ]

  constructor(parent) {
    super();

    this._parent = parent;
    this._kernelSelectorModal = new MaxPoolingLayer4Output_KernelSelectorModal(parent, this);

    this._nKernels = 4;
  }

  async setup() {
    $(`<h5 style="text-align: center; margin-top: -15px;">Max-Pooling Layer 4</h5>`).appendTo(this._parent);

    let maxPooling4Holder = $(`<div class="column center-content"></div>`).appendTo(this._parent);
    let kernelAndControllersHolder = $(`<div class="row side-by-side" style="margin: 0px;"></div>`).appendTo(maxPooling4Holder);

    this._canvases = [];
    this._overlays = [];
    this._controls = [];

    for (let i = 0; i < this._nKernels; i++) {
      let kernelAndControlHolder = $(`<div class="column center-content"></div>`).appendTo(kernelAndControllersHolder);
      let feedAndOverlayHolder = $(`<div style="position: relative"></div>`).appendTo(kernelAndControlHolder);
      let canvas = $(`<canvas width="220" height="220" style="width: 220px; height: 220px; image-rendering: pixelated;"/>`).appendTo(feedAndOverlayHolder);
      this._canvases.push(canvas.get(0));

      let overlay = $(`<canvas class="overlay" width="14" height="14" style="width: 220px; height: 220px; image-rendering: pixelated;"/>`).appendTo(feedAndOverlayHolder);
      this._overlays.push(overlay.get(0));
      let initialValues = MaxPoolingLayer4Output.meta[MaxPoolingLayer4Output.BEST_EYES_INDEX].kernels;
      let controlHolder = $(`<div class="row side-by-side"></div>`).appendTo(kernelAndControlHolder);
      $(`<label>Kernel:</label>`).appendTo(controlHolder);
      let initialValue = (i < initialValues.length) ? initialValues[i] : i;
      let control = $(`<input value="${initialValue}" type="number" max="127" min="0" class="bold center">`).appendTo(controlHolder);
      control.get(0).addEventListener('input', () => { this.setControlValue(i, null); })
      this._controls.push(control.get(0));
      let selector = $(`<a class="waves-effect waves-light _btn-small"><i class="material-icons left">search</i></a>`).appendTo(controlHolder);
      selector.get(0).addEventListener('click', () => { this._kernelSelectorModal.open(i); });
    }

    let massButtonHolder = $(`<div class="row side-by-side style="margin-bottom: 0px !important;"></div>`).appendTo(maxPooling4Holder);
    // setup mass selector buttons
    this._massSelectButtons = [];
    for (let i = 0; i < MaxPoolingLayer4Output.meta.length; i++) {
      let button = $(`<a style="margin-bottom: 2px;" class="waves-effect waves-light btn blue">${MaxPoolingLayer4Output.meta[i].short}</a>`).appendTo(massButtonHolder);
      let buttonEl = button.get(0);
      buttonEl.addEventListener('click', () => { this._massSelectKernels(i); });
      this._massSelectButtons.push(buttonEl);
    }

    this._colorMassSelectButtons();
  }

  async refresh() {
    await faceapi.detectAllFaces(this._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }))
    for (let i = 0; i < this._nKernels; i++) {
      this._refreshKernel(i);
    }
  }

  setControlValue(index, value) {
    let val_a = null;
    if (value !== null) {
      val_a = value;
    } else {
      val_a = Math.max(Math.min(this._controls[index].value, 127), 0);
    }
    this._controls[index].value = val_a;
    this._refreshKernel(index);

    this._colorMassSelectButtons();
  }

  _colorMassSelectButtons() {
    let selected = [];
    for (let i = 0; i < this._nKernels; i++) {
      selected.push(parseInt(this._controls[i].value));
    }

    for (let i = 0; i < this._massSelectButtons.length; i++) {
      // there are as many buttons as categories in the kernel meta data
      let meta = MaxPoolingLayer4Output.getKernels(i, this._nKernels);
      if (MaxPoolingLayer4Output._arraysEqual(meta, selected)) {
        this._massSelectButtons[i].classList.remove('blue');
        this._massSelectButtons[i].classList.add('green');
      } else {
        this._massSelectButtons[i].classList.remove('green');
        this._massSelectButtons[i].classList.add('blue');
      }
    }
  }

  // private

  static _arraysEqual(a, b) {
    if (a.length != b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!b.includes(a[i])) {
        return false;
      }
    }

    return true;
  }

  async _refreshKernel(index) {
    let val_a = Math.max(Math.min(this._controls[index].value, 127), 0);
    this._controls[index].value = val_a;
    // TODO: optimize to not redraw the underlying image all the time
    this._canvases[index].getContext('2d').drawImage(this._feed, 0, 0, this._canvases[index].width, this._canvases[index].height);
    this._drawKernelOverlay(val_a, this._overlays[index]);
  }

  async _drawKernelOverlay(kernel, canvas) {
    if (!canvas) {
      return;
    }

    let requested_kernels = [kernel, kernel, kernel, kernel]; // TODO: fix so that we can only ask for one
    if (faceapi.nets.tinyFaceDetector.save_conv4) {
      const grayScale = await faceapi.nets.tinyFaceDetector.getGrayscale_conv4(requested_kernels);
      this._drawKernelOverlayData(grayScale[0], canvas);
    }
  }

  async _drawKernelOverlayData(data, canvas) {
    if (!canvas) {
      return;
    }

    const kernel_W = 14
    const kernel_H = 14

    canvas.width = kernel_W, canvas.height = kernel_H;

    let ctx = canvas.getContext('2d');
    let idata = ctx.createImageData(kernel_W, kernel_H);

    let transparency = .7;
    for (let i = 3; i < data.length; i += 4) { // alpha is every 4th element
      data[i] = 255 * transparency;
    }

    idata.data.set(data);
    ctx.putImageData(idata, 0, 0);
  }

  _massSelectKernels(setIndex) {
    let kernels = MaxPoolingLayer4Output.getKernels(setIndex, this._nKernels);

    for (let i = 0; i < kernels.length; i++) {
      this.setControlValue(i, kernels[i]);
    }
  }

  static getKernels(index, max) {
    let sorted = MaxPoolingLayer4Output.meta[index].kernels.sort(function (a, b) {
      return a - b;
    });
    let ret = [];

    for (let i = 0; (!max || i < max) && (i < sorted.length); i++) {
      ret.push(sorted[i]);
    }

    return ret;
  }
}

class MaxPoolingLayer4Output_KernelSelectorModal extends Modal {
  constructor(parent, output) {
    super(parent, "Select Kernel");
    super.setup();

    this._output = output;
    this._openFor = null; // closed
  }

  open(index) {  // index is the index of the control element to set
    this._openFor = index;

    super.open();
    M.Collapsible.getInstance(this._collapsible).open(0);
  }

  close() {
    super.close();
    this._openFor = null;
  }

  // private

  _setup_contents(parent) {
    let container = $(`<div class="container"></div>`).appendTo(parent);
    let collapsible = $(`<ul class="collapsible popout" data-collapsible="accordion"></ul`).appendTo(container);
    this._collapsible = collapsible.get(0);
    for (let c = 0; c < MaxPoolingLayer4Output.meta.length; c++) {
      let name = MaxPoolingLayer4Output.meta[c].name;
      let li = $(`<li></li>`).appendTo(collapsible);
      $(`<div class="collapsible-header">${name}</div>`).appendTo(li);
      let body = $(`<div class="collapsible-body">`).appendTo(li);
      let kernels = MaxPoolingLayer4Output.getKernels(c);
      for (let k = 0; k < kernels.length; k++) {
        let value = kernels[k];
        let label = value;
        let button = $(`<a style="margin: 2px;" class="waves-effect waves-light btn btn-small blue">${label}</a>`).appendTo(body);
        button.get(0).addEventListener('click', () => { this._selectKernel(value) });
      }
    }

    collapsible.collapsible();
  }

  _setup_footer(parent) {
    let button = $(`<a href="#!" class="waves-effect waves-green btn-flat">Cancel</a>`).appendTo(parent);
    button.get(0).addEventListener('click', () => { this.close(); })
  }

  _selectKernel(value) {
    this._output.setControlValue(this._openFor, value);
    this.close();
  }
}
