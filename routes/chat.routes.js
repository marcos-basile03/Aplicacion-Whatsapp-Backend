// ===============================================
// 1. OBTENER LA LISTA DE CHATS DEL USUARIO (GET /api/chats)
//    Esta es la ruta que llama ChatList.jsx
// ===============================================
router.get('/', protect, async (req, res) => {
    // 💡 NOTA: En una app real, aquí buscarías documentos de 'Chat' que 
    // contengan req.user.id en su lista de participantes (participants).
    // Como no tenemos un modelo 'Chat', devolvemos una lista de DUMMY chats 
    // para que el Front-end cargue. Debes reemplazar esto con tu lógica de DB.

    try {
        // Lógica de ejemplo (reemplaza con tu lógica de chats reales)
        const dummyChats = [
            {
                _id: "chat_001",
                participants: [req.user.id, "user_002"],
                name: "Amigo de Prueba",
                lastMessage: "¡Hola! Estoy esperando que me implementes."
            },
            {
                _id: "chat_002",
                participants: [req.user.id, "user_003"],
                name: "Soporte",
                lastMessage: "Tu implementación es correcta."
            }
        ];

        // El Front-end espera la respuesta como: { chats: [...] }
        res.json({ chats: dummyChats });

    } catch (err) {
        console.error('Error al obtener la lista de chats:', err.message);
        res.status(500).json({ msg: 'Error del servidor al obtener chats.' });
    }
});


// ===============================================
// 2. ENVIAR UN MENSAJE A UN CHAT (POST /api/chats/:chatId/messages)
// ===============================================
router.post('/:chatId/messages', protect, async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'El contenido del mensaje no puede estar vacío.' });
        }

        const newMessage = new Message({
            chatId,
            sender: senderId,
            content,
        });

        const savedMessage = await newMessage.save();

        res.status(201).json({
            msg: 'Mensaje enviado y guardado con éxito.',
            message: savedMessage
        });

    } catch (err) {
        console.error('Error al guardar el mensaje:', err.message);
        res.status(500).send('Error del servidor al enviar el mensaje.');
    }
});


// ===============================================
// 3. OBTENER LOS MENSAJES DE UN CHAT ESPECÍFICO (GET /api/chats/:chatId/messages)
// ===============================================
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


// ===============================================
// 4. ELIMINAR UN MENSAJE ESPECÍFICO (DELETE /api/chats/:chatId/messages/:messageId)
// ===============================================
router.delete('/:chatId/messages/:messageId', protect, async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id;

    try {
        const message = await Message.findOneAndDelete({
            _id: messageId,
            sender: userId
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