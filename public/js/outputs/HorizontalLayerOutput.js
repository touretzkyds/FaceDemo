class HorizontalLayerOutput extends Output {
  static BEST_EYES_INDEX = 1;
  static meta = [
    null, // 0
    null, // 1
    null, // 2
    [     // 3
      {
        name: "Best Overall",
        short: "Overall",
        kernels: [7, 56, 58, 63]
      },
      {
        name: "Eye Detectors",
        short: "Eyes",
        kernels: [0, 5, 6, 7, 9, 10, 16, 30, 49, 54, 56, 63]
      },
      {
        name: "Nose Detectors",
        short: "Nose",
        kernels: [38, 56, 63, 68]
      },
      {
        name: "Mouth Detectors",
        short: "Mouth",
        kernels: [0, 2, 3, 9, 10, 16, 24, 25, 26, 30, 32, 41, 44, 47, 50, 53, 54, 58, 60, 62, 63]
      },
      {
        name: "Hair Detectors",
        short: "Hair",
        kernels: [22, 32, 34, 56]
      },
      {
        name: "Chin Detectors",
        short: "Chin",
        kernels: [3, 8, 28, 42, 52, 56, 58, 62, 63]
      },
    ],
    [     // 4
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
    ],
    [     // 5
      {
        name: "Best Overall",
        short: "Overall",
        kernels: [85, 189, 205, 223]
      },
      {
        name: "Eye Detectors",
        short: "Eyes",
        kernels: [7, 14, 60, 78, 85, 92, 118, 127, 135, 145, 154, 189, 223]
      },
      {
        name: "Nose Detectors",
        short: "Nose",
        kernels: [15, 79, 115, 143, 151, 186, 189, 194, 205, 220, 223]
      },
      {
        name: "Mouth Detectors",
        short: "Mouth",
        kernels: [6, 7, 17, 27, 29, 33, 44, 56, 64, 66, 73, 75, 78, 81, 82, 85, 94, 97, 102, 113, 119, 126, 127, 130, 131, 132, 143, 157, 162, 163, 179, 183, 188, 189, 202, 205, 214, 223, 243]
      },
      {
        name: "Hair Detectors",
        short: "Hair",
        kernels: [98, 124, 135, 154]
      },
      {
        name: "Chin Detectors",
        short: "Chin",
        kernels: [38, 46, 48, 57, 84, 96, 112, 129, 144, 146, 181, 190, 249]
      },
    ],
    null  // 6
  ]

  constructor(parent, layer, imageWidth, imageHeight) {
    super(layer, imageWidth, imageHeight);
    if (!this._kernelSize || !this._numberKernels) {
      alert(`Internal error: unsupported max pooling layer: ${this._layer}`);
    }

    this._meta = HorizontalLayerOutput.meta[this._layer];

    this._parent = parent;
    if (this._meta) {
      this._kernelSelectorModal = new HorizontalLayerOutput_KernelSelectorModal(parent, this);
    }

    this._nKernels = 4;
  }

  async setup() {
    let maxPooling4Holder = $(`<div class="column center-content"></div>`).appendTo(this._parent);
    let kernelAndControllersHolder = $(`<div class="row side-by-side" style="margin: 0px;"></div>`).appendTo(maxPooling4Holder);

    this._canvases = [];
    this._overlays = [];
    this._controls = [];

    let w = Math.floor(this._imageWidth / 2);
    let h = Math.floor(this._imageHeight / 2);

    for (let i = 0; i < this._nKernels; i++) {
      let kernelAndControlHolder = $(`<div class="column center-content"></div>`).appendTo(kernelAndControllersHolder);
      let feedAndOverlayHolder = $(`<div style="position: relative"></div>`).appendTo(kernelAndControlHolder);
      let canvas = $(`<canvas width="${w}" height="${h}" style="width: ${w}px; height: ${h}px; image-rendering: pixelated;"/>`).appendTo(feedAndOverlayHolder);
      this._canvases.push(canvas.get(0));

      let overlay = $(`<canvas class="overlay" width="${this._kernelSize}" height="${this._kernelSize}" style="width: ${w}px; height: ${h}px; image-rendering: pixelated;"/>`).appendTo(feedAndOverlayHolder);
      this._overlays.push(overlay.get(0));
      let initialValues = [];
      if (this._meta) {
        initialValues = this._meta[HorizontalLayerOutput.BEST_EYES_INDEX].kernels;
      }
      let controlHolder = $(`<div class="row side-by-side"></div>`).appendTo(kernelAndControlHolder);
      $(`<label>Kernel:</label>`).appendTo(controlHolder);
      let initialValue = (i < initialValues.length) ? initialValues[i] : i;
      let control = $(`<input value="${initialValue}" type="number" max="${this._numberKernels - 1}" min="0" class="bold center">`).appendTo(controlHolder);
      control.get(0).addEventListener('input', () => { this.setControlValue(i, null); })
      this._controls.push(control.get(0));

      if (this._meta) {
        let selector = $(`<a class="waves-effect waves-light _btn-small"><i class="material-icons left">search</i></a>`).appendTo(controlHolder);
        selector.get(0).addEventListener('click', () => { this._kernelSelectorModal.open(i); });
      }
    }

    if (this._meta) {
      let massButtonHolder = $(`<div class="row side-by-side style="margin-bottom: 0px !important;"></div>`).appendTo(maxPooling4Holder);
      // setup mass selector buttons
      this._massSelectButtons = [];
      for (let i = 0; i < this._meta.length; i++) {
        let button = $(`<a style="margin-bottom: 2px;" class="waves-effect waves-light btn blue">${this._meta[i].short}</a>`).appendTo(massButtonHolder);
        let buttonEl = button.get(0);
        buttonEl.addEventListener('click', () => { this._massSelectKernels(i); });
        this._massSelectButtons.push(buttonEl);
      }

      this._colorMassSelectButtons();
    }
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
      val_a = Math.max(Math.min(this._controls[index].value, this._numberKernels - 1), 0);
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
      let meta = this.getKernels(i, this._nKernels);
      if (HorizontalLayerOutput._arraysEqual(meta, selected)) {
        this._massSelectButtons[i].classList.remove('blue');
        this._massSelectButtons[i].classList.add('green');
      } else {
        this._massSelectButtons[i].classList.remove('green');
        this._massSelectButtons[i].classList.add('blue');
      }
    }
  }

  getKernels(index, max) {
    let sorted = this._meta[index].kernels.sort(function (a, b) {
      return a - b;
    });
    let ret = [];

    for (let i = 0; (!max || i < max) && (i < sorted.length); i++) {
      ret.push(sorted[i]);
    }

    return ret;
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
    let val_a = Math.max(Math.min(this._controls[index].value, this._numberKernels - 1), 0);
    this._controls[index].value = val_a;
    // TODO: optimize to not redraw the underlying image all the time
    let ctx = this._canvases[index].getContext('2d');
    ctx.drawImage(this._feed, 0, 0, this._canvases[index].width, this._canvases[index].height);
    this._drawKernelOverlay(val_a, this._overlays[index]);
  }

  _massSelectKernels(setIndex) {
    let kernels = this.getKernels(setIndex, this._nKernels);

    for (let i = 0; i < kernels.length; i++) {
      this.setControlValue(i, kernels[i]);
    }
  }
}

class HorizontalLayerOutput_KernelSelectorModal extends Modal {
  constructor(parent, output) {
    super(parent, "Select Kernel");
    this._output = output;
    this._openFor = null; // closed

    super.setup();
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
    for (let c = 0; c < this._output._meta.length; c++) {
      let name = this._output._meta[c].name;
      let li = $(`<li></li>`).appendTo(collapsible);
      $(`<div class="collapsible-header">${name}</div>`).appendTo(li);
      let body = $(`<div class="collapsible-body">`).appendTo(li);
      let kernels = this._output.getKernels(c);
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
