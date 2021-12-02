import socketio
from gpiozero import MCP3008
import numpy as np
import queue
from scipy import stats

from peak_detection import real_time_peak_detection
import time
import uuid
import datetime
import threading

# import matplotlib.pyplot as plt


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

def load_model_from_file(file_ptr):
    # each line of the data file corresponds to one gesture
    # format is tab-delimited
    # label count   mean    m2
    m = {}
    def parse_line(line):
        parts = line.strip().split("\t")
        return parts[0], int(parts[1]), np.array(eval(parts[2])), np.array(eval(parts[3]))
    file_ptr.seek(0)
    for line in file_ptr:
        label, count, mean, m2 = parse_line(line)
        m[label] = {
            "count": count,
            "mean": mean,
            "m2": m2    
        }
    return m

model_file = open("./model.tsv", "a+")
model = load_model_from_file(model_file)

def write_model_to_file(file_ptr, m):
    file_ptr.seek(0)
    for key, row in m.items():
        line = "\t".join([str(x) for x in [key, row["count"], list(row["mean"]), list(row["m2"])]])
        file_ptr.write(line + "\n")
    file_ptr.truncate()


def gestures():
    print("listening for gestures")
    rng = np.random.default_rng()
    noise = rng.normal(loc=0.48, scale=0.001, size=buflen)
    peak_detector = real_time_peak_detection(list(noise), 7, 10, 0.8)
    while True:
        signals, array = peak_detector.thresholding_algo(flex.value)
        if signals == 1:
            add_to_queue("inference", array)
        time.sleep(1 / samples_per_second)


def get_data():
    curr_time = datetime.datetime.now()
    # will block until something is available in the queue
    data = data_queue.get()
    if data["type"] == "inference":
        gesture_id = uuid.uuid4().hex
        save_dict[gesture_id] = {"data": data["data"], "time": curr_time}
        gesture = infer_gesture(data["data"])
        send_gesture(gesture, gesture_id)
    else:
        model = update_model(save_dict[data["uuid"]], data["data"])

    delta = datetime.timedelta(minutes=2)
    cutoff = curr_time - delta
    
    for k, v in list(save_dict.items()):
        if v["time"] < cutoff:
            save_dict.pop(k)

def update_model(data, label):
    if label not in model:
        # no preexisting model for that label
        label_model = {
            "count": 1,
            "mean": np.array(data["data"]),
            "m2": np.ones(20) * 1e-20
        }
        model[label] = label_model
    else:
        label_model = model[label]
        count = label_model["count"] + 1
        d1 = data["data"] - label_model["mean"]
        mean = (label_model["mean"] * (count - 1) + data["data"]) / count
        d2 = data["data"] - mean
        m2 = label_model["m2"] + d1 * d2
        label_model = {
            "count": count,
            "mean": mean,
            "m2": m2
        }
        model[label] = label_model
    write_model_to_file(model_file, model)
    return model


def infer_gesture(data):
    if len(model) == 0:
        return None
    liks = []
    for lm in model.values():
        mean, variance = lm["mean"], np.ones(20) * 1e-6 # lm["m2"] / lm["count"]
        lik = stats.multivariate_normal.pdf(data, mean, np.sqrt(variance))
        liks.append(lik)
    print(np.array(liks))
    label = list(model.keys())[np.argmax(np.array(liks))]
    return label

def send_gesture(gesture, gesture_id):
    print("sending")
    print(gesture)
    sio.emit("raspberry", {"gesture": gesture, "uuid": gesture_id})

@debounce(0.2)
def add_to_queue(type1, array, uuid = None):
    data_queue.put({"type": type1, "data": array, "uuid": uuid})

@sio.on("raspberry")
def process_signal(json):
    print("Received signal")
    if "label" in json:
        add_to_queue("update_model", json["label"], json["uuid"])
    print(json)

@sio.event
def connect():
    print("connected")
    gesture_thread = threading.Thread(target=gestures)
    gesture_thread.start()
    while True:
        get_data()

sio.connect("http://ec2-3-17-64-150.us-east-2.compute.amazonaws.com")
