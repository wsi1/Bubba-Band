from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS


app = Flask(__name__)
app.config["SECRET_KEY"] = "super duper secret don't tell anyone"
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on("raspberry")
def handle_raspberry_event(json):
    print("received json: " + str(json))
    if "bubbaspace" in json:
        socketio.emit("bubbaspace", json)
    socketio.emit("frontend", json)


@socketio.on("frontend")
def handle_frontend_event(json):
    print("received json: " + str(json))
    socketio.emit("raspberry", json)


@socketio.on("bubbaspace")
def handle_bubbaspace_event(json):
    print("received json: " + str(json))
    socketio.emit("raspberry", json)


if __name__ == "__main__":
    socketio.run(app)
