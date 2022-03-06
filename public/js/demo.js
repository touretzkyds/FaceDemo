// TODO: Take the image library management code into the App class
// TODO: cleanup hardcoded sizes, like 441
// TODO: decide what to do with SSL certs and the repo

let app = null;

$(document).ready(function () {
  app = new App();
  app.run();
})
