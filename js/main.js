/* =========================================================
   XV Años · Jannet Reyes Hernández
   ✏️  CONFIGURACIÓN: edita solo este bloque
   ========================================================= */
const CONFIG = {
  // Fecha y hora del evento (hora del centro de México)
  fechaEvento: '2027-04-03T17:00:00-06:00',

  // Número de WhatsApp que recibirá las confirmaciones:
  // 52 + 10 dígitos, sin espacios ni signos.  Ej: '5215512345678'
  whatsapp: '5568842687',

  // Ubicación del salón
  mapsUrl: 'https://www.google.com/maps/place/Los+Pilares+de+Barberena/@19.718294,-98.7680426,17z/data=!4m14!1m7!3m6!1s0x85d1c141bd966481:0x40c5139ea03eb982!2sLos+Pilares+de+Barberena!8m2!3d19.7182539!4d-98.7679508!16s%2Fg%2F11h9ksx35m!3m5!1s0x85d1c141bd966481:0x40c5139ea03eb982!8m2!3d19.7182539!4d-98.7679508!16s%2Fg%2F11h9ksx35m!18m1!1e1?entry=ttu',
  lat: 19.7182539,
  lng: -98.7679508,
};

// Fotos del álbum: agrega o quita las que quieras (carpeta imagenes/galeria)
const FOTOS = [
  { src: 'imagenes/galeria/foto1.jpg', pie: 'Mis primeros pasos' },
  { src: 'imagenes/galeria/foto2.jpg', pie: 'Mi familia' },
  { src: 'imagenes/galeria/foto3.jpg', pie: 'Siempre sonriendo' },
  { src: 'imagenes/galeria/foto4.jpg', pie: 'Mis metas' },
  { src: 'imagenes/galeria/foto5.jpg', pie: 'Mi pasión' },
  { src: 'imagenes/galeria/foto6.jpg', pie: 'Momentos felices' },
  { src: 'imagenes/galeria/foto7.jpg', pie: 'Creciendo' },
  { src: 'imagenes/galeria/foto8.jpg', pie: 'Mis sueños' },
  { src: 'imagenes/galeria/foto9.jpg', pie: 'Lista para mis XV' },
];

/* ========================================================= */

const $ = (s) => document.querySelector(s);
const audio = $('#audio');

/* ---------- Sobre de bienvenida ---------- */
$('#btnAbrir').addEventListener('click', () => {
  $('#sobre').classList.add('abierto');
  document.body.classList.remove('bloqueado');
  $('#musicaFlotante').classList.add('mostrar');
  reproducir(); // el clic permite iniciar la música en celulares
  lluviaPetalos(40);
});

/* ---------- Pétalos ---------- */
function crearPetalo() {
  const p = document.createElement('span');
  p.className = 'petalo';
  const tam = 8 + Math.random() * 10;
  p.style.left = Math.random() * 100 + 'vw';
  p.style.width = p.style.height = tam + 'px';
  p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
  p.style.setProperty('--giro', (Math.random() * 720) + 'deg');
  p.style.animationDuration = (7 + Math.random() * 6) + 's';
  $('#petalos').appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}
function lluviaPetalos(n) {
  for (let i = 0; i < n; i++) setTimeout(crearPetalo, i * 120);
}
setInterval(() => { if (!document.hidden) crearPetalo(); }, 1400);

/* ---------- Cuenta regresiva ---------- */
const meta = new Date(CONFIG.fechaEvento).getTime();
const dos = (n) => String(n).padStart(2, '0');
function actualizarContador() {
  const resta = meta - Date.now();
  if (resta <= 0) {
    $('#contador').innerHTML = '<p class="contador__fin">¡Hoy es el gran día!</p>';
    clearInterval(timer);
    return;
  }
  $('#dias').textContent = dos(Math.floor(resta / 86400000));
  $('#horas').textContent = dos(Math.floor(resta / 3600000) % 24);
  $('#minutos').textContent = dos(Math.floor(resta / 60000) % 60);
  $('#segundos').textContent = dos(Math.floor(resta / 1000) % 60);
}
const timer = setInterval(actualizarContador, 1000);
actualizarContador();

