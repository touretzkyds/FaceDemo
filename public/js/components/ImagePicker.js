class ImagePicker {
  constructor(onClose) {
    this._picker = null;
    this._onClose = onClose;
  }

  setup(parent) {
    let container_div = $(`<div class="picker-container"></div>`).appendTo(parent);
    let picker_div = $(`<div class="picker"></div>`).appendTo(container_div);
    this._picker = $(`<select class="image-picker show-html"></select>`).appendTo(picker_div);
    this.initialize(0);
  }

  initialize(selected) {
    this._picker.empty();

    let images = app.imageLibrary();
    for (let i = 0; i < images.nImages(); i++) {
      let strSelected = "";
      if (selected >= 0 && selected == i) {
        strSelected = "selected";
      }
      $(`<option ${strSelected} data-img-src="${images.imagePath(i)}"${(i == 0) ? ' data-img-class="first"' : ""} data-img-alt="${images.imageName(i)} value="${i}">${i}</option>`).appendTo(this._picker);
    }

    this._picker.imagepicker({
      show_label: false,
      hide_select: true,
      selected: (select) => {
        if (this._onClose) {
          this._onClose(select);
        }
      }
    });
  }
}
