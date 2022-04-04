class Modal {
  constructor(parent, title) {
    this._parent = parent;
    this._title = title;
    this._modalElement = null;
  }

  setup() {
    let modalDiv = $(`<div class="modal"></div>`).appendTo(this._parent);
    this._modalElement = modalDiv.get(0);

    let contentDiv = $(`<div class="modal-content"></div>`).appendTo(modalDiv);
    $(`<h4>${this._title}</h4>`).appendTo(contentDiv);
    this._setup_contents(contentDiv);

    let footerDiv = $(`<div class="modal-footer"></div>`).appendTo(modalDiv);
    this._setup_footer(footerDiv);

    modalDiv.modal();
  }

  open() {
    let modal = M.Modal.getInstance(this._modalElement);
    modal.open();
  }

  close() {
    let modal = M.Modal.getInstance(this._modalElement);
    modal.close();
  }

  // private

  _setup_contents(parent) {
    // Implement in drived classes
  }

  _setup_footer(parent) {
    // Implement in drived classes
  }
}
