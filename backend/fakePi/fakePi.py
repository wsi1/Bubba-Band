import socketio

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
    if val == "1":
        send_message_as_raspberry({"gesture" : "hard tap"})
    elif val == "2":
        send_message_as_raspberry({"gesture" : "soft tap"})
    # elif val =="3":
    #     send_message_as_raspberry({"gesture" : "wrist down"})

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:5000')
sio.wait()