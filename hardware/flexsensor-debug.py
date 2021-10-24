import socketio
from gpiozero import MCP3008 
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from scipy.signal import find_peaks
import sensormotion as sm

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

seconds_per_gesture = 1
samples_per_second = 20
buflen = samples_per_second * seconds_per_gesture

matplotlib.rcParams["backend"] = "Qt5Agg"
# matplotlib.rcdefaults()
# print(matplotlib.get_backend())
plt.ion()
threshold = 0.01
fig = plt.figure()
ax = fig.add_subplot(111)
# line1 = ax.plot(list(range(buflen)), np.zeros(buflen))[0]
# print(line1)


# https://stackoverflow.com/a/56451135
# class PeakDetection():
#     def __init__(self, array, lag, threshold, influence):
#         self.y = list(array)
#         self.length = len(self.y)
#         self.lag = lag
#         self.threshold = threshold
#         self.influence = influence
#         self.signals = np.zeros(len(self.y)
#         self.filteredY = np.array(self.y)
#         self.avgFilter = np.zeros(len(self.y))
#         self.stdFilter = np.zeros(len(self.y))
#         self.avgFilter[self.lag - 1] = np.mean(self.y[0:self.lag]).tolist()
#         self.stdFilter[self.lag - 1] = np.std(self.y[0:self.lag]).tolist()
# 
#     def add_value(self, new_value):
#         self.y.append(new_value)
#         i = len(self.y) - 1
#         self.length = len(self.y)
#         if i < self.lag:
#             return 0
#         elif i == self.lag:
#             self.signals = np.zeros(len(self.y))
#             self.filteredY = np.array(self.y)
#             self.avgFilter = np.zeros(len(self.y))
#             self.stdFilter = np.zeros(len(self.y))
#             self.avgFilter[self.lag] = np.mean(self.y[0:self.lag]).tolist()

class real_time_peak_detection():
    def __init__(self, array, lag, threshold, influence):
        self.y = list(array)
        self.length = len(self.y)
        self.lag = lag
        self.threshold = threshold
        self.influence = influence
        self.signals = [0] * len(self.y)
        self.filteredY = np.array(self.y).tolist()
        self.avgFilter = [0] * len(self.y)
        self.stdFilter = [0] * len(self.y)
        self.avgFilter[self.lag - 1] = np.mean(self.y[0:self.lag]).tolist()
        self.stdFilter[self.lag - 1] = np.std(self.y[0:self.lag]).tolist()

    def thresholding_algo(self, new_value):
        self.y.append(new_value)
        i = len(self.y) - 1
        self.length = len(self.y)
        if i < self.lag:
            return 0
        elif i == self.lag:
            self.signals = [0] * len(self.y)
            self.filteredY = np.array(self.y).tolist()
            self.avgFilter = [0] * len(self.y)
            self.stdFilter = [0] * len(self.y)
            self.avgFilter[self.lag] = np.mean(self.y[0:self.lag]).tolist()
            self.stdFilter[self.lag] = np.std(self.y[0:self.lag]).tolist()
            return 0

        self.signals += [0]
        self.filteredY += [0]
        self.avgFilter += [0]
        self.stdFilter += [0]

        if abs(self.y[i] - self.avgFilter[i - 1]) > self.threshold * self.stdFilter[i - 1]:
            if self.y[i] > self.avgFilter[i - 1]:
                self.signals[i] = 1
            else:
                self.signals[i] = -1

            self.filteredY[i] = self.influence * self.y[i] + (1 - self.influence) * self.filteredY[i - 1]
            self.avgFilter[i] = np.mean(self.filteredY[(i - self.lag):i])
            self.stdFilter[i] = np.std(self.filteredY[(i - self.lag):i])
        else:
            self.signals[i] = 0
            self.filteredY[i] = self.y[i]
            self.avgFilter[i] = np.mean(self.filteredY[(i - self.lag):i])
            self.stdFilter[i] = np.std(self.filteredY[(i - self.lag):i])

        print(f"{self.y[i]}, {self.signals[i]}")
        return self.signals[i]

def gestures():
    buf = deque([0.5] * buflen, buflen)
    peak_detector = real_time_peak_detection([0.5] * buflen, 5, 10, 0.5)
    while True:
        buf.append(flex.value)
        signals = peak_detector.thresholding_algo(flex.value)
        # print(peak_values)
        # deriv = np.diff(np.array(buf))
        # peaks, _ = find_peaks(np.abs(buf), threshold=threshold, distance=3)
        # peaks, _ = find_peaks(deriv, threshold=threshold, distance=5)
        #print(signals)
	
        # print(np.around(deriv, 3)[:1])
        #if len(peaks) > 0 and peaks[0] == 3:
        #    print(peaks)
        # yield np.diff(np.array(buf)), peaks
        time.sleep(1 / samples_per_second)

print("connected")

for buf, peaks in gestures():
    # printing only when should send data to thread
    if len(buf) > 0 and buf[0] == 10:
        print("hello", buf)

    # print(buf)
    # print(plt.isinteractive())
    fig.clear()
    ymin = -0.1
    ymax = 0.1
    # plt.ylim([0.45, 0.55])
    # plt.ylim([ymin, ymax])
    # plt.plot(list(range(len(buf))), buf, "r-")
    # plt.vlines(peaks, ymin, ymax)
    # plt.hlines([threshold], 0, len(buf))
    # line1.set_ydata(buf)
    # fig.canvas.draw()
    # fig.canvas.flush_events()
    # plt.pause(1/100000)
