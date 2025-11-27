const connectDB = require('./db');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
require('dotenv').config(); 

const express = require('express');
const app = express();

connectDB();

app.use(express.json());
const cors = require('cors'); 
app.use(cors());

app.use('/api', authRoutes); 
app.use('/api', profileRoutes);


app.get('/', (req, res) => {
    res.send('Servidor Backend Funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});