class KernelMode extends Mode {

    /*
    function setupImageOverlayPanel(parent, image_url) {
  
      const layer4_N = 128;
  
      parent.empty();
    
      $(`<h5 style="text-align: center;">Kernel-based Image Overlays</h5>`).appendTo(parent);
      let row_div = $(`<div class="row side-by-side" style="margin-top: 0px;"></div>`).appendTo(parent);
      for (i = 0; i < layer4_N; i++) {
        if ((i > 0) && (i % 4 == 0)) {
          row_div = $(`<div class="row side-by-side" style="margin-top: 0px;"></div>`).appendTo(parent);
        }
    
        let cell = $(`<div class="column center-contents"</div>`).appendTo(row_div);
    
        $(`<label id="label-kernel-${i}" for="canvas-kernel-${i}">Kernel ${i}:</label>`).appendTo(cell);
    
        let div = $(`<div class="imageWithCanvasWrapper"></div`).appendTo(cell);
        $(`<img src="${image_url}" width="441" height="441"></img>`).appendTo(div);
        $(`<canvas id="image-overlay-canvas-${i}" class="overlay" width="14" height="14" style="width: 441px; height: 441px; image-rendering: pixelated;"/>`).appendTo(div);
      }
    }
  
    async function setupKernelInvestigationMode(parent) {
      // set up a grid of images: one row per image x 4 wide (for he number of kernel selects)
      let image_column = $(`<div class="column center-contents"</div>`).appendTo(parent);
      for (let i = 2; i < images.length; i++) {
        let image_row = $(`<div class="row side-by-side" style="position: relative" class="margin"></div>`).appendTo(image_column);
        for (let k = 0; k < 4; k++) {
          let cell_div = $(`<div></div`).appendTo(image_row);
          $(`<label id="label-canvas-image-${i}-kernel-${k}"> Kernel ${i}:</label>`).appendTo(cell_div);
          let image_div = $(`<div class="imageWithCanvasWrapper"></div`).appendTo(cell_div);
          $(`<img id="input-image-${i}" src="${app.imageLibrary().imagePath(i)}" width="441" height="441"></img>`).appendTo(image_div);
          $(`<canvas id="canvas-image-${i}-kernel-${k}" class="overlay"width="14" height="14" style="width: 441px; height: 441px; image-rendering: pixelated;"/>`).appendTo(image_div);
        }
      }
    }
  
  
    refresh
      if (mode == "kernel_mode") {
        for (let i = 0; i < images.length; i++) {
          const feed = $(`#input-image-${i}`).get(0);
  
          result = await faceapi.detectAllFaces(feed, new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }));
          const grayScale4 = await faceapi.nets.tinyFaceDetector.getGrayscale_conv4(list_kernels_4);  <-- rename to new 'max'
          for (let k = 0; k < 4; k++) {
            let canvas = document.getElementById(`canvas-image-${i}-kernel-${k}`);
            drawKernelOverlayData(grayScale4[k], canvas);
          }
        }
      }
  
    */
  
  }
  