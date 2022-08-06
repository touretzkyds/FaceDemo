class ConvolutionLayer1Output extends Output {
  constructor(parent) {
    super();

    this._parent = parent;
    this._nKernels = 3; // TODO: does this have to be hardcoded? Check the API...
  }

  async setup() {
    let holderColumn = $(`<div class="column center-content" style="margin-top: 0px;"></div>`).appendTo(this._parent);
    $(`<h5 style="text-align: center; margin-top: -15px;">Convolutional Layer 1</h5>`).appendTo(holderColumn);

    let kernel_defaults = [2, 8, 11];

    this._kernels = [];
    for (let i = 0; i < this._nKernels; i++) {
      let kernel = new ConvolutionLayer1_Kernel(holderColumn, this);
      let def = (i < kernel_defaults.length) ? kernel_defaults[i] : 0;
      kernel.setup(def);
      this._kernels.push(kernel);
    }
  }

  async refresh() {
    let result = await faceapi.detectAllFaces(this._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }))
    const bboxes = await faceapi.nets.tinyFaceDetector.getBboxes(this._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }));

    let list_kernels = [];

    for (let i = 0; i < this._nKernels; i++) {
      let value = this._kernels[i].selectedValue();
      list_kernels.push(value);
    }

    const grayScale = await faceapi.nets.tinyFaceDetector.getGrayScale(list_kernels);
    const getKernel_0 = await faceapi.nets.tinyFaceDetector.getKernel_0(list_kernels);

    for (let i = 0; i < this._nKernels; i++) {
      this._kernels[i].refresh(grayScale[i], getKernel_0, i * 3); // getKernel data comes in 3s
    }
  }
}

class ConvolutionLayer1_Kernel {
  constructor(parent, output) {
    this._parent = parent;
    this._output = output;

    this._imageCanvasW = 111;
    this._imageCanvasH = 111;

    this._rgbCanvasW = 3;
    this._rgbCanvasH = 3;

    this._idata = []; // 3 idata objects for RGB canvases
  }

  setup(def) {
    let holdingDiv = $(`<div class="row side-by-side yellow-bg" style="margin-top: 0px"></div>`).appendTo(this._parent);

    this._imageCanvas = $(`<canvas width="111" height="111" style="width: 200px; height: 200px;"></canvas>`).appendTo(holdingDiv).get(0);

    let divRGBLabels = $(`<div class="column" style="margin-top: 0px; width: 25px;"></div>`).appendTo(holdingDiv);
    $(`<h6 style="color: rgb(255, 0, 0);"><b>R +</b></h6>`).appendTo(divRGBLabels);
    $(`<h6 style="color: rgb(0,206,209);"><b>R -</b></h6>`).appendTo(divRGBLabels);
    $(`<br>`).appendTo(divRGBLabels);
    $(`<h6 style="color: rgb(0, 255, 0);"><b>G +</b></h6>`).appendTo(divRGBLabels);
    $(`<h6 style="color: rgb(255, 0, 255);"><b>G -</b></h6>`).appendTo(divRGBLabels);
    $(`<br>`).appendTo(divRGBLabels);
    $(`<h6 style="color: rgb(0, 0, 255);"><b>B +</b></h6>`).appendTo(divRGBLabels);
    $(`<h6 style="color: rgb(244,196,48);"><b>B -</b></h6>`).appendTo(divRGBLabels);

    let rgbCanvasColumn = $(`<div class="column" style="margin-top: 0px;"></div>`).appendTo(holdingDiv);

    let canvasRGVString = `<canvas width="3" height="3" style="width: 55px; height: 55px; image-rendering: pixelated; margin: 10px;"></canvas>`;
    this._rgbCanvases = [];
    for (let i = 0; i < 3 /* RGB*/; i++) {
      this._rgbCanvases.push($(canvasRGVString).appendTo(rgbCanvasColumn).get(0));
    }

    // TODO: set up default values
    let kernel_options = [
      { value:  0, name:  '0 - Yellow edge detector' },
      { value:  1, name:  '1 - Yellow patch detector' },
      { value:  2, name:  '2 - Green patch detector / oriented edge detector' },
      { value:  3, name:  '3 - (Haar like feature)' },
      { value:  4, name:  '4 - Horizontal edge detector (black over white)' },
      { value:  5, name:  '5 - Negative' },
      { value:  6, name:  '6 - Yellow edge detector' },
      { value:  7, name:  '7 - Diagonal edge detector' },
      { value:  8, name:  '8 - Horizontal edge detector' },
      { value:  9, name:  '9 - Vertical edge detector' },
      { value: 10, name: '10 - Horizontal edge detector' },
      { value: 11, name: '11 - Red patch detector' },
      { value: 12, name: '12 - Blue-Green patch detector' },
      { value: 13, name: '13 - Vertical edge detector' },
      { value: 14, name: '14 - Black/Orange horizontal edge detector' },
      { value: 15, name: '15 - Black/Yellow vertical edge detector' },
    ];
    kernel_options[def].selected = true;
    this._select = App.setupSelect(holdingDiv, 400, "col s12", "Kernel: ", kernel_options);
    this._select.addEventListener('change', () => { this.refresh(); })
  }

  async refresh(imageData, colorImageData /* array*/, colorImageDataStart /* starting index */) {
    if (!imageData) { // need to run face recognition again
      await faceapi.detectAllFaces(this._output._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }))

      let value = this.selectedValue();
      let list_kernels = [value, value, value];  // TODO: do we really need to always request 3 kernels?

      let grayScale = await faceapi.nets.tinyFaceDetector.getGrayScale(list_kernels);
      let getKernel_0 = await faceapi.nets.tinyFaceDetector.getKernel_0(list_kernels);

      imageData = grayScale[0];
      colorImageData = getKernel_0;
      colorImageDataStart = 0;
    }

    let ctx = this._imageCanvas.getContext('2d');
    let idata = ctx.createImageData(this._imageCanvasW, this._imageCanvasH);
    idata.data.set(imageData);
    ctx.putImageData(idata, 0, 0);

    for (let i = 0; i < 3; i++) {
      let ctx = this._rgbCanvases[i].getContext('2d');
      let idata = ctx.createImageData(this._rgbCanvasW, this._rgbCanvasH);
      idata.data.set(colorImageData[colorImageDataStart + i]);
      ctx.putImageData(idata, 0, 0);
    }
  }

  selectedValue() {
    return parseInt(this._select.value);
  }
}
