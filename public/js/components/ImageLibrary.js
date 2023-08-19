class ImageLibrary {
  constructor() {
    this._imagePath = 'public/images/';
    this._initialize_images();
  }

  nImages() { return this._images.length; }
  imageName(index) { return this._images[index].name; }
  imagePath(index) {
    let url = this._images[index].url;

    if (url.length < 4) {
      return url;
    }

    if (url.substring(0, 4) == "blob" || url.substring(0, 4) == "data") {
      return url;
    }

    return url = this._imagePath + url;
  }

  add(name, url) {
    this._images.push({
      name: name,
      url: url
    });
  }

  clearImages() {
    //this._imagePath = 'public/images_inputted'
    this._images = [];
  }

  resetDefaultImages() {
    this._initialize_images();
  }

  // private

  _initialize_images() {
    this._images = [
      {
        name: "Live camera feed",
        url: "live-camera-feed.png"
      },
      {
        name: "Woman Lower Face",
        url: "woman-nose-mouth-chin.png"
      },
      {
        name: "Man Lower Face",
        url: "man-nose-mouth-chin.png"
      },
      {
        name: "Young Woman Face",
        url: "young-woman-face.png"
      },
      {
        name: "Young Woman Lower Face",
        url: "young-woman-lower-face.png"
      },
      {
        name: "Young Woman Chin Center",
        url: "young-woman-chin-middle.png"
      },
      {
        name: "Woman Face High Up",
        url: "woman-face-high-up.png"
      },
      {
        name: "Woman face",
        url: "big-face.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 35,
                "y": 75
              },
              bottomright: {
                "x": 390,
                "y": 180
              }
            }
          }
        ]
      },
      {
        name: "Woman face scrolled off",
        url: "big-face-scrolled-off-eyes.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 120,
                "y": 0
              },
              bottomright: {
                "x": 310,
                "y": 230
              }
            }
          }
        ]
      },
      {
        name: "Beard man",
        url: "beard-man.png"
      },
      {
        name: "Beard man no eyes",
        url: "beard-man-no-eyes.png"
      },
      {
        name: "Older man",
        url: "older-beard-man.png"
      },
      {
        name: "Lena",
        url: "lena441.jpg",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 240,
                "y": 120
              },
              bottomright: {
                "x": 350,
                "y": 180
              }
            }
          }
        ]
      },
      {
        name: "Checkerboard",
        url: "checkerboard-squares-black-white.jpg"
      },
      {
        name: "Diagonal Checkerboard",
        url: "diagonal-black-checkered-pattern-4.jpg"
      },
      {
        name: "Eye photos",
        url: "eye-photos.png"
      },
      {
        name: "Eye drawings",
        url: "eye-drawings.png"
      },
      {
        name: "Circles",
        url: "circles.png"
      },
      {
        name: "Abstract eye shapes",
        url: "abstract-eye-shapes.png"
      },
      {
        name: "Sample Man",
        url: "sample-man.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 130,
                "y": 150
              },
              bottomright: {
                "x": 265,
                "y": 200
              }
            }
          }
        ]
      },
      {
        name: "Sample Man (no eyes)",
        url: "sample-man-no-eyes.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 130,
                "y": 150
              },
              bottomright: {
                "x": 265,
                "y": 200
              }
            }
          }
        ]
      },
      {
        name: "Sample Man (no eyes, no mouth)",
        url: "sample-man-no-eyes-no-mouth.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 140,
                "y": 150
              },
              bottomright: {
                "x": 255,
                "y": 275
              }
            }
          }
        ]
      },
      {
        name: "Susan Sullivan",
        url: "susan-sullivan.png",
        regions: [
          {
            name: "Eyes",
            coords: {
              topleft: {
                "x": 125,
                "y": 110
              },
              bottomright: {
                "x": 250,
                "y": 175
              }
            }
          }
        ]
      }
    ];
  }
}

