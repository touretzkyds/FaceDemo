=== ARCHITECTURE ===

INPUTS

The app supports two types of input: a video stream from the came or a static image
that can be picked from a library of images. Current input is displayed at the top 
left part of the screen.

When the input, also called "feed" in the code, is a video, it is processed one frame
at a time and each output, see below, can refresh it's visualizations. Outputs have
auto-refresh functionality (implemented in the Output class) that gets enabled 
when the input type is a video stream.

OUTPUTS

Three types of output are currently supported:
  - final face recognition resuls, displayed as
    - an overlay on top of the input echo
    - more detailed results that can be displayed on the black-and-white
      version of the original video or image
  - output of the first convolution layer, where the user can choose which filters
    to display in each of the there slots
  - output of the fourth max pooling layer, where the user can choose which filter
    to display in each of the four available slots

The outputs are modeled by the following class hierarchy:
  - Output
    - ResultsOutput
    - ConvolutionLayer1Output
    - HorizontalLayerOutput

The corresponding files are stored in the 'outputs' directory.

MODES

Currently only one mode is implemented, the original mode and the layout. During the
research project, another mode was implemented where all images will be passed through
a given set of kernels showing activations. That mode ("Kernel Mode") is currently not
implemented, but it would be easy to add now after the code changes.

Mode class hierarchy is:
  - Mode
    - ImageMode (currently only mode)
    - KernelMode (not implemented)

The corresponding filed are stored in the 'modes' directory.
