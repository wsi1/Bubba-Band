import socketio
import uuid

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')
    while True:
        make_gesture()

def send_message_as_raspberry(data):
    print('message received with ', data)
    sio.emit("raspberry", data)

def make_gesture():
    val = input("Gesture # (1 for hard, 2 for soft): ")
    gesture_id = uuid.uuid4().hex
    if val == "1":
        send_message_as_raspberry({"gesture" : "Hard tap", "uuid": gesture_id})
    elif val == "2":
        send_message_as_raspberry({"gesture" : "Soft tap", "uuid": gesture_id})
    elif val =="3":
        send_message_as_raspberry({"gesture" : "Hold", "uuid": gesture_id})

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://ec2-3-17-64-150.us-east-2.compute.amazonaws.com/')
sio.wait()