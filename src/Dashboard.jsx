import './Dashboard.css'

function Dashboard({
  perfil,
  viajeActivo,
  alertaViajeActivo,
  planesHoy,
  irACrearViaje,
  irAPapeleo,
  irAMaleta,
  irAWishlist,
  irADiario,
  irATienda,
  irAConfiguracion,
  irAPerfil,
  irADetalle,
  irAMisViajes,
  irABitacora
}) {
  const calcularEstadoCategoria = (items) => {
    if (!items || items.length === 0) return 'pendiente'

    const hechos = items.filter((i) => i.hecho).length

    if (hechos === 0) return 'pendiente'
    if (hechos === items.length) return 'completado'

    return 'progreso'
  }

  const itemsPapeleo = (viajeActivo?.checklist || [])
    .filter((i) => i.categoria === 'Papeleo')

  const itemsAntesSalir = (viajeActivo?.checklist || [])
    .filter((i) => i.categoria === 'Antes de salir')

  const itemsMaleta = (viajeActivo?.maleta || [])
    .flatMap((cat) => cat.items || [])

  const estadoPapeleo = calcularEstadoCategoria(itemsPapeleo)
  const estadoMaleta = calcularEstadoCategoria(itemsMaleta)

  const todoListo =
    estadoPapeleo === 'completado' &&
    estadoMaleta === 'completado' &&
    calcularEstadoCategoria(itemsAntesSalir) === 'completado'

  const algoAvanzado =
    estadoPapeleo !== 'pendiente' ||
    estadoMaleta !== 'pendiente'

  const pasosViaje = [
    {
      nombre: 'Crear viaje',
      estado: viajeActivo ? 'completado' : 'pendiente'
    },
    {
      nombre: 'Papeleo',
      estado: viajeActivo ? estadoPapeleo : 'pendiente'
    },
    {
      nombre: 'Maleta',
      estado: viajeActivo ? estadoMaleta : 'pendiente'
    },
    {
      nombre: '¡Listo!',
      estado: todoListo
        ? 'completado'
        : algoAvanzado
          ? 'progreso'
          : 'pendiente'
    }
  ]

  const etiquetaEstado = {
    completado: 'Completado',
    progreso: 'En progreso',
    pendiente: 'Pendiente'
  }

  const primerNombre =
    perfil?.nombre_completo?.split(' ')[0] || 'viajero'

  return (
    <div className="dashboard">

      {/* FONDO DECORATIVO */}
      <div className="dashboard-decoration dashboard-decoration-1"></div>
      <div className="dashboard-decoration dashboard-decoration-2"></div>
      <div className="dashboard-decoration dashboard-decoration-3"></div>

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-brand">
          <div className="dashboard-logo">MOVIXA</div>
          <span className="dashboard-brand-line"></span>
          <span className="dashboard-brand-text">
            travel companion
          </span>
        </div>

        <div className="dashboard-header-actions">

          <button
            className="dashboard-profile-mini"
            onClick={irAPerfil}
            aria-label="Abrir perfil"
          >
            <span className="profile-mini-letter">
              {primerNombre.charAt(0).toUpperCase()}
            </span>
          </button>

          <button
            className="dashboard-config"
            onClick={irAConfiguracion}
            aria-label="Configuración"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>

        </div>
      </header>


      {/* SALUDO */}
      <section className="dashboard-welcome">

        <div>
          <div className="welcome-eyebrow">
            TU PRÓXIMA AVENTURA
          </div>

          <h1>
            Hola, {primerNombre}
            <span className="welcome-dot">.</span>
          </h1>

          <p>
            ¿Qué aventura creamos hoy?
          </p>
        </div>

        <div className="welcome-stamp">
          <span>EXPLORE</span>
          <strong>MOVIXA</strong>
          <small>TRAVEL • DREAM • LIVE</small>
        </div>

      </section>


      {/* PLANES DE HOY */}
      {planesHoy && planesHoy.length > 0 && (
        <section
          className="dash-hoy-card"
          onClick={irABitacora}
        >
          <div className="dash-hoy-decoration"></div>

          <div className="dash-hoy-header">
            <div className="dash-hoy-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="15"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 3v4M16 3v4M4 10h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <span className="dash-hoy-label">
                HOY EN TU AVENTURA
              </span>
              <h2>
                Tenés planes pendientes
              </h2>
            </div>

            <span className="dash-hoy-arrow">→</span>
          </div>

          <div className="dash-hoy-list">
            {planesHoy
              .sort((a, b) =>
                (a.hora || '').localeCompare(b.hora || '')
              )
              .map((plan) => (
                <div
                  key={plan.id}
                  className={`dash-hoy-item ${
                    plan.hecho
                      ? 'dash-hoy-item-hecho'
                      : ''
                  }`}
                >
                  {plan.hora && (
                    <span className="dash-hoy-hora">
                      {plan.hora}
                    </span>
                  )}

                  <span className="dash-hoy-line"></span>

                  <span className="dash-hoy-plan">
                    {plan.titulo}
                  </span>

                  {plan.hecho && (
                    <span className="dash-hoy-check">
                      ✓
                    </span>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}


      {/* HERO PRINCIPAL */}
      <section className="dash-main-grid">

        <div className="dash-hero">

          <div className="dash-hero-content">

            <span className="dash-card-label">
              COMIENZA A PLANEAR
            </span>

            <h2>
              Tu próxima aventura
              <br />
              empieza aquí.
            </h2>

            <p>
              Cuéntanos a dónde quieres ir y MOVIXA
              te ayudará a organizar cada detalle.
            </p>

            <button
              className="dash-btn-crear"
              onClick={irACrearViaje}
            >
              <span className="dash-btn-crear-icon">
                +
              </span>

              <span>
                Crear nuevo viaje
              </span>

              <span className="dash-btn-crear-arrow">
                →
              </span>
            </button>

          </div>


          {/* ILUSTRACIÓN DE VIAJE */}
          <div className="dash-travel-scene">

            <div className="scene-sun"></div>

            <div className="scene-cloud scene-cloud-1"></div>
            <div className="scene-cloud scene-cloud-2"></div>

            <div className="scene-mountain scene-mountain-back"></div>
            <div className="scene-mountain scene-mountain-front"></div>

            <div className="scene-route">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="scene-plane">
              <svg viewBox="0 0 80 80" aria-hidden="true">
                <path
                  d="M12 42 67 17c4-2 7 2 4 5L48 43l15 12c3 3 0 7-4 5L42 48 25 60c-3 2-6 0-5-4l4-14-12-1Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="scene-passport">
              <div className="passport-top">
                PASSPORT
              </div>

              <div className="passport-globe">
                <svg viewBox="0 0 60 60" aria-hidden="true">
                  <circle
                    cx="30"
                    cy="30"
                    r="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="30"
                    cy="30"
                    rx="9"
                    ry="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M9 30h42M13 19h34M13 41h34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <strong>MOVIXA</strong>
            </div>

          </div>

        </div>


        {/* DESTINO */}
        <div className="dash-destino-card">

          <div className="destination-header">
            <div>
              <span className="dash-card-label">
                TU PRÓXIMO DESTINO
              </span>

              <h3>
                {viajeActivo
                  ? viajeActivo.destino
                  : 'Aún no hay destino'}
              </h3>
            </div>

            <div className="destination-pin">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>


          {viajeActivo ? (
            <>
              <div className="destination-illustration">

                <div className="destination-sky"></div>
                <div className="destination-sun"></div>

                <div className="destination-mountain destination-mountain-1"></div>
                <div className="destination-mountain destination-mountain-2"></div>

                <div className="destination-ground"></div>

                <div className="destination-stamp">
                  <span>MY TRIP</span>
                  <strong>01</strong>
                </div>

              </div>

              <div className="destination-info">

                <div>
                  <span className="destination-motivo">
                    {viajeActivo.motivo}
                  </span>

                  {alertaViajeActivo && (
                    <span className="destination-alert">
                      <span className="alert-dot"></span>
                      Requisitos actualizados
                    </span>
                  )}
                </div>

                <button
                  className={`destination-button ${
                    alertaViajeActivo
                      ? 'destination-button-alert'
                      : ''
                  }`}
                  onClick={() =>
                    irADetalle(viajeActivo.id)
                  }
                >
                  {alertaViajeActivo
                    ? 'Revisar cambios'
                    : 'Ver detalles'}

                  <span>→</span>
                </button>

              </div>
            </>
          ) : (
            <div className="destination-empty">

              <div className="empty-map">
                <svg viewBox="0 0 180 100" aria-hidden="true">
                  <path
                    d="M10 65c25-25 38-25 60-8s38 15 55-5 29-15 45-27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5 6"
                  />
                  <circle cx="10" cy="65" r="4" />
                  <circle cx="170" cy="25" r="4" />
                </svg>
              </div>

              <p>
                Todavía no tenés ningún
                viaje planeado.
              </p>

              <button
                className="destination-button"
                onClick={irACrearViaje}
              >
                Crear mi primer viaje
                <span>→</span>
              </button>

            </div>
          )}

        </div>

      </section>


      {/* VER TODOS LOS VIAJES */}
      <button
        className="dash-ver-todos"
        onClick={irAMisViajes}
      >
        <span>Ver todos mis viajes</span>
        <span>→</span>
      </button>


      {/* PROGRESO */}
      <section className="dashboard-progreso">

        <div className="progress-header">

          <div>
            <span className="dash-card-label">
              ESTADO DE TU AVENTURA
            </span>

            <h3>
              {viajeActivo
                ? `Viaje a ${viajeActivo.destino}`
                : 'Tu próxima aventura'}
            </h3>
          </div>

          <div className="progress-badge">
            {todoListo
              ? 'LISTO PARA VIAJAR'
              : viajeActivo
                ? 'EN PREPARACIÓN'
                : 'POR COMENZAR'}
          </div>

        </div>


        <div className="dashboard-pasos">

          {pasosViaje.map((paso, i) => (
            <div
              key={paso.nombre}
              className="dashboard-paso"
            >

              <div
                className={`dashboard-paso-circulo dashboard-paso-${paso.estado}`}
              >
                {paso.estado === 'completado'
                  ? '✓'
                  : i + 1}
              </div>

              <span className="dashboard-paso-texto">
                {paso.nombre}
              </span>

              <span className="dashboard-paso-estado">
                {etiquetaEstado[paso.estado]}
              </span>

              {i < pasosViaje.length - 1 && (
                <div
                  className={`dashboard-paso-linea ${
                    pasosViaje[i + 1].estado ===
                    'pendiente'
                      ? ''
                      : 'linea-activa'
                  }`}
                ></div>
              )}

            </div>
          ))}

        </div>

      </section>


      {/* HERRAMIENTAS PRINCIPALES */}
      <section className="dashboard-tools">

        <div className="section-heading">
          <div>
            <span className="dash-card-label">
              ORGANIZA TU VIAJE
            </span>
            <h2>
              Todo en un solo lugar
            </h2>
          </div>
        </div>


        {/* PAPELEO */}
        <button
          className="dash-tool-card tool-paperwork"
          onClick={irAPapeleo}
        >

          <div className="tool-content">

            <div className="tool-icon">
              <svg viewBox="0 0 50 50" aria-hidden="true">
                <rect
                  x="13"
                  y="7"
                  width="24"
                  height="36"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="25"
                  cy="17"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M18 27h14M18 32h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <span className="tool-number">
                01
              </span>

              <h3>Papeleo</h3>

              <p>
                Revisa visas, pasaportes,
                vacunas y documentos.
              </p>
            </div>

          </div>

          <span className="tool-arrow">→</span>

        </button>


        {/* MALETA */}
        <button
          className="dash-tool-card tool-luggage"
          onClick={irAMaleta}
        >

          <div className="tool-content">

            <div className="tool-icon">
              <svg viewBox="0 0 50 50" aria-hidden="true">
                <rect
                  x="10"
                  y="16"
                  width="30"
                  height="27"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M18 16v-4c0-2 1-3 3-3h8c2 0 3 1 3 3v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 26h30M17 36h5M28 36h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div>
              <span className="tool-number">
                02
              </span>

              <h3>Mi maleta</h3>

              <p>
                Prepara tu equipaje con
                listas inteligentes.
              </p>
            </div>

          </div>

          <span className="tool-arrow">→</span>

        </button>


        {/* BITÁCORA */}
        <button
          className="dash-tool-card tool-log"
          onClick={irABitacora}
        >

          <div className="tool-content">

            <div className="tool-icon">
              <svg viewBox="0 0 50 50" aria-hidden="true">
                <rect
                  x="11"
                  y="8"
                  width="28"
                  height="34"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M17 16h16M17 23h16M17 30h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="34"
                  cy="35"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div>
              <span className="tool-number">
                03
              </span>

              <h3>Bitácora</h3>

              <p>
                Organiza tus planes y
                actividades del viaje.
              </p>
            </div>

          </div>

          <span className="tool-arrow">→</span>

        </button>

      </section>


      {/* RECUERDOS Y DESEOS */}
      <section className="dashboard-memory">

        <div className="section-heading">

          <div>
            <span className="dash-card-label">
              TU HISTORIA
            </span>

            <h2>
              Viajes que viven contigo
            </h2>
          </div>

        </div>


        <div className="memory-grid">

          <button
            className="memory-card memory-wishlist"
            onClick={irAWishlist}
          >

            <div className="memory-card-top">
              <span>WISHLIST</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m12 4 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="memory-stamp">
              DREAM
            </div>

            <h3>
              Viajes deseados
            </h3>

            <p>
              Guarda esos lugares
              que algún día quieres conocer.
            </p>

            <span className="memory-arrow">
              →
            </span>

          </button>


          <button
            className="memory-card memory-diary"
            onClick={irADiario}
          >

            <div className="memory-card-top">
              <span>DIARIO</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 4h12v16H6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 8h6M9 12h6M9 16h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="memory-stamp">
              MEMORIES
            </div>

            <h3>
              Mis recuerdos
            </h3>

            <p>
              Guarda las historias y momentos
              de tus aventuras.
            </p>

            <span className="memory-arrow">
              →
            </span>

          </button>

        </div>

      </section>


      {/* ACCESOS SECUNDARIOS */}
      <section className="dashboard-secondary">

        <button
          className="secondary-card"
          onClick={irATienda}
        >
          <span className="secondary-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 9h14l-1 11H6L5 9Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8 9V7a4 4 0 0 1 8 0v2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>

          <span>Tienda</span>

          <span>→</span>
        </button>


        <button
          className="secondary-card"
          onClick={irAPerfil}
        >
          <span className="secondary-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle
                cx="12"
                cy="8"
                r="3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span>Mi perfil</span>

          <span>→</span>
        </button>

      </section>


      {/* FOOTER */}
      <footer className="dashboard-footer">
        <span>MOVIXA</span>
        <span className="footer-line"></span>
        <span>YOUR WORLD. YOUR PATH.</span>
      </footer>

    </div>
  )
}

export default Dashboard