from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_cors import CORS




app = Flask(__name__, static_folder='static')
CORS(app)  # Habilitar CORS para toda la aplicación
socketio = SocketIO(app, cors_allowed_origins="*")

user_count = 0

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('connect')
def handle_connect():
    global user_count
    user_count += 1
    username = f"Usuario {user_count}"
    socketio.emit('username', username)

@socketio.on('disconnect')
def handle_disconnect():
    global user_count
    user_count -= 1

@socketio.on('message')
def handle_message(data):
    print(data)
    socketio.emit('message', data)


if __name__ == "__main__":
    socketio.run(app)
