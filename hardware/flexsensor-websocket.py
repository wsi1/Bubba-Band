import socketio
from gpiozero import MCP3008
import numpy as np

from peak_detection import real_time_peak_detection
import time
import uuid

import matplotlib.pyplot as plt


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
samples_per_second = 30
buflen = samples_per_second * seconds_per_gesture

threshold = 0.01
save_dict = dict()


def gestures():
    peak_detector = real_time_peak_detection([0.5] * buflen, 30, 10, 0.5)
    while True:
        signals, array = peak_detector.thresholding_algo(flex.value)
        gesture_id = uuid.uuid4().hex
        if signals == 1:
            yield array, gesture_id
        time.sleep(1 / samples_per_second)

def send_gesture(gesture, gesture_id):
    print("sending")
    sio.emit("raspberry", {"gesture": gesture, "uuid": gesture_id})


def make_plot(key, array):
    pass

@debounce(0.3)
def process_gesture(array, gesture_id):
    save_dict[gesture_id] = array
    send_gesture(None, gesture_id)
    for key in save_dict:
        print(key)
        print(np.around(save_dict[key], 3))
        make_plot(key, save_dict[key])


@sio.on("raspberry")
def process_signal(json):
    print("Received signal")
    print(json)

@sio.event
def connect():
    print("connected")
    for array, gesture_id in gestures():
        process_gesture(array, gesture_id)

sio.connect("http://a5a5-35-3-37-142.ngrok.io")
