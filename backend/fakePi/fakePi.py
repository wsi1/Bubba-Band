import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')
    while True:
        make_gesture()

def send_message_frontend(data):
    print('message received with ', data)
    sio.emit("frontend", data)

def make_gesture():
    val = input("Gesture #: ")
    if val == "1":
        send_message_frontend({"gesture" : "strong tap"})
    elif val == "2":
        send_message_frontend({"gesture" : "weak tap"})
    elif val =="3":
        send_message_frontend({"gesture" : "wrist down"})

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:5000')
sio.wait()