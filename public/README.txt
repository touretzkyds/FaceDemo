ARCHITECTURE

INPUTS

The app supports two types of input: a video stream from the came or a static image
that can be picked from a library of images. Current input is displayed at the top 
left part of the screen.

OUTPUTS

Three types of output are currently supported:
  - final face recognition resuls, displayed as
    - an overlay on top of the input echo
    - more detailed results that can be displayed on the black-and-white
      version of the original video or image
  - output of the first convolution layer, where the user can choose which filters
    to display in each of the there slots
  - output of the fourth max pooling layer, where the user can choose which filter to display
    in each of the four available slots

The outputs are modeled by the following class hierarchy:
  - Output
    - ResultsOutput
    - ConvolutionLayer1Output
    - HorizontalLayerOutput

The corresponding files are stored in the 'outputs' directory.