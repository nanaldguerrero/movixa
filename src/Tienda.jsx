import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Tienda.css'

const categorias = [
  {
    id: 'seguros',
    nombre: 'Seguros de viaje',
    icono: '🛡️',
    etiqueta: 'Protección',
    desc: 'Cobertura médica, equipaje y asistencia durante tu aventura.',
    busqueda: 'seguro de viaje para',
    color: 'morado',
  },
  {
    id: 'sim',
    nombre: 'SIM / Datos móviles',
    icono: '📶',
    etiqueta: 'Conectividad',
    desc: 'Encuentra eSIM y opciones de datos para conectarte al llegar.',
    busqueda: 'eSIM datos móviles para turistas en',
    color: 'celeste',
  },
  {
    id: 'hoteles',
    nombre: 'Hoteles',
    icono: '🏨',
    etiqueta: 'Alojamiento',
    desc: 'Busca hoteles, apartamentos y lugares donde descansar.',
    busqueda: 'mejores hoteles en',
    color: 'rosa',
  },
  {
    id: 'vuelos',
    nombre: 'Vuelos',
    icono: '✈️',
    etiqueta: 'Transporte',
    desc: 'Compara aerolíneas, rutas y diferentes opciones de vuelo.',
    busqueda: 'vuelos baratos a',
    color: 'azul',
  },
  {
    id: 'tours',
    nombre: 'Tours y actividades',
    icono: '🗺️',
    etiqueta: 'Experiencias',
    desc: 'Descubre tours, excursiones y actividades para disfrutar.',
    busqueda: 'tours y actividades en',
    color: 'lila',
  },
  {
    id: 'universidades',
    nombre: 'Universidades',
    icono: '🎓',
    etiqueta: 'Estudios',
    desc: 'Explora intercambios, universidades y oportunidades de estudio.',
    busqueda: 'programas de intercambio universitario en',
    color: 'lavanda',
  },
]

