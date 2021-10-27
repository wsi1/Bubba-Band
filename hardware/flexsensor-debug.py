import socketio
from gpiozero import MCP3008
import matplotlib
import matplotlib.pyplot as plt

from peak_detection import real_time_peak_detection
import time


def debounce(s):
    """Decorator ensures function that can only be called once every `s` seconds.

    From: https://gist.github.com/walkermatt/2871026#gistcomment-2280711
    """

    def decorate(f):
        t = None

        def wrapped(*args, **kwargs):
            nonlocal t
            t_ = time.time()
            if t is None or t_ - t >= s:
                result = f(*args, **kwargs)
                t = time.time()
                return result

        return wrapped

    return decorate


sio = socketio.Client()
flex = MCP3008(channel=0)

seconds_per_gesture = 1
samples_per_second = 20
buflen = samples_per_second * seconds_per_gesture

threshold = 0.01


def gestures():
    peak_detector = real_time_peak_detection([0.5] * buflen, 5, 10, 0.5)
    while True:
        signals = peak_detector.thresholding_algo(flex.value)
        yield signals
        time.sleep(1 / samples_per_second)


print("connected")

for signal in gestures():
    if signal == -1:
        print("hello", signal)
