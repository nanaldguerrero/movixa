import './Dashboard.css'

function Dashboard({ irACrearViaje, irAPapeleo, irAMaleta, irAWishlist, irADiario, irATienda, irAConfiguracion, irAPerfil }) {
  const pasosViaje = [
    { nombre: 'Crear viaje', estado: 'completado' },
    { nombre: 'Papeleo', estado: 'progreso' },
    { nombre: 'Maleta', estado: 'pendiente' },
    { nombre: '¡Listo!', estado: 'pendiente' },
  ]

  const etiquetaEstado = {
    completado: 'Completado',
    progreso: 'En progreso',
    pendiente: 'Pendiente',
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-logo">MOVIXA</div>
        <button className="dashboard-config" onClick={irAConfiguracion}>⚙️</button>
      </div>

      <div className="dash-fila-hero">
        <div className="dash-hero">
          <h1>¡Hola, Ariel! 👋</h1>
          <p className="dash-hero-sub">¿Listo para tu próxima aventura?</p>
          <p className="dash-hero-desc">Planifica, organiza y vive experiencias inolvidables.</p>
          <button className="dash-btn-crear" onClick={irACrearViaje}>
            <span className="dash-btn-crear-circulo">+</span>
            Crear nuevo viaje
          </button>
        </div>

        <div className="dash-destino-card">
          <h3 className="dash-destino-titulo">Tu próximo destino ✈️</h3>
          <div className="dash-destino-info">
            <span className="dash-destino-nombre">🇯🇵 Japón</span>
            <span className="dash-destino-dias">📅 15 días restantes</span>
          </div>
          <button className="dash-destino-flecha" onClick={irACrearViaje}>Ver detalles →</button>
        </div>
      </div>

      <div className="dashboard-progreso">
        <div className="dashboard-progreso-titulo">Tu viaje a Japón</div>
        <div className="dashboard-pasos">
          {pasosViaje.map((paso, i) => (
            <div key={paso.nombre} className="dashboard-paso">
              <div className={`dashboard-paso-circulo dashboard-paso-${paso.estado}`}>
                {paso.estado === 'completado' ? '✓' : i + 1}
              </div>
              <span className="dashboard-paso-texto">{paso.nombre}</span>
              <span className="dashboard-paso-estado">{etiquetaEstado[paso.estado]}</span>
              {i < pasosViaje.length - 1 && <div className="dashboard-paso-linea"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="dash-tarjetas-grandes">
        <div className="dash-tarjeta-funcion">
          <div className="dash-tarjeta-funcion-texto">
            <h3>Crear viaje</h3>
            <p>Cuéntanos tu destino, fechas y preferencias para comenzar.</p>
            <button onClick={irACrearViaje}>Comenzar →</button>
          </div>
          <svg viewBox="0 0 100 100" width="70" height="70" className="dash-tarjeta-svg">
            <circle cx="50" cy="50" r="42" fill="#E4D9FF" />
            <path d="M50 20 A30 30 0 1 1 49 20" stroke="#6a3de8" strokeWidth="3" fill="none" />
            <ellipse cx="50" cy="50" rx="15" ry="30" stroke="#6a3de8" strokeWidth="2" fill="none" />
            <path d="M65 30 L80 25 L76 38 L88 42 L68 50 Z" fill="#4fc3f7" />
          </svg>
        </div>

        <div className="dash-tarjeta-funcion">
          <div className="dash-tarjeta-funcion-texto">
            <h3>Papeleo</h3>
            <p>Revisa visas, pasaportes, vacunas y documentos necesarios.</p>
            <button onClick={irAPapeleo}>Ver requisitos →</button>
          </div>
          <svg viewBox="0 0 100 100" width="70" height="70" className="dash-tarjeta-svg">
            <rect x="25" y="15" width="50" height="70" rx="6" fill="#FFE7CC" />
            <rect x="35" y="10" width="30" height="12" rx="4" fill="#F4A65E" />
            <line x1="35" y1="38" x2="65" y2="38" stroke="#D98A3D" strokeWidth="3" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#D98A3D" strokeWidth="3" />
            <line x1="35" y1="62" x2="55" y2="62" stroke="#D98A3D" strokeWidth="3" />
            <circle cx="40" cy="38" r="3" fill="#6a3de8" />
          </svg>
        </div>

        <div className="dash-tarjeta-funcion">
          <div className="dash-tarjeta-funcion-texto">
            <h3>Maleta</h3>
            <p>Prepara tu equipaje con listas inteligentes y personalizadas.</p>
            <button onClick={irAMaleta}>Organizar →</button>
          </div>
          <svg viewBox="0 0 100 100" width="70" height="70" className="dash-tarjeta-svg">
            <rect x="20" y="35" width="60" height="45" rx="8" fill="#CFE9FF" />
            <rect x="35" y="25" width="30" height="14" rx="5" fill="#7FC1F5" />
            <rect x="28" y="45" width="20" height="8" rx="2" fill="#4fc3f7" />
            <rect x="52" y="45" width="20" height="20" rx="2" fill="#FFD166" />
            <rect x="28" y="58" width="20" height="10" rx="2" fill="#FF6B9D" />
          </svg>
        </div>
      </div>

      <div className="dashboard-grid">
        <button className="tarjeta" onClick={irAWishlist}>
          <span className="tarjeta-icono">⭐</span>
          <span className="tarjeta-texto">Wishlist</span>
        </button>

        <button className="tarjeta" onClick={irADiario}>
          <span className="tarjeta-icono">📔</span>
          <span className="tarjeta-texto">Diario de viajes</span>
        </button>
      </div>

      <div className="dashboard-secundario">
        <button className="tarjeta-chica" onClick={irATienda}>🛍️ Tienda</button>
        <button className="tarjeta-chica" onClick={irAPerfil}>👤 Perfil</button>
      </div>
    </div>
  )
}

export default Dashboard