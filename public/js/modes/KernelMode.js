class KernelMode extends Mode {

  constructor(options) {
    super();
    this._layer = 4;
  }

  async setup(parent) {
    let masterColumn = $(`<div class="column center-content""></div>`).appendTo(parent);

    let titleAndControl = $(`<div class="title-and-dropdown row side-by-side no-margin"></div>`).appendTo(masterColumn).get(0);
    $(`<h5 style="text-align: center; margin-top: -4px;">Image Grid for Layer </h5>`).appendTo(titleAndControl);

    let layer_options = [
      { value: 3, name: '3' },
      { value: 4, name: '4', selected: true },
      { value: 5, name: '5' },
//      { value: 6, name: '6' }
    ];

    this._select = App.setupSelect(titleAndControl, 50, null, null, layer_options);
    this._select.addEventListener('change', () => { this._onLayerChange(); })

    $(`<h5 style="text-align: center; margin-top: -4px;">Kernel</h5>`).appendTo(titleAndControl);

    this._kernelControl = $(`<input value="0" style="width: 75px;" type="number" class="center">`).appendTo(titleAndControl).get(0);
    this._kernelControl.addEventListener('change', () => { this._output.renderOverlays(); })

    this._outputHolder = $(`<div></div>`).appendTo(masterColumn);
    this._onLayerChange();
  }

  _onLayerChange() {
    let layer = parseInt(this._select.value);
    this._setupOutput(layer);
  }

  async _setupOutput(layer) {
    if (this._output) {
      this._output.clear();
      this.removeOutput(this._output);
      $(this._outputHolder).empty();
    }

    this._output = new KernelGridOutput(this._outputHolder, layer, this._kernelControl, this._options.imageWidth, this._options.imageHeight);
    await this._output.setup();
    this.addOutput(this._output);
  }
}
