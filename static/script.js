document.addEventListener('DOMContentLoaded', function () {
    var selectedMessages = []; // Almacenar mensajes seleccionados

    // Escuchar eventos de clic en los mensajes
    document.getElementById('messages').addEventListener('click', function (event) {
        // Verificar si el objetivo del clic es un mensaje
        if (event.target && event.target.classList.contains('message-text')) {
            var message = event.target.closest('.message');
            
            // Alternar selección del mensaje
            if (message.classList.contains('selected')) {
                message.classList.remove('selected');
                var index = selectedMessages.indexOf(message);
                if (index !== -1) selectedMessages.splice(index, 1);
            } else {
                message.classList.add('selected');
                selectedMessages.push(message);
            }

            // Mostrar botón de eliminar si hay mensajes seleccionados
            if (selectedMessages.length > 0) {
                showDeleteButton();
            } else {
                hideDeleteButton();
            }
        }
    });

    // Función para mostrar el botón de eliminar
    function showDeleteButton() {
        var deleteButton = document.getElementById('deleteButton');
        if (deleteButton) {
            deleteButton.style.display = 'block';
        }
    }

    // Función para ocultar el botón de eliminar
    function hideDeleteButton() {
        var deleteButton = document.getElementById('deleteButton');
        if (deleteButton) {
            deleteButton.style.display = 'none';
        }
    }

    // Evento para eliminar el mensaje seleccionado al hacer clic en el botón de eliminar
    document.getElementById('deleteButton').addEventListener('click', function() {
        selectedMessages.forEach(function (message) {
            message.remove();
        });
        selectedMessages = []; // Limpiar mensajes seleccionados
        hideDeleteButton();
    });
});

// Obtener el nombre de usuario de alguna manera (aquí lo establecemos manualmente)
var currentUser = "Usuario";

var socket = io.connect('http://' + document.domain + ':' + location.port);
var messageInput = document.getElementById("messageInput");
var sendButton = document.getElementById("sendButton");
var clearButton = document.getElementById("clearButton");

sendButton.onclick = sendMessage;
clearButton.onclick = clearChat;
messageInput.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        sendMessage(event);
    }
});

// Función para enviar un mensaje
function sendMessage(event) {
    event.preventDefault();
    var message = messageInput.value.trim();
    if (message !== "") {
        var data = {
            message: message
        };
        socket.emit('message', data);
        messageInput.value = "";
    }
}

// Escuchar mensajes recibidos y agregarlos al contenedor de mensajes
socket.on('message', function(data) {
    var messages = document.getElementById("messages");
    var messageContainer = document.createElement("div");
    var messageText = document.createElement("div");
    var messageInfo = document.createElement("div");

    messageText.textContent = data.message;
    messageText.classList.add("message-text");

    messageContainer.classList.add("message");
    messageContainer.classList.add("other-message"); // Por defecto, los mensajes recibidos serán de otros usuarios

    messageInfo.textContent = getCurrentTime();
    messageInfo.classList.add("timestamp");

    messageContainer.appendChild(messageText);
    messageContainer.appendChild(messageInfo);

    messages.appendChild(messageContainer); // Agregar mensaje al contenedor de mensajes
    messages.scrollTop = messages.scrollHeight; // Scroll hasta el último mensaje
});

function getCurrentTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes;
}

function clearChat() {
    var messages = document.getElementById("messages");
    messages.innerHTML = "";
}