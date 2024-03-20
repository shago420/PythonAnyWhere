from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para toda la aplicación
socketio = SocketIO(app, cors_allowed_origins="*") 

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(msg):
    print('Message:', msg)
    socketio.emit('message', msg)

@socketio.on('mensaje')
def handle_message2(msg):
    print('Emitiendo:', msg)
    socketio.emit('mensaje', msg)

if __name__ == '__main__':
    socketio.run(app, debug=True)