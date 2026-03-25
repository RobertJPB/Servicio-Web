// ── API ────────────────────────────────────────────────────────
const API_URL = '/contactos';

// ── DOM ────────────────────────────────────────────────────────
const inputNombre   = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const inputTelefono = document.getElementById('telefono');
const btnGuardar    = document.getElementById('btnGuardar');
const btnTexto      = document.getElementById('btnTexto');
const lista         = document.getElementById('listaContactos');
const subtitulo     = document.getElementById('subtitulo');
const totalEl       = document.getElementById('totalContactos');
const mensajeError  = document.getElementById('mensajeError');
const buscarInput   = document.getElementById('buscar');
const addForm       = document.getElementById('addForm');

// ── Paleta de avatares Modo Claro (Sustituye la de la IA) ──────
const PALETA_CLARA = [
  { bg: '#e0f2fe', color: '#0284c7' }, // Light Blue
  { bg: '#fef08a', color: '#a16207' }, // Yellow
  { bg: '#dcfce7', color: '#16a34a' }, // Green
  { bg: '#fce7f3', color: '#db2777' }, // Pink
  { bg: '#ede9fe', color: '#7c3aed' }, // Purple
  { bg: '#ffedd5', color: '#ea580c' }, // Orange
  { bg: '#f1f5f9', color: '#475569' }  // Slate (Gray)
];

// ── Estado ─────────────────────────────────────────────────────
let todosLosContactos = [];

// ── Cargar contactos ───────────────────────────────────────────
async function cargarContactos() {
  lista.innerHTML = `
    <div class="estado">
      <div class="spinner"></div>
      <p>Consultando base de datos...</p>
    </div>`;

  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    todosLosContactos = json.contactos;

    totalEl.textContent = todosLosContactos.length.toLocaleString();
    subtitulo.textContent = `${todosLosContactos.length.toLocaleString()} contactos encontrados`;

    renderizar(todosLosContactos);
  } catch (err) {
    console.error(err);
    subtitulo.textContent = 'Estado: Error de conexión';
    totalEl.textContent = 'ERR';
    lista.innerHTML = `<div class="estado"><p>[ ERROR ] No se pudo conectar con el servidor.</p></div>`;
  }
}

// ── Renderizar lista ───────────────────────────────────────────
function renderizar(contactos) {
  lista.innerHTML = '';

  if (contactos.length === 0) {
    lista.innerHTML = `<div class="estado"><p>Cero coincidencias encontradas.</p></div>`;
    return;
  }

  // Fragment para optimizar renderizado en masa
  const fragment = document.createDocumentFragment();

  contactos.forEach((c, i) => {
    const iniciales = `${(c.nombre || '').charAt(0)}${(c.apellido || '').charAt(0)}`.toUpperCase().padEnd(2, ' ');
    const color = PALETA_CLARA[i % PALETA_CLARA.length];
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="avatar" style="background:${color.bg}; color:${color.color};">${iniciales}</div>
      <div class="card-info">
        <div class="card-name">${c.nombre || 'Desconocido'} ${c.apellido || ''}</div>
        <div class="card-phone">${c.telefono || 'Sin número'}</div>
      </div>`;
    fragment.appendChild(card);
  });

  lista.appendChild(fragment);
}

// ── Búsqueda en tiempo real ────────────────────────────────────
buscarInput.addEventListener('input', () => {
  const q = buscarInput.value.trim().toLowerCase();
  if (!q) { renderizar(todosLosContactos); return; }
  const filtrados = todosLosContactos.filter(c =>
    `${c.nombre} ${c.apellido} ${c.telefono}`.toLowerCase().includes(q)
  );
  renderizar(filtrados);
});

// ── Guardar contacto ───────────────────────────────────────────
async function guardarContacto(e) {
  e.preventDefault();
  const nombre   = inputNombre.value.trim();
  const apellido = inputApellido.value.trim();
  const telefono = inputTelefono.value.trim();

  if (!nombre || !apellido || !telefono) {
    mostrarError('ERROR: Los 3 campos son obligatorios.');
    return;
  }
  ocultarError();

  try {
    btnGuardar.disabled  = true;
    btnTexto.textContent = 'ENVIANDO...';

    const res  = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, telefono }),
    });
    const json = await res.json();

    if (json.success) {
      inputNombre.value = inputApellido.value = inputTelefono.value = '';
      await cargarContactos();
    } else {
      mostrarError(json.mensaje || 'Error al guardar.');
    }
  } catch {
    mostrarError('ERROR DE CONEXIÓN AL POSTEAR.');
  } finally {
    btnGuardar.disabled  = false;
    btnTexto.textContent = 'Guardar en agenda';
  }
}

// ── Helpers ────────────────────────────────────────────────────
function mostrarError(msg) {
  mensajeError.textContent = msg;
  mensajeError.classList.remove('hidden');
}
function ocultarError() {
  mensajeError.classList.add('hidden');
}

// ── Eventos ────────────────────────────────────────────────────
addForm.addEventListener('submit', guardarContacto);

// ── Inicio ─────────────────────────────────────────────────────
cargarContactos();
