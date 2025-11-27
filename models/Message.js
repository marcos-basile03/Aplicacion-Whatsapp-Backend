const mongoose = require('mongoose');

// Esquema de Mongoose para un Mensaje de Chat
const MessageSchema = new mongoose.Schema({
    // El ID de la conversación (que puede ser el ID del otro jugador, o un ID de sala si usas Socket.io)
    // Usaremos String por simplicidad, pero idealmente sería un ObjectId de Mongoose.
    chatId: {
        type: String, 
        required: true,
        // Puedes poner un índice para búsquedas rápidas por chat
        index: true, 
    },
    // El ID del usuario que envía el mensaje (extraído del JWT en el middleware)
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asume que tu modelo de usuario se llama 'User'
        required: true
    },
    // El contenido del mensaje (el texto)
    content: {
        type: String,
        required: true,
        trim: true
    },
    // Opcional: Para saber si el mensaje fue leído (útil para notificaciones)
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Esto agrega automáticamente 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('Message', MessageSchema);