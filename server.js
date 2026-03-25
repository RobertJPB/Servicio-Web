const express = require('express');
const http    = require('http');
const path    = require('path');

const app  = express();
const PORT = 3000;

// URL del servicio externo
const AGENDA_HOST = 'www.raydelto.org';
const AGENDA_PATH = '/agenda.php';

// ─────────────────────────────────────────────
//  Middlewares
// ─────────────────────────────────────────────
app.use(express.json());

// Servir el frontend desde la carpeta public/
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
//  Función auxiliar: realiza peticiones HTTP
// ─────────────────────────────────────────────
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });

    req.on('error', (err) => reject(err));

    if (postData) req.write(postData);
    req.end();
  });
}

// ─────────────────────────────────────────────
//  GET /contactos → Lista todos los contactos
// ─────────────────────────────────────────────
app.get('/contactos', async (req, res) => {
  try {
    const options = {
      hostname: AGENDA_HOST,
      port: 80,
      path: AGENDA_PATH,
      method: 'GET',
    };

    const response = await makeRequest(options);

    let contactos;
    try {
      contactos = JSON.parse(response.body);
    } catch {
      contactos = response.body;
    }

    res.status(200).json({
      success: true,
      source: `http://${AGENDA_HOST}${AGENDA_PATH}`,
      contactos: contactos,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener los contactos del servicio externo.',
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────
//  POST /contactos → Almacena un nuevo contacto
//  Body esperado: { nombre, apellido, telefono }
// ─────────────────────────────────────────────
app.post('/contactos', async (req, res) => {
  const { nombre, apellido, telefono } = req.body;

  if (!nombre || !apellido || !telefono) {
    return res.status(400).json({
      success: false,
      mensaje: 'Los campos "nombre", "apellido" y "telefono" son obligatorios.',
    });
  }

  try {
    const nuevoContacto = JSON.stringify({ nombre, apellido, telefono });

    const options = {
      hostname: AGENDA_HOST,
      port: 80,
      path: AGENDA_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(nuevoContacto),
      },
    };

    const response = await makeRequest(options, nuevoContacto);

    let respuesta;
    try {
      respuesta = JSON.parse(response.body);
    } catch {
      respuesta = response.body;
    }

    res.status(201).json({
      success: true,
      mensaje: 'Contacto almacenado exitosamente.',
      contacto: { nombre, apellido, telefono },
      respuesta_servidor: respuesta,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al almacenar el contacto en el servicio externo.',
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────
//  Iniciar servidor
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐  Frontend:              http://localhost:${PORT}/`);
  console.log(`📋  GET  /contactos        → Listar contactos`);
  console.log(`➕  POST /contactos        → Almacenar contacto`);
});
