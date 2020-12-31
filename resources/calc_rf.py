"""
Calculate the receptive field size of each layer
assuming 3x3 convolutional kernels and 2x2 max-pooling.
Call each function with an argument of 1 to find the
receptive field size N (actually NxN) of units in that
layer in terms of the number of input pixels.
"""

def c1(i): return i+2

def m1(i): return c1(2*i)

def c2(i): return m1(i+2)

def m2(i): return c2(2*i)

def c3(i): return m2(i+2)

def m3(i): return c3(2*i)

def c4(i): return m3(i+2)

def m4(i): return c4(2*i)

def c5(i): return m4(i+2)

def m5(i): return c5(2*i)

def c6(i): return m5(i+2)

def m6(i): return c6(2*i)
