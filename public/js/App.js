class App {
  constructor(options) {
    this._mode = null;

    this._options = options || {};
    this._options.imageWidth = this._options.imageWidth || 441;
    this._options.imageHeight = this._options.imageHeight || 441;

    this._imageLibrary = new ImageLibrary();

    this._currentMode = 0;
  }

  imageLibrary() { return this._imageLibrary; }

  async run() {
    await loadFaceDetector();
    // if (typeof(stream) == "undefined"){
    //   document.write('Please change http to https in the url and reload the page.')
    // }
    if (location.protocol == 'http:') {
      let href = location.href.replace('http:', 'https:');
      console.log('redirect to:', href);
      location.replace(href);
      return;
    }

    $('select').formSelect();
    M.AutoInit();

    let modeControl = $('select#mode_control').get(0);
    modeControl.addEventListener('change', () => { this._setupMode(); });

    this._setupMode();
  }

  // static helpers

  static setupSelect(parent, width, addClass, label, options) {
    if (!addClass) {
      addClass = "";
    }
    let div = $(`<div class="input-field ${addClass}" style="width: ${width}px;"></div>`).appendTo(parent);

    let select = $(`<select></select`).appendTo(div);
    for (let i = 0; i < options.length; i++) {
      let o = options[i];
      $(`<option value="${o.value}" ${o.selected ? "selected" : ""}>${o.name}</option>`).appendTo(select);
    }

    if (label) {
      $(`<label>${label}</label>`).appendTo(div);
    }

    $(select).formSelect();
    return select.get(0);
  }

  // private

  _setupMode() {
    let mode = $('select#mode_control').val();
    let parent = $(`#mode-container`)
    parent.empty();

    if (this._mode) {
      this._mode.clear();
    }

    if (mode == "image_mode") {
      this._mode = new ImageMode({
        imageWidth: this._options.imageWidth,
        imageHeight: this._options.imageHeight
      });
    } else if (mode == "kernel_mode") {
      this._mode = new KernelMode();
    }

    this._mode.setup(parent);
  }
}
