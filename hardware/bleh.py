import socketio
from gpiozero import MCP3008 
import matplotlib.pyplot as plt

import time
from collections import deque


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

plt.ion()
fig = plt.figure()


def gestures():
    buflen = 15
    samples_per_second = 10
    buf = deque(buflen * [0], buflen)
    while True:
        buf.append(flex.value)
        time.sleep(1 / samples_per_second)
        yield buf

@debounce(0.3)
def send_gesture():
    print("sending")
    sio.emit("raspberry", {"gesture": "hard tap"})

@sio.event
def connect():
    print("connected")
    for buf in gestures():
        print(buf)
        print(plt.isinteractive())
        fig.clear()
        plt.plot(list(range(15)), buf, "-", figure=fig)
        plt.show()
    
sio.connect("http://cde3-35-2-100-195.ngrok.io")
