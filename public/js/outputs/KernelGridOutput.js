class KernelGridOutput extends Output {
    constructor(parent, layer, control, imageWidth, imageHeight) {
        super(layer, imageWidth, imageHeight);

        this._parent = parent;
        this._control = control;
        this._control.min = 0;
        this._control.max = this._numberKernels - 1;
    }

    async setup() {
        let mainColumn = $(`<div class="column center-content"></div>`).appendTo(this._parent);
        // set up a grid of images: one row per image x 4 wide (for the number of kernel selects)

        this._images = [];
        this._overlays = [];

        let w = Math.floor(this._imageWidth / 2);
        let h = Math.floor(this._imageHeight / 2);

        let images = app.imageLibrary();
        let imageGrid = $(`<div style="display: flex; flex-flow: wrap;"></div>`).appendTo(mainColumn);

        for (let i = 1; i < images.nImages(); i++) {
            let feedAndOverlayHolder = $(`<div style="position: relative; margin: 3px;"></div>`).appendTo(imageGrid);
            let img = $(`<img width="${w}" height="${h}" src="${images.imagePath(i)}"/>`).appendTo(feedAndOverlayHolder);
            this._images.push(img.get(0));

            let overlay = $(`<canvas class="overlay" width="${this._kernelSize}" height="${this._kernelSize}" style="width: ${w}px; height: ${h}px; image-rendering: pixelated;"/>`).appendTo(feedAndOverlayHolder);
            this._overlays.push(overlay.get(0));
        }

        this.renderOverlays();
    }

    async renderOverlays() {
        let val_a = Math.max(Math.min(this._control.value, this._numberKernels - 1), 0);
        this._control.value = val_a;

        for (let i = 0; i < this._images.length; i++) {
            await faceapi.detectAllFaces(this._images[i], new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }));
            console.log(val_a);
            this._drawKernelOverlay(val_a, this._overlays[i]);
        }
    }
}
