class SlideOut {
  constructor(parent) {
    this._parent = parent;
    this._root = null;

    let r = $(`<ul class="sidenav" style="width: 500px; text-align: right;"></ul>`).appendTo(parent);
    r.sidenav();
    this._root = r.get(0);
  }

  root() {
    return this._root;
  }

  open() {
    let instance = M.Sidenav.getInstance(this._root);
    instance.open();
  }

  close() {
    let instance = M.Sidenav.getInstance(this._root);
    instance.close();
  }
}
