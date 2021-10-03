from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super duper secret don\'t tell anyone'
socketio = SocketIO(app)


@socketio.on('raspberry')
def handle_raspberry_event(json):
    print('received json: ' + str(json))
    socketio.emit('frontend', json)


@socketio.on('frontend')
def handle_frontend_event(json):
    print('received json: ' + str(json))
    socketio.emit('raspberry', json)


if __name__ == '__main__':
    socketio.run(app)