function Tienda({ irADashboard }) {
  const [destino, setDestino] = useState('')
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  useEffect(() => {
    const cargarDestino = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setCargando(false)
          return
        }

        const { data: viajes, error } = await supabase
          .from('viajes')
          .select('destino')
          .eq('user_id', user.id)
          .order('creado_en', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Error cargando destino:', error)
        }

        if (viajes && viajes.length > 0 && viajes[0].destino) {
          setDestino(viajes[0].destino)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarDestino()
  }, [])

  const abrirBusqueda = (terminos) => {
    const consulta = destino
      ? `${terminos} ${destino}`
      : terminos

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(consulta)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const abrirGoogleDestino = () => {
    const consulta = destino
      ? `viajes y servicios turísticos en ${destino}`
      : 'servicios para viajeros'

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(consulta)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const categoriasFiltradas = categorias.filter((categoria) => {
    const coincideCategoria =
      categoriaActiva === 'todas' ||
      categoria.id === categoriaActiva

    const textoBusqueda = busqueda.toLowerCase().trim()

    const coincideBusqueda =
      !textoBusqueda ||
      categoria.nombre.toLowerCase().includes(textoBusqueda) ||
      categoria.desc.toLowerCase().includes(textoBusqueda) ||
      categoria.etiqueta.toLowerCase().includes(textoBusqueda)

    return coincideCategoria && coincideBusqueda
  })

  const cantidadResultados = categoriasFiltradas.length

  if (cargando) {
    return (
      <div className="tienda tienda-cargando">
        <div className="tie-loader">
          <div className="tie-loader-icono">🛍️</div>

          <div className="tie-loader-avion">
            ✈
          </div>

          <p>Preparando tu tienda de viaje...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tienda">

      {/* DECORACIÓN DE FONDO */}
      <div className="tie-orb tie-orb-1"></div>
      <div className="tie-orb tie-orb-2"></div>
      <div className="tie-orb tie-orb-3"></div>

      {/* HEADER */}
      <header className="tie-header">

        <button
          className="tie-volver"
          onClick={irADashboard}
          type="button"
        >
          <span className="tie-volver-flecha">←</span>
          <span>Volver</span>
        </button>

        <div className="tie-logo">
          <span className="tie-logo-icono">✈</span>
          <span>MOVIXA</span>
        </div>

        <div className="tie-header-badge">
          <span>✦</span>
          Servicios para viajeros
        </div>

      </header>

      {/* HERO */}
      <section className="tie-hero">

        <div className="tie-hero-decoracion">
          <span className="tie-estrella estrella-1">✦</span>
          <span className="tie-estrella estrella-2">✧</span>
          <span className="tie-estrella estrella-3">✦</span>

          <span className="tie-nube nube-1">☁</span>
          <span className="tie-nube nube-2">☁</span>
        </div>

        <div className="tie-hero-contenido">

          <div className="tie-hero-etiqueta">
            <span>🛍️</span>
            MOVIXA MARKET
          </div>

          <h1>
            Todo para tu
            <strong> aventura</strong>
          </h1>

          <p>
            Encuentra servicios, experiencias y opciones
            que pueden ayudarte a preparar tu próximo viaje.
          </p>

          {destino ? (
            <div className="tie-destino-hero">
              <span className="tie-destino-hero-icono">
                📍
              </span>

              <div>
                <small>Tu próximo destino</small>
                <strong>{destino}</strong>
              </div>

              <span className="tie-mini-avion">
                ✈️
              </span>
            </div>
          ) : (
            <div className="tie-sin-destino">
              <span>🌎</span>
              <div>
                <strong>¿Todavía no tienes destino?</strong>
                <small>
                  Puedes explorar las opciones igualmente.
                </small>
              </div>
            </div>
          )}

        </div>

        {/* ILUSTRACIÓN */}
        <div className="tie-hero-ilustracion">

          <div className="tie-bolsa">
            <div className="tie-bolsa-asa"></div>

            <div className="tie-bolsa-cuerpo">
              <span>✈</span>
              <strong>MOVIXA</strong>
            </div>

            <div className="tie-bolsa-rueda rueda-1"></div>
            <div className="tie-bolsa-rueda rueda-2"></div>
          </div>

          <div className="tie-producto producto-1">
            🧳
          </div>

          <div className="tie-producto producto-2">
            🎫
          </div>

          <div className="tie-producto producto-3">
            🌎
          </div>

          <div className="tie-ruta-hero"></div>

        </div>

      </section>

      {/* DESTINO CTA */}
      <section className="tie-destino-card">

        <div className="tie-destino-card-icono">
          {destino ? '✈️' : '🌍'}
        </div>

        <div className="tie-destino-card-texto">

          <span>
            {destino
              ? 'EXPLORA SERVICIOS PARA TU DESTINO'
              : 'EXPLORA SERVICIOS DE VIAJE'}
          </span>

          <h2>
            {destino
              ? `Prepárate para ${destino}`
              : 'Prepara tu próxima aventura'}
          </h2>

          <p>
            {destino
              ? 'Busca opciones relacionadas específicamente con tu destino.'
              : 'Cuando tengas un destino, MOVIXA podrá ayudarte a buscar opciones relacionadas.'}
          </p>

        </div>

        <button
          type="button"
          className="tie-destino-boton"
          onClick={abrirGoogleDestino}
        >
          Explorar
          <span>→</span>
        </button>

      </section>

      {/* TÍTULO */}
      <section className="tie-seccion-heading">

        <div>
          <span className="tie-heading-linea"></span>

          <div>
            <span className="tie-heading-mini">
              DESCUBRE
            </span>

            <h2>
              ¿Qué estás buscando?
            </h2>
          </div>
        </div>

        <span className="tie-resultados">
          {cantidadResultados}{' '}
          {cantidadResultados === 1
            ? 'opción'
            : 'opciones'}
        </span>

      </section>

      {/* BÚSQUEDA + FILTROS */}
      <section className="tie-controles">

        <div className="tie-busqueda">

          <span className="tie-busqueda-icono">
            ⌕
          </span>

          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            placeholder="Buscar un servicio..."
          />

          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="tie-busqueda-limpiar"
            >
              ×
            </button>
          )}

        </div>

        <div className="tie-filtros">

          <button
            type="button"
            className={
              categoriaActiva === 'todas'
                ? 'activo'
                : ''
            }
            onClick={() =>
              setCategoriaActiva('todas')
            }
          >
            Todo
          </button>

          <button
            type="button"
            className={
              categoriaActiva === 'vuelos'
                ? 'activo'
                : ''
            }
            onClick={() =>
              setCategoriaActiva('vuelos')
            }
          >
            ✈️ Vuelos
          </button>

          <button
            type="button"
            className={
              categoriaActiva === 'hoteles'
                ? 'activo'
                : ''
            }
            onClick={() =>
              setCategoriaActiva('hoteles')
            }
          >
            🏨 Hoteles
          </button>

          <button
            type="button"
            className={
              categoriaActiva === 'tours'
                ? 'activo'
                : ''
            }
            onClick={() =>
              setCategoriaActiva('tours')
            }
          >
            🗺️ Experiencias
          </button>

          <button
            type="button"
            className={
              categoriaActiva === 'seguros'
                ? 'activo'
                : ''
            }
            onClick={() =>
              setCategoriaActiva('seguros')
            }
          >
            🛡️ Protección
          </button>

        </div>

      </section>

      {/* TARJETAS */}
      <section className="tie-grid">

        {categoriasFiltradas.length === 0 ? (

          <div className="tie-vacio">

            <div className="tie-vacio-icono">
              🔎
            </div>

            <h3>
              No encontramos esa opción
            </h3>

            <p>
              Prueba con otra búsqueda o revisa todas
              las categorías disponibles.
            </p>

            <button
              type="button"
              onClick={() => {
                setBusqueda('')
                setCategoriaActiva('todas')
              }}
            >
              Ver todas las opciones
            </button>

          </div>

        ) : (

          categoriasFiltradas.map((cat, index) => (

            <article
              key={cat.id}
              className={`tie-tarjeta tie-${cat.color}`}
            >

              <div className="tie-tarjeta-brillo"></div>

              <div className="tie-tarjeta-top">

                <span className="tie-tarjeta-etiqueta">
                  {cat.etiqueta}
                </span>

                <span className="tie-tarjeta-numero">
                  {String(index + 1).padStart(2, '0')}
                </span>

              </div>

              <div className="tie-icono">

                <span>
                  {cat.icono}
                </span>

              </div>

              <div className="tie-nombre">
                {cat.nombre}
              </div>

              <div className="tie-desc">
                {cat.desc}
              </div>

              <div className="tie-tarjeta-ruta">

                <span></span>
                <div></div>
                <span>✈</span>

              </div>

              <button
                className="tie-boton"
                type="button"
                onClick={() =>
                  abrirBusqueda(cat.busqueda)
                }
              >
                <span>
                  Explorar opciones
                </span>

                <b>→</b>
              </button>

            </article>

          ))

        )}

      </section>

      {/* INFORMACIÓN */}
      <section className="tie-info">

        <div className="tie-info-icono">
          💜
        </div>

        <div className="tie-info-texto">

          <strong>
            MOVIXA te ayuda a encontrar opciones
          </strong>

          <p>
            Actualmente estos servicios se buscan
            directamente en la web. MOVIXA todavía no
            tiene alianzas comerciales propias ni
            procesa pagos desde esta sección.
          </p>

        </div>

        <div className="tie-info-sello">
          <span>✦</span>
          MOVIXA
          <small>TRAVEL</small>
        </div>

      </section>

      {/* FRASE FINAL */}
      <section className="tie-final">

        <div className="tie-final-avion">
          ✈
        </div>

        <div className="tie-final-linea"></div>

        <div className="tie-final-texto">

          <span>
            YOUR JOURNEY STARTS HERE
          </span>

          <strong>
            Encuentra. Prepara. Viaja.
          </strong>

        </div>

        <div className="tie-final-estrellas">
          ✦ ✧ ✦
        </div>

      </section>

    </div>
  )
}

export default Tienda