const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Conexión exitosa a MongoDB Atlas.');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;