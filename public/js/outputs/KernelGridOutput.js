class KernelGridOutput extends Output {
    constructor(parent, layer, imageWidth, imageHeight) {
        super(layer, imageWidth, imageHeight);

        this._parent = parent;
    }

    async setup() {
        let mainColumn = $(`<div class="column center-content"></div>`).appendTo(this._parent);
        let headerRow = $(`<div class="row side-by-side" style="margin: 0px;"></div>`).appendTo(mainColumn);
        $(`<h5 style="text-align: center; margin-top: -15px;">Kernel Grid for Layer ${this._layer}</h5>`).appendTo(headerRow);

        // set up a grid of images: one row per image x 4 wide (for the number of kernel selects)

        this._images = [];
        this._overlays = [];

        let w = Math.floor(this._imageWidth / 2);
        let h = Math.floor(this._imageHeight / 2);

        let controlRow = $(`<div class="row side-by-side" style="margin: 0px;"></div>`).appendTo(mainColumn);
        $(`<label>Kernel:</label>`).appendTo(controlRow);
        this._control = $(`<input value="0" type="number" max="${this._numberKernels - 1}" min="0" class="bold center">`).appendTo(controlRow).get(0);
        this._control.addEventListener('input', () => { this.renderOverlays(); })

        let images = app.imageLibrary();
        let imageGrid = $(`<div></div>`).appendTo(mainColumn);
        let row = null;
        let imagesPerRow = Math.floor(window.innerWidth / w);
        console.log(imagesPerRow);

        for (let i = 1; i < images.nImages(); i++) {
            let imageSeqNo = i - 1;
            if (imageSeqNo % imagesPerRow == 0) {
                row = $(`<div class="row side-by-side left" style="margin: 0px;"></div>`).appendTo(imageGrid);
            }
            let feedAndOverlayHolder = $(`<div style="position: relative"></div>`).appendTo(row);
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
