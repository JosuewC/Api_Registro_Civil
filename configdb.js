// conexion.js
const mysql = require('mysql2');
require('dotenv').config();  // Cargar variables de entorno

const pool = mysql.createPool({
    host: process.env.BDHOST,
    user: process.env.BDUSER,
    password: process.env.BDPASS,
    database: process.env.BDNAME,
    port: process.env.BDPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar la conexión al pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos exitosa');
        connection.release(); // Liberar conexión al pool
    }
});

module.exports = pool;
