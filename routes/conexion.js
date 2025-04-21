const express = require('express');
const router = express.Router();
const connection = require('../configdb'); // Importamos la conexión a la base de datos

// Ruta de prueba para verificar que la API funciona
router.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Ruta para buscar usuario por identificación en la tabla `registro_civil`
router.get('/buscar/:identificacion', (req, res) => {
    const { identificacion } = req.params;

    // Verificar que la identificación se pasa correctamente
    console.log("ID a buscar: ", identificacion);

    const query = 'SELECT nombre FROM registro_civil WHERE identificacion = ?';
    
    connection.query(query, [identificacion], (err, results) => {
        if (err) {
            console.error('Error al buscar en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            console.log("Usuario encontrado:", results[0]);
            return res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                nombre: results[0].nombre
            });
        } else {
            console.log('Usuario no encontrado');
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado, por favor regístrese'
            });
        }
    });
});



// Ruta para registrar un nuevo usuario si no existe
router.post('/registrar', (req, res) => {
    const { identificacion, nombre } = req.body; // Obtenemos los datos del cuerpo de la solicitud

    // Asegúrate de que los parámetros necesarios estén presentes
    if (!identificacion || !nombre) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos para registrar al usuario'
        });
    }

    // Verificar si el usuario ya existe
    const query = 'SELECT nombre FROM registro_civil WHERE identificacion = ?';
    connection.query(query, [identificacion], (err, results) => {
        if (err) {
            console.error('Error al buscar en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }

        // Si el usuario no existe, lo registramos
        if (results.length === 0) {
            const insertQuery = 'INSERT INTO registro_civil (identificacion, nombre) VALUES (?, ?)';
            connection.query(insertQuery, [identificacion, nombre], (err, insertResults) => {
                if (err) {
                    console.error('Error al registrar al usuario:', err);
                    return res.status(500).json({ success: false, message: 'Error al registrar al usuario' });
                }

                // Si se registra el usuario correctamente
                return res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    identificacion: identificacion,
                    nombre: nombre
                });
            });
        } else {
            return res.status(409).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }
    });
});

module.exports = router;
