class KernelMode extends Mode {

  constructor(options) {
    super();
    this._layer = 4;
  }

  async setup(parent) {
    let output = new KernelGridOutput(parent, 3, this._options.imageWidth, this._options.imageHeight);
    await output.setup();
    this.addOutput(output);
  }
}
