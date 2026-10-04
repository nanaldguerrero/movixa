import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Wishlist.css'

const destinosIniciales = [
  {
    id: 1,
    pais: 'Japón',
    emoji: '🇯🇵',
    nota: 'Cerezos en flor, primavera',
  },
  {
    id: 2,
    pais: 'Italia',
    emoji: '🇮🇹',
    nota: 'Comida y arquitectura',
  },
  {
    id: 3,
    pais: 'Canadá',
    emoji: '🇨🇦',
    nota: 'Naturaleza y auroras',
  },
]

function Wishlist({
  irADashboard,
  irACrearViajeDesde,
  irADetalle,
}) {
  const [destinos, setDestinos] = useState(destinosIniciales)
  const [nuevoPais, setNuevoPais] = useState('')
  const [userId, setUserId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [viajesExistentes, setViajesExistentes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState('todos')

  useEffect(() => {
    const cargar = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setCargando(false)
          return
        }

        setUserId(user.id)

        const { data: perfil } = await supabase
          .from('perfiles')
          .select('wishlist')
          .eq('id', user.id)
          .single()

        if (
          perfil &&
          Array.isArray(perfil.wishlist) &&
          perfil.wishlist.length > 0
        ) {
          setDestinos(perfil.wishlist)
        }

        const { data: viajes } = await supabase
          .from('viajes')
          .select('id, destino')
          .eq('user_id', user.id)

        setViajesExistentes(viajes || [])
      } catch (error) {
        console.error('Error cargando wishlist:', error)
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  const guardar = async (nuevosDestinos) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('perfiles')
        .upsert({
          id: userId,
          wishlist: nuevosDestinos,
        })

      if (error) {
        console.error('Error guardando wishlist:', error)
      }
    } catch (error) {
      console.error('Error guardando wishlist:', error)
    }
  }

  const agregarDestino = async () => {
    const nombre = nuevoPais.trim()

    if (!nombre) return

    const yaExiste = destinos.some(
      (destino) =>
        destino.pais.toLowerCase() === nombre.toLowerCase()
    )

    if (yaExiste) {
      setNuevoPais('')
      return
    }

    const nuevo = [
      ...destinos,
      {
        id: Date.now(),
        pais: nombre,
        emoji: '🌍',
        nota: '',
      },
    ]

    setDestinos(nuevo)
    await guardar(nuevo)
    setNuevoPais('')
  }

  const eliminarDestino = async (id) => {
    const nuevo = destinos.filter(
      (destino) => destino.id !== id
    )

    setDestinos(nuevo)
    await guardar(nuevo)
  }

  const obtenerViaje = (pais) => {
    return viajesExistentes.find(
      (viaje) =>
        viaje.destino &&
        viaje.destino.toLowerCase() === pais.toLowerCase()
    )
  }

  const destinosFiltrados = destinos.filter((destino) => {
    const coincideBusqueda = destino.pais
      .toLowerCase()
      .includes(busqueda.toLowerCase())

    const viaje = obtenerViaje(destino.pais)

    if (vista === 'planeados') {
      return coincideBusqueda && viaje
    }

    if (vista === 'pendientes') {
      return coincideBusqueda && !viaje
    }

    return coincideBusqueda
  })

  const cantidadPlaneados = destinos.filter((destino) =>
    obtenerViaje(destino.pais)
  ).length

  const cantidadPendientes = destinos.length - cantidadPlaneados

  if (cargando) {
    return (
      <div className="wishlist wishlist-cargando">
        <div className="wl-loader">
          <div className="wl-loader-avion">✈️</div>
          <div className="wl-loader-linea"></div>
          <p>Cargando tus destinos soñados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist">

      {/* FONDO DECORATIVO */}
      <div className="wl-fondo-orb wl-orb-1"></div>
      <div className="wl-fondo-orb wl-orb-2"></div>
      <div className="wl-fondo-orb wl-orb-3"></div>

      {/* HEADER */}
      <header className="wl-header">

        <button
          className="wl-volver"
          onClick={irADashboard}
          type="button"
        >
          <span className="wl-volver-icono">←</span>
          <span>Volver</span>
        </button>

        <div className="wl-logo">
          <span className="wl-logo-avion">✈</span>
          <span>MOVIXA</span>
        </div>

        <div className="wl-header-badge">
          <span>✦</span>
          Mis sueños
        </div>
      </header>

      {/* HERO */}
      <section className="wl-hero">

        <div className="wl-hero-decoracion">
          <span className="wl-nube nube-1">☁</span>
          <span className="wl-nube nube-2">☁</span>
          <span className="wl-estrellita estrella-1">✦</span>
          <span className="wl-estrellita estrella-2">✧</span>
          <span className="wl-estrellita estrella-3">✦</span>
        </div>

        <div className="wl-hero-texto">

          <div className="wl-etiqueta">
            <span>✈</span>
            TRAVEL DREAMS
          </div>

          <h1>
            Mis destinos
            <strong> soñados</strong>
          </h1>

          <p>
            Guarda esos lugares que algún día quieres conocer.
            Tu próxima aventura puede estar aquí.
          </p>

        </div>

        <div className="wl-hero-ilustracion">

          <div className="wl-planeta">
            <span>🌎</span>
          </div>

          <div className="wl-ruta ruta-1"></div>
          <div className="wl-ruta ruta-2"></div>

          <div className="wl-mini-avion">
            ✈
          </div>

          <div className="wl-sello">
            DREAM
            <span>TRIP</span>
          </div>

        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="wl-estadisticas">

        <div className="wl-stat">
          <div className="wl-stat-icono">🌎</div>
          <div>
            <strong>{destinos.length}</strong>
            <span>Destinos soñados</span>
          </div>
        </div>

        <div className="wl-stat">
          <div className="wl-stat-icono">✈️</div>
          <div>
            <strong>{cantidadPlaneados}</strong>
            <span>Viajes creados</span>
          </div>
        </div>

        <div className="wl-stat">
          <div className="wl-stat-icono">💭</div>
          <div>
            <strong>{cantidadPendientes}</strong>
            <span>Esperando aventura</span>
          </div>
        </div>

      </section>

      {/* AGREGAR DESTINO */}
      <section className="wl-agregar-seccion">

        <div className="wl-seccion-titulo">
          <div>
            <span className="wl-seccion-icono">✨</span>
            <div>
              <h2>Agrega un nuevo sueño</h2>
              <p>¿A dónde te gustaría viajar algún día?</p>
            </div>
          </div>
        </div>

        <div className="wl-agregar">

          <div className="wl-input-contenedor">

            <span className="wl-input-icono">
              🌍
            </span>

            <input
              type="text"
              placeholder="Escribe un país o destino..."
              className="wl-input"
              value={nuevoPais}
              onChange={(e) => setNuevoPais(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  agregarDestino()
                }
              }}
            />

            {nuevoPais && (
              <button
                type="button"
                className="wl-limpiar-input"
                onClick={() => setNuevoPais('')}
              >
                ×
              </button>
            )}

          </div>

          <button
            className="wl-boton-agregar"
            onClick={agregarDestino}
            type="button"
          >
            <span>＋</span>
            Agregar destino
          </button>

        </div>

      </section>

      {/* FILTROS */}
      <section className="wl-controles">

        <div className="wl-busqueda">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Buscar en mis destinos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
            >
              ×
            </button>
          )}

        </div>

        <div className="wl-filtros">

          <button
            type="button"
            className={vista === 'todos' ? 'activo' : ''}
            onClick={() => setVista('todos')}
          >
            Todos
            <span>{destinos.length}</span>
          </button>

          <button
            type="button"
            className={vista === 'pendientes' ? 'activo' : ''}
            onClick={() => setVista('pendientes')}
          >
            Por cumplir
            <span>{cantidadPendientes}</span>
          </button>

          <button
            type="button"
            className={vista === 'planeados' ? 'activo' : ''}
            onClick={() => setVista('planeados')}
          >
            Planeados
            <span>{cantidadPlaneados}</span>
          </button>

        </div>

      </section>

      {/* DESTINOS */}
      <section className="wl-destinos">

        <div className="wl-destinos-heading">

          <div>
            <span className="wl-destinos-linea"></span>
            <h2>
              {vista === 'todos'
                ? 'Tus próximas historias'
                : vista === 'planeados'
                  ? 'Sueños que ya comenzaron'
                  : 'Destinos por descubrir'}
            </h2>
          </div>

          <span className="wl-contador">
            {destinosFiltrados.length}{' '}
            {destinosFiltrados.length === 1
              ? 'destino'
              : 'destinos'}
          </span>

        </div>

        {destinosFiltrados.length === 0 ? (

          <div className="wl-vacio">

            <div className="wl-vacio-ilustracion">
              <span>🧳</span>
              <div>✦</div>
            </div>

            <h3>
              {busqueda
                ? 'No encontramos ese destino'
                : 'Todavía no hay destinos aquí'}
            </h3>

            <p>
              {busqueda
                ? 'Prueba con otro nombre o limpia la búsqueda.'
                : 'Agrega un lugar que quieras conocer y empieza a construir tu lista de sueños.'}
            </p>

            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
              >
                Ver todos los destinos
              </button>
            )}

          </div>

        ) : (

          <div className="wl-grid">

            {destinosFiltrados.map((destino, index) => {

              const viajeExistente =
                obtenerViaje(destino.pais)

              return (
                <article
                  key={destino.id}
                  className={`wl-tarjeta ${
                    viajeExistente
                      ? 'wl-tarjeta-planeada'
                      : ''
                  }`}
                >

                  {/* DECORACIÓN POSTAL */}
                  <div className="wl-tarjeta-linea"></div>

                  <div className="wl-tarjeta-corner corner-1"></div>
                  <div className="wl-tarjeta-corner corner-2"></div>

                  {/* ELIMINAR */}
                  <button
                    type="button"
                    className="wl-eliminar"
                    onClick={() =>
                      eliminarDestino(destino.id)
                    }
                    title="Eliminar destino"
                    aria-label={`Eliminar ${destino.pais}`}
                  >
                    ×
                  </button>

                  {/* SELLO */}
                  <div
                    className={`wl-sello-tarjeta ${
                      viajeExistente
                        ? 'sello-planeado'
                        : ''
                    }`}
                  >
                    {viajeExistente ? (
                      <>
                        <span>✈</span>
                        PLANEADO
                      </>
                    ) : (
                      <>
                        <span>✦</span>
                        WISH
                      </>
                    )}
                  </div>

                  {/* PAÍS */}
                  <div className="wl-tarjeta-destino">

                    <div className="wl-destino-icono">
                      {destino.emoji || '🌍'}
                    </div>

                    <div className="wl-pais-info">

                      <span className="wl-pais-mini">
                        DESTINATION
                      </span>

                      <h3>{destino.pais}</h3>

                    </div>

                  </div>

                  {/* NOTA */}
                  <div className="wl-tarjeta-nota">

                    {destino.nota ? (
                      <>
                        <span className="wl-nota-comillas">
                          “
                        </span>
                        <p>{destino.nota}</p>
                      </>
                    ) : (
                      <p className="wl-nota-vacia">
                        Un nuevo lugar espera por ti...
                      </p>
                    )}

                  </div>

                  {/* RUTA */}
                  <div className="wl-tarjeta-ruta">

                    <span className="wl-ruta-punto"></span>

                    <div className="wl-ruta-punteada"></div>

                    <span className="wl-ruta-avion">
                      ✈
                    </span>

                  </div>

                  {/* ACCIÓN */}
                  <div className="wl-tarjeta-footer">

                    {viajeExistente ? (

                      <button
                        type="button"
                        className="wl-boton-viaje wl-boton-viaje-existente"
                        onClick={() =>
                          irADetalle(viajeExistente.id)
                        }
                      >
                        <span>📍</span>
                        Ver mi viaje
                        <b>→</b>
                      </button>

                    ) : (

                      <button
                        type="button"
                        className="wl-boton-viaje"
                        onClick={() =>
                          irACrearViajeDesde(
                            destino.pais
                          )
                        }
                      >
                        <span>✈️</span>
                        Crear viaje
                        <b>→</b>
                      </button>

                    )}

                  </div>

                  <div className="wl-numero">
                    #{String(index + 1).padStart(2, '0')}
                  </div>

                </article>
              )
            })}

          </div>
        )}

      </section>

      {/* FRASE FINAL */}
      <section className="wl-final">

        <div className="wl-final-avion">
          ✈
        </div>

        <div className="wl-final-linea"></div>

        <div className="wl-final-texto">
          <span>EVERY DREAM STARTS SOMEWHERE</span>
          <strong>
            Tu próxima historia todavía no está escrita.
          </strong>
        </div>

        <div className="wl-final-estrellas">
          ✦ ✧ ✦
        </div>

      </section>

    </div>
  )
}

export default Wishlist