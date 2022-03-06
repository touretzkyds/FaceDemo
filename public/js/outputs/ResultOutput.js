class ResultOutput extends Output {
  constructor(parent, overlay) {
    super();

    this._parent = parent;
    this._overlay = overlay;
  }

  async setup() {
    let div = $(`<div style="position: relative" class="margin"></div>`).appendTo(this._parent);
    this._mirrorCanvas = $(`<canvas width="441" height="441" style="width: 441px; height: 441px; image-rendering: pixelated; filter: grayscale(100%);"/>`).appendTo(div).get(0);
    this._mirrorOverlay = $(`<canvas class="overlay" />`).appendTo(div).get(0);
  }

  async refresh() {
    this._mirrorCanvas.getContext('2d').drawImage(this._feed, 0, 0, this._mirrorCanvas.width, this._mirrorCanvas.height);

    let result = await faceapi.detectAllFaces(this._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }))
    const bboxes = await faceapi.nets.tinyFaceDetector.getBboxes(this._feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }));
    let scores = bboxes[0];
    let boxes = bboxes[1];
    const colors = ['red', 'green', 'cyan', 'yellow', 'magenta'];
    if (result) {
      if (this._overlay) {
        this._overlay.width = 441;
        this._overlay.height = 441;
        const displaySize = { width: this._feed.width, height: this._feed.height };
        const dims = faceapi.matchDimensions(this._overlay, displaySize);
        faceapi.draw.drawDetections(this._overlay, faceapi.resizeResults(result, dims));
      }

      if (this._mirrorOverlay) {
        this._mirrorOverlay.width = 441;
        this._mirrorOverlay.height = 441;
        const ctx = this._mirrorOverlay.getContext('2d');
        ctx.strokeStyle = 'white';
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(i * 64, j * 64, 64, 64);
            for (let k = 0; k < 5; k++) {
              const score = scores[i][j][k];
              if (score > 0.2) {
                const box = boxes[i][j][k];
                const x = box[0] * 441;
                const y = box[1] * 441;
                const w = box[2] * 441;
                const h = box[3] * 441;
                ctx.lineWidth = Math.floor(score * 10);
                ctx.strokeStyle = colors[k];
                ctx.strokeRect(x, y, w, h);
                ctx.lineWidth = 4;
                ctx.strokeRect(x + w / 2, y + h / 2, 4, 4);
                ctx.lineWidth = 6;
                ctx.strokeStyle = 'white';
                ctx.strokeRect(j * 64, i * 64, 64, 64);
              }
            }
          }
        }
      }
    }
  }
}
