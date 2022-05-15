class Mode {
  constructor(options) {
    this._options = options || {};
    this._options.imageWidth = this._options.imageWidth || 441;
    this._options.imageHeight = this._options.imageHeight || 441;

    this._outputs = [];
  }

  clear() {
    for (let i = 0; i < this._outputs.length; i++) {
      this._outputs[i].clear();
    }
  }

  addOutput(output) {
    this._outputs.push(output);
  }

}