/* ---------- Reproductor ---------- */
const fmt = (s) => isFinite(s) ? `${Math.floor(s / 60)}:${dos(Math.floor(s % 60))}` : '0:00';
function reproducir() { audio.play().catch(() => {}); }
function alternar() { audio.paused ? reproducir() : audio.pause(); }
function pintarEstado() {
  const sonando = !audio.paused;
  $('#icoPlay').style.display = sonando ? 'none' : 'block';
  $('#icoPausa').style.display = sonando ? 'block' : 'none';
  $('#disco').classList.toggle('girando', sonando);
  $('#ondas').classList.toggle('activas', sonando);
  $('#musicaFlotante').classList.toggle('sonando', sonando);
}
$('#btnPlay').addEventListener('click', alternar);
$('#musicaFlotante').addEventListener('click', alternar);
audio.addEventListener('play', pintarEstado);
audio.addEventListener('pause', pintarEstado);
audio.addEventListener('loadedmetadata', () => $('#tTotal').textContent = fmt(audio.duration));
audio.addEventListener('timeupdate', () => {
  $('#tActual').textContent = fmt(audio.currentTime);
  $('#progreso').style.width = (audio.currentTime / audio.duration * 100 || 0) + '%';
});
$('#barra').addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  if (audio.duration) audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
});

/* ---------- Álbum collage + visor ---------- */
const collage = $('#collage');
FOTOS.forEach((f, i) => {
  const fig = document.createElement('figure');
  fig.className = 'collage__item revelar';
  fig.innerHTML = `<img src="${f.src}" alt="${f.pie}" loading="lazy"><figcaption class="collage__pie">${f.pie}</figcaption>`;
  fig.addEventListener('click', () => abrirVisor(i));
  collage.appendChild(fig);
});

let actual = 0;
function mostrarFoto(i) {
  actual = (i + FOTOS.length) % FOTOS.length;
  $('#visorImg').src = FOTOS[actual].src;
  $('#visorImg').alt = FOTOS[actual].pie;
  $('#visorPie').textContent = FOTOS[actual].pie;
  $('#visorContador').textContent = `${actual + 1} / ${FOTOS.length}`;
}
function abrirVisor(i) { mostrarFoto(i); $('#visor').classList.add('abierto'); document.body.classList.add('bloqueado'); }
function cerrarVisor() { $('#visor').classList.remove('abierto'); document.body.classList.remove('bloqueado'); }
$('#visorCerrar').addEventListener('click', cerrarVisor);
$('#visorAnt').addEventListener('click', (e) => { e.stopPropagation(); mostrarFoto(actual - 1); });
$('#visorSig').addEventListener('click', (e) => { e.stopPropagation(); mostrarFoto(actual + 1); });
$('#visor').addEventListener('click', (e) => { if (e.target.id === 'visor') cerrarVisor(); });
document.addEventListener('keydown', (e) => {
  if (!$('#visor').classList.contains('abierto')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') mostrarFoto(actual - 1);
  if (e.key === 'ArrowRight') mostrarFoto(actual + 1);
});
// deslizar con el dedo en celular
let toqueX = null;
$('#visor').addEventListener('touchstart', (e) => toqueX = e.touches[0].clientX, { passive: true });
$('#visor').addEventListener('touchend', (e) => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  if (Math.abs(dx) > 50) mostrarFoto(actual + (dx < 0 ? 1 : -1));
  toqueX = null;
});

/* ---------- Ubicación y calendario ---------- */
document.querySelectorAll('.js-mapa').forEach((a) => a.href = CONFIG.mapsUrl);
$('#mapaIframe').src = `https://maps.google.com/maps?q=${CONFIG.lat},${CONFIG.lng}&z=16&output=embed`;

const cal = new URL('https://calendar.google.com/calendar/render');
cal.searchParams.set('action', 'TEMPLATE');
cal.searchParams.set('text', 'XV Años de Jannet Reyes Hernández');
cal.searchParams.set('dates', '20270403T230000Z/20270404T080000Z'); // 5 pm a 2 am hora CDMX
cal.searchParams.set('details', 'Ceremonia de bendición 5:00 pm · Recepción 7:00 pm');
cal.searchParams.set('location', 'Los Pilares de Barberena');
$('#btnCalendario').href = cal.toString();

/* ---------- Confirmación por WhatsApp ---------- */
document.querySelectorAll('input[name="asiste"]').forEach((r) =>
  r.addEventListener('change', () => {
    $('#campoPersonas').style.display = $('#asisteSi').checked ? '' : 'none';
  })
);
$('#formRsvp').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = $('#nombre').value.trim();
  if (!nombre) { $('#nombre').focus(); $('#nombre').placeholder = 'Por favor escribe tu nombre'; return; }
  const asiste = $('#asisteSi').checked;
  const extra = $('#mensajeRsvp').value.trim();

  let texto = asiste
    ? `¡Hola! 💜 Soy *${nombre}* y confirmo mi asistencia a los XV años de Jannet.`
    : `¡Hola! Soy *${nombre}*. Lamentablemente no podré asistir a los XV años de Jannet, pero le deseo un día maravilloso. 💜`;
  if (extra) texto += `\n\nMensaje para Jannet: ${extra}`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank');
});

/* ---------- Animación al hacer scroll ---------- */
const obs = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.revelar').forEach((el) => obs.observe(el));
