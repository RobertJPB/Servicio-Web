# Tarea 5: Servicio Web

Esta es la Tarea 5, Servicio Web. Para Raydelto Hernandez.  
**Robert Plaza Brito 2024-2174**

## Descripción
Este es un servicio Web construido con Node.js y Express.js que actúa como intermediario (proxy) para consumir el API de agenda de contactos ubicada en `http://www.raydelto.org/agenda.php`.

Implementa una interfaz gráfica moderna (Dark Mode, Glassmorphism) que consume nuestra propia API Express mediante:
- `GET /contactos` - Obtener la lista de la agenda.
- `POST /contactos` - Guardar y registrar un nuevo contacto.

## Estructura del Proyecto
- `server.js`: El servidor Express que maneja la API y sirve los archivos estáticos.
- `public/`: La aplicación Frontend servida al usuario de forma estática.
  - `index.html`: Estructura y UI.
  - `css/styles.css`: Hojas de estilo modernas y responsivas.
  - `js/script.js`: Lógica del cliente que se comunica de forma asincrónica con la API.

## Cómo ejecutar

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor:
   ```bash
   npm start
   ```
3. Abrir en el navegador:
   [http://localhost:3000](http://localhost:3000)
