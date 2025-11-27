const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth'); // Tu middleware de protección
const Message = require('../models/Message'); // Asegúrate de que el modelo 'Message' esté importado

// NOTA IMPORTANTE sobre el middleware: 
// Como tu middleware usa req.user.id, asumiremos que tu payload JWT es: { user: { id: ... } }

// @route POST /api/chats/:chatId/messages
// @desc Enviar un nuevo mensaje (Ruta Protegida)
router.post('/:chatId/messages', protect, async (req, res) => {
    // 'protect' se ejecutó. Si llegó aquí, el token es válido y req.user está adjunto.
    const { chatId } = req.params; // El ID del jugador con el que estás chateando
    const { content } = req.body; // El texto del mensaje
    
    // Usamos req.user.id del payload del JWT para saber quién envía el mensaje.
    const senderId = req.user.id; 

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'El contenido del mensaje no puede estar vacío.' });
        }

        // 1. Crear el nuevo documento de mensaje
        const newMessage = new Message({
            chatId,
            sender: senderId, 
            content,
        });

        // 2. Guardar en MongoDB
        const savedMessage = await newMessage.save();

        // 3. Respuesta que el Frontend espera
        res.status(201).json({
            msg: 'Mensaje enviado y guardado con éxito.',
            message: savedMessage // Devolvemos el mensaje guardado (con su _id y timestamp real)
        });

    } catch (err) {
        console.error('Error al guardar el mensaje:', err.message);
        res.status(500).send('Error del servidor al enviar el mensaje.');
    }
});


// @route GET /api/chats/:chatId/messages
// @desc Obtener todos los mensajes de un chat (Ruta Protegida)
router.get('/:chatId/messages', protect, async (req, res) => {
    const { chatId } = req.params;

    try {
        // Buscar mensajes para ese chatId y ordenarlos por timestamp
        const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

        res.json({ messages });
    } catch (err) {
        console.error('Error al obtener los mensajes:', err.message);
        res.status(500).json({ msg: 'Error en el servidor al obtener mensajes.' });
    }
});


// @route DELETE /api/chats/:chatId/messages/:messageId
// @desc Eliminar un mensaje específico (Ruta Protegida)
router.delete('/:chatId/messages/:messageId', protect, async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id; // ID del usuario autenticado (emisor)

    try {
        // 1. Encontrar y eliminar el mensaje. IMPORTANTE: Solo permitir eliminar si el sender coincide
        const message = await Message.findOneAndDelete({ 
            _id: messageId, 
            sender: userId // Solo el propietario puede eliminarlo
        });

        if (!message) {
            return res.status(404).json({ msg: 'Mensaje no encontrado o no tienes permiso para eliminarlo.' });
        }

        res.json({ msg: 'Mensaje eliminado con éxito.' });

    } catch (err) {
        console.error('Error al eliminar el mensaje:', err.message);
        res.status(500).json({ msg: 'Error en el servidor al eliminar el mensaje.' });
    }
});


module.exports = router;