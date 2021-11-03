import socketio
import qu
from gpiozero import MCP3008
import numpy as np
import queue

from peak_detection import real_time_peak_detection
import time
import uuid
import datetime

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
data_queue = queue.Queue()


def gestures():
    peak_detector = real_time_peak_detection([0.5] * buflen, 30, 10, 0.5)
    while True:
        signals, array = peak_detector.thresholding_algo(flex.value)
        if signals == 1:
            add_to_queue("inference", array)
            yield array, gesture_id
        time.sleep(1 / samples_per_second)

def get_data():
    curr_time = datetime.datetime.now()
    # will block until something is available in the queue
    data = data_queue.get()
    gesture_id = uuid.uuid4().hex
    if data["type"] == "inference":
        save_dict[gesture_id] = {"data": data["data"], "time": curr_time}
    else:
        update_model()
    
    delta = datetime.timedelta(minutes=2)
    cutoff = curr_time - delta
    
    for k, v in list(save_dict).items():
        if v["time"] < cutoff:
            save_dict.pop(k)

def update_model():
    pass

def send_gesture(gesture, gesture_id):
    print("sending")
    sio.emit("raspberry", {"gesture": gesture, "uuid": gesture_id})

@debounce(0.3)
def add_to_queue(type1, array, uuid = None):
    data_queue.put({"type": type1, "data": array, "uuid": uuid})

@sio.on("raspberry")
def process_signal(json):
    print("Received signal")
    print(json)

@sio.event
def connect():
    print("connected")
    while True:
        get_data()

sio.connect("http://a5a5-35-3-37-142.ngrok.io")
