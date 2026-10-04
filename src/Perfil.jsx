import { useState, useEffect } from 'react'
import { useConfiguracion } from './ConfiguracionContext'
import { supabase } from './supabaseClient'
import './Perfil.css'

const climasDisponibles = [
  'Cálido',
  'Frío',
  'Templado',
  'Nevado',
  'Cualquiera',
]

const tiposDestinoDisponibles = [
  'Playa',
  'Ciudad',
  'Naturaleza',
  'Montaña',
  'Isla',
]

const interesesCatalogo = [
  'Gastronomía',
  'Fotografía',
  'Historia',
  'Deportes',
  'Compras',
  'Vida nocturna',
  'Música',
  'Arte',
  'Animales',
  'Bienestar',
  'Senderismo',
  'Buceo',
]

const companeros = [
  { id: 'perro', emoji: '🐶', nombre: 'Perro' },
  { id: 'gato', emoji: '🐱', nombre: 'Gato' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga' },
  { id: 'ninguno', emoji: '🚫', nombre: 'Ninguno' },
]

const tiposSangre = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'No sé',
]

function Perfil({ irADashboard, irAConfiguracion }) {
  const { companero, setCompanero } = useConfiguracion()

  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [userId, setUserId] = useState(null)

  // -----------------------------------------
  // DATOS DEL PERFIL
  // -----------------------------------------

  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [nacimiento, setNacimiento] = useState('')
  const [nacionalidad, setNacionalidad] = useState('')

  const [pasaportes, setPasaportes] = useState([])
  const [nuevoPasaporte, setNuevoPasaporte] = useState('')

  const [idiomas, setIdiomas] = useState([])
  const [nuevoIdioma, setNuevoIdioma] = useState('')

  const [climas, setClimas] = useState([])
  const [tiposDestino, setTiposDestino] = useState([])
  const [intereses, setIntereses] = useState([])
  const [ritmo, setRitmo] = useState('')

  const [viajesRealizados, setViajesRealizados] = useState(0)

  const [contactos, setContactos] = useState([])
  const [nuevoContactoNombre, setNuevoContactoNombre] = useState('')
  const [nuevoContactoTelefono, setNuevoContactoTelefono] = useState('')

  const [moneda, setMoneda] = useState('CRC')
  const [unidadDistancia, setUnidadDistancia] = useState('km')
  const [unidadTemp, setUnidadTemp] = useState('C')

  const [tipoSangre, setTipoSangre] = useState('')
  const [alergias, setAlergias] = useState('')
  const [condicionesMedicas, setCondicionesMedicas] = useState('')
  const [medicamentos, setMedicamentos] = useState('')

  // -----------------------------------------
  // SECCIONES ABIERTAS
  // -----------------------------------------

  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    personal: true,
    documentos: true,
    gustos: true,
    seguridad: false,
    preferencias: false,
  })

  // -----------------------------------------
  // CARGAR DATOS
  // -----------------------------------------

  useEffect(() => {
    const cargar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setCargando(false)
        return
      }

      setUserId(user.id)
      setCorreo(user.email || '')

      const { data } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setNombre(data.nombre_completo || '')
        setUsuario(data.nombre_usuario || '')
        setCelular(data.celular || '')
        setNacimiento(data.fecha_nacimiento || '')
        setNacionalidad(data.nacionalidad || '')

        setPasaportes(data.pasaportes || [])
        setIdiomas(data.idiomas || [])

        setClimas(data.climas || [])
        setTiposDestino(data.tipos_destino || [])
        setIntereses(data.intereses || [])
        setRitmo(data.ritmo || '')

        setViajesRealizados(data.viajes_realizados || 0)

        setContactos(data.contactos_emergencia || [])

        setMoneda(data.moneda || 'CRC')
        setUnidadDistancia(data.unidad_distancia || 'km')
        setUnidadTemp(data.unidad_temp || 'C')

        setTipoSangre(data.tipo_sangre || '')
        setAlergias(data.alergias || '')
        setCondicionesMedicas(data.condiciones_medicas || '')
        setMedicamentos(data.medicamentos || '')

        if (data.companero) {
          setCompanero(data.companero)
        }
      }

      setCargando(false)
    }

    cargar()
  }, [])

  // -----------------------------------------
  // GUARDAR EN SUPABASE
  // -----------------------------------------

  const guardarEnSupabase = async () => {
    if (!userId) return

    setGuardando(true)

    await supabase.from('perfiles').upsert({
      id: userId,

      nombre_completo: nombre,
      nombre_usuario: usuario,
      correo: correo,
      celular: celular,
      fecha_nacimiento: nacimiento,
      nacionalidad: nacionalidad,

      companero: companero,

      pasaportes: pasaportes,
      idiomas: idiomas,

      climas: climas,
      tipos_destino: tiposDestino,
      intereses: intereses,
      ritmo: ritmo,

      viajes_realizados: viajesRealizados,

      contactos_emergencia: contactos,

      moneda: moneda,
      unidad_distancia: unidadDistancia,
      unidad_temp: unidadTemp,

      tipo_sangre: tipoSangre,
      alergias: alergias,
      condiciones_medicas: condicionesMedicas,
      medicamentos: medicamentos,
    })

    setGuardando(false)
  }

  // -----------------------------------------
  // EDITAR
  // -----------------------------------------

  const toggleEditar = async () => {
    if (editando) {
      await guardarEnSupabase()
    }

    setEditando(!editando)
  }

  // -----------------------------------------
  // SECCIONES
  // -----------------------------------------

  const toggleSeccion = (seccion) => {
    setSeccionesAbiertas((actual) => ({
      ...actual,
      [seccion]: !actual[seccion],
    }))
  }

  // -----------------------------------------
  // PASAPORTES
  // -----------------------------------------

  const agregarPasaporte = () => {
    if (nuevoPasaporte.trim() === '') return

    setPasaportes([
      ...pasaportes,
      nuevoPasaporte.trim(),
    ])

    setNuevoPasaporte('')
  }

  // -----------------------------------------
  // IDIOMAS
  // -----------------------------------------

  const agregarIdioma = () => {
    if (nuevoIdioma.trim() === '') return

    setIdiomas([
      ...idiomas,
      nuevoIdioma.trim(),
    ])

    setNuevoIdioma('')
  }

  // -----------------------------------------
  // LISTAS
  // -----------------------------------------

  const toggleEnLista = (valor, lista, setLista) => {
    if (lista.includes(valor)) {
      setLista(lista.filter((v) => v !== valor))
    } else {
      setLista([...lista, valor])
    }
  }

  // -----------------------------------------
  // CONTACTOS
  // -----------------------------------------

  const agregarContacto = () => {
    if (
      nuevoContactoNombre.trim() === '' ||
      nuevoContactoTelefono.trim() === ''
    ) {
      return
    }

    setContactos([
      ...contactos,
      {
        id: Date.now(),
        nombre: nuevoContactoNombre.trim(),
        telefono: nuevoContactoTelefono.trim(),
      },
    ])

    setNuevoContactoNombre('')
    setNuevoContactoTelefono('')
  }

  // -----------------------------------------
  // PERFIL COMPLETADO
  // -----------------------------------------

  const camposPerfil = [
    nombre,
    usuario,
    celular,
    nacimiento,
    nacionalidad,
    pasaportes.length > 0,
    idiomas.length > 0,
    climas.length > 0,
    tiposDestino.length > 0,
    intereses.length > 0,
    ritmo,
    contactos.length > 0,
    moneda,
  ]

  const camposCompletos = camposPerfil.filter(Boolean).length

  const porcentajePerfil = Math.round(
    (camposCompletos / camposPerfil.length) * 100
  )

  // -----------------------------------------
  // NIVEL DEL VIAJERO
  // -----------------------------------------

  const obtenerNivelViajero = () => {
    if (viajesRealizados >= 10) {
      return {
        icono: '🌎',
        nombre: 'Viajero global',
        descripcion: 'El mundo es tu próximo destino',
      }
    }

    if (viajesRealizados >= 5) {
      return {
        icono: '🧭',
        nombre: 'Gran explorador',
        descripcion: 'Siempre buscando una nueva aventura',
      }
    }

    if (viajesRealizados >= 3) {
      return {
        icono: '✈️',
        nombre: 'Explorador',
        descripcion: 'Cada viaje tiene una nueva historia',
      }
    }

    if (viajesRealizados >= 1) {
      return {
        icono: '🧳',
        nombre: 'Viajero',
        descripcion: 'Tus aventuras ya comenzaron',
      }
    }

    return {
      icono: '🌱',
      nombre: 'Soñador viajero',
      descripcion: 'Tu primera aventura está por comenzar',
    }
  }

  const nivelViajero = obtenerNivelViajero()

  // -----------------------------------------
  // LOGROS
  // -----------------------------------------

  const logros = [
    {
      id: 'primera-aventura',
      icono: '✈️',
      titulo: 'Primera aventura',
      descripcion: 'Has realizado al menos un viaje',
      desbloqueado: viajesRealizados >= 1,
    },
    {
      id: 'pasaporte',
      icono: '🛂',
      titulo: 'Listo para explorar',
      descripcion: 'Agregaste un pasaporte',
      desbloqueado: pasaportes.length >= 1,
    },
    {
      id: 'idiomas',
      icono: '🗣️',
      titulo: 'Viajero internacional',
      descripcion: 'Hablas más de un idioma',
      desbloqueado: idiomas.length >= 2,
    },
    {
      id: 'aventurero',
      icono: '🥾',
      titulo: 'Espíritu aventurero',
      descripcion: 'Te gusta el senderismo',
      desbloqueado: intereses.includes('Senderismo'),
    },
    {
      id: 'recuerdos',
      icono: '📸',
      titulo: 'Cazador de recuerdos',
      descripcion: 'Te gusta la fotografía',
      desbloqueado: intereses.includes('Fotografía'),
    },
    {
      id: 'playa',
      icono: '🏖️',
      titulo: 'Alma playera',
      descripcion: 'La playa está entre tus destinos',
      desbloqueado: tiposDestino.includes('Playa'),
    },
    {
      id: 'montaña',
      icono: '⛰️',
      titulo: 'Amante de las alturas',
      descripcion: 'Te gustan las montañas',
      desbloqueado: tiposDestino.includes('Montaña'),
    },
  ]

  const logrosDesbloqueados = logros.filter(
    (logro) => logro.desbloqueado
  )

  // -----------------------------------------
  // MASCOTA
  // -----------------------------------------

  const mascotaActual =
    companeros.find((c) => c.id === companero) || companeros[0]

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (cargando) {
    return (
      <div className="perfil perfil-cargando">
        <div className="perfil-loader-avion">✈️</div>
        <p>Preparando tu perfil viajero...</p>
      </div>
    )
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <div className="perfil">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="perfil-header">

        <button
          className="perfil-volver"
          onClick={irADashboard}
        >
          <span>←</span>
          Volver
        </button>

        <div className="perfil-logo">
          MOVIXA
        </div>

        <div className="perfil-header-icon">
          ✈️
        </div>

      </div>

      {/* =====================================
          TARJETA PRINCIPAL
      ====================================== */}

      <div className="perfil-portada">

        <div className="perfil-ruta-decorativa">
          <span>•</span>
          <span>•</span>
          <span>•</span>
          <span>✈</span>
        </div>

        <div className="perfil-saludo">
          TU PASAPORTE DIGITAL
        </div>

        <div className="perfil-avatar-contenedor">

          <div className="perfil-avatar">
            {mascotaActual.emoji}
          </div>

          <div className="perfil-avatar-badge">
            ✨
          </div>

        </div>

        {editando && (
          <div className="perfil-companero-selector">

            <span className="perfil-selector-titulo">
              Elige tu compañero
            </span>

            <div className="perfil-companeros">

              {companeros.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.nombre}
                  className={`perfil-companero-btn ${
                    companero === c.id
                      ? 'perfil-companero-activo'
                      : ''
                  }`}
                  onClick={() => setCompanero(c.id)}
                >
                  {c.emoji}
                </button>
              ))}

            </div>

          </div>
        )}

        {editando ? (
          <input
            className="perfil-input-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        ) : (
          <h2 className="perfil-nombre">
            {nombre || 'Tu nombre'}
          </h2>
        )}

        <p className="perfil-usuario">
          @{usuario || 'usuario'}
        </p>

        <div className="perfil-nivel">

          <span className="perfil-nivel-icono">
            {nivelViajero.icono}
          </span>

          <div>
            <strong>{nivelViajero.nombre}</strong>
            <small>{nivelViajero.descripcion}</small>
          </div>

        </div>

        <button
          className="perfil-boton-editar"
          onClick={toggleEditar}
          disabled={guardando}
        >
          {guardando
            ? 'Guardando...'
            : editando
              ? '✓ Guardar cambios'
              : '✏️ Editar perfil'}
        </button>

      </div>

      {/* =====================================
          PROGRESO DEL PERFIL
      ====================================== */}

      <div className="perfil-progreso-card">

        <div className="perfil-progreso-top">

          <div>
            <span className="perfil-mini-etiqueta">
              TU PERFIL MOVIXA
            </span>

            <h3>
              {porcentajePerfil === 100
                ? '¡Perfil completo! 🎉'
                : 'Completa tu perfil'}
            </h3>
          </div>

          <div className="perfil-progreso-numero">
            {porcentajePerfil}%
          </div>

        </div>

        <div className="perfil-progreso-barra">
          <div
            className="perfil-progreso-fill"
            style={{ width: `${porcentajePerfil}%` }}
          />
        </div>

        <p>
          {porcentajePerfil === 100
            ? 'MOVIXA ya conoce tus preferencias para ayudarte a planear tus aventuras.'
            : 'Mientras más información agregues, más personalizada puede ser tu experiencia.'}
        </p>

      </div>

      {/* =====================================
          ESTADÍSTICAS
      ====================================== */}

      <div className="perfil-stats">

        <div className="perfil-stat">

          {editando ? (
            <input
              type="number"
              min="0"
              className="perfil-stat-input"
              value={viajesRealizados}
              onChange={(e) =>
                setViajesRealizados(
                  Math.max(0, Number(e.target.value))
                )
              }
            />
          ) : (
            <div className="perfil-stat-icono">
              ✈️
            </div>
          )}

          <div className="perfil-stat-num">
            {viajesRealizados}
          </div>

          <div className="perfil-stat-label">
            Viajes
          </div>

        </div>

        <div className="perfil-stat">

          <div className="perfil-stat-icono">
            🛂
          </div>

          <div className="perfil-stat-num">
            {pasaportes.length}
          </div>

          <div className="perfil-stat-label">
            Pasaportes
          </div>

        </div>

        <div className="perfil-stat">

          <div className="perfil-stat-icono">
            💬
          </div>

          <div className="perfil-stat-num">
            {idiomas.length}
          </div>

          <div className="perfil-stat-label">
            Idiomas
          </div>

        </div>

      </div>

      {/* =====================================
          LOGROS
      ====================================== */}

      <div className="perfil-logros-card">

        <div className="perfil-titulo-bloque">

          <div>
            <span className="perfil-mini-etiqueta">
              COLECCIÓN
            </span>

            <h3>
              🏆 Mis logros
            </h3>
          </div>

          <span className="perfil-logros-contador">
            {logrosDesbloqueados.length}/{logros.length}
          </span>

        </div>

        <div className="perfil-logros">

          {logros.map((logro) => (
            <div
              key={logro.id}
              className={`perfil-logro ${
                logro.desbloqueado
                  ? 'perfil-logro-desbloqueado'
                  : 'perfil-logro-bloqueado'
              }`}
              title={logro.descripcion}
            >

              <div className="perfil-logro-icono">
                {logro.desbloqueado
                  ? logro.icono
                  : '🔒'}
              </div>

              <strong>
                {logro.titulo}
              </strong>

              <small>
                {logro.desbloqueado
                  ? logro.descripcion
                  : 'Sigue explorando'}
              </small>

            </div>
          ))}

        </div>

      </div>

      {/* =====================================
          INFORMACIÓN PERSONAL
      ====================================== */}

      <div className="perfil-seccion-wrapper">

        <button
          className="perfil-seccion-cabecera"
          onClick={() => toggleSeccion('personal')}
        >

          <div className="perfil-seccion-titulo">

            <span className="perfil-seccion-icono">
              👤
            </span>

            <div>
              <strong>Información personal</strong>
              <small>
                Tu información básica
              </small>
            </div>

          </div>

          <span className="perfil-flecha">
            {seccionesAbiertas.personal ? '⌃' : '⌄'}
          </span>

        </button>

        {seccionesAbiertas.personal && (
          <div className="perfil-seccion-contenido perfil-seccion-morada">

            {editando ? (
              <>

                <label className="perfil-campo-label">
                  Nombre de usuario
                </label>

                <input
                  className="perfil-campo-input"
                  value={usuario}
                  onChange={(e) =>
                    setUsuario(e.target.value)
                  }
                  placeholder="Ej: adriana_travels"
                />

                <label className="perfil-campo-label">
                  Correo
                </label>

                <input
                  className="perfil-campo-input"
                  value={correo}
                  disabled
                />

                <label className="perfil-campo-label">
                  Número de celular
                </label>

                <input
                  className="perfil-campo-input"
                  value={celular}
                  onChange={(e) =>
                    setCelular(e.target.value)
                  }
                  placeholder="Ej: 8888-8888"
                />

                <label className="perfil-campo-label">
                  Fecha de nacimiento
                </label>

                <input
                  type="date"
                  className="perfil-campo-input"
                  value={nacimiento}
                  onChange={(e) =>
                    setNacimiento(e.target.value)
                  }
                />

                <label className="perfil-campo-label">
                  Nacionalidad
                </label>

                <input
                  className="perfil-campo-input"
                  value={nacionalidad}
                  onChange={(e) =>
                    setNacionalidad(e.target.value)
                  }
                  placeholder="Ej: Costarricense"
                />

              </>
            ) : (
              <>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Nombre completo
                  </span>

                  <span className="perfil-dato-valor">
                    {nombre || '—'}
                  </span>
                </div>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Usuario
                  </span>

                  <span className="perfil-dato-valor">
                    @{usuario || '—'}
                  </span>
                </div>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Correo
                  </span>

                  <span className="perfil-dato-valor">
                    {correo || '—'}
                  </span>
                </div>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Celular
                  </span>

                  <span className="perfil-dato-valor">
                    {celular || '—'}
                  </span>
                </div>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Fecha de nacimiento
                  </span>

                  <span className="perfil-dato-valor">
                    {nacimiento || '—'}
                  </span>
                </div>

                <div className="perfil-dato">
                  <span className="perfil-dato-label">
                    Nacionalidad
                  </span>

                  <span className="perfil-dato-valor">
                    {nacionalidad || '—'}
                  </span>
                </div>

              </>
            )}

          </div>
        )}

      </div>

      {/* =====================================
          DOCUMENTOS E IDIOMAS
      ====================================== */}

      <div className="perfil-seccion-wrapper">

        <button
          className="perfil-seccion-cabecera"
          onClick={() => toggleSeccion('documentos')}
        >

          <div className="perfil-seccion-titulo">

            <span className="perfil-seccion-icono">
              🛂
            </span>

            <div>
              <strong>Documentos e idiomas</strong>
              <small>
                Información para tus viajes
              </small>
            </div>

          </div>

          <span className="perfil-flecha">
            {seccionesAbiertas.documentos ? '⌃' : '⌄'}
          </span>

        </button>

        {seccionesAbiertas.documentos && (
          <div className="perfil-seccion-contenido">

            {/* PASAPORTES */}

            <div className="perfil-subseccion">

              <div className="perfil-subtitulo">
                <span>🛂</span>
                <strong>Mis pasaportes</strong>
              </div>

              <div className="perfil-chip-lista">

                {pasaportes.length === 0 && !editando && (
                  <span className="perfil-vacio">
                    Todavía no agregaste pasaportes
                  </span>
                )}

                {pasaportes.map((p, index) => (
                  <span
                    key={`${p}-${index}`}
                    className="perfil-chip perfil-chip-crema"
                  >

                    <span>🌎</span>
                    {p}

                    {editando && (
                      <button
                        type="button"
                        className="perfil-chip-quitar"
                        onClick={() =>
                          setPasaportes(
                            pasaportes.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    )}

                  </span>
                ))}

              </div>

              {editando && (
                <div className="perfil-agregar">

                  <input
                    placeholder="Ej: 🇨🇷 Costa Rica"
                    value={nuevoPasaporte}
                    onChange={(e) =>
                      setNuevoPasaporte(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        agregarPasaporte()
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={agregarPasaporte}
                  >
                    +
                  </button>

                </div>
              )}

            </div>

            {/* IDIOMAS */}

            <div className="perfil-subseccion">

              <div className="perfil-subtitulo">
                <span>💬</span>
                <strong>Idiomas que hablo</strong>
              </div>

              <div className="perfil-chip-lista">

                {idiomas.length === 0 && !editando && (
                  <span className="perfil-vacio">
                    Todavía no agregaste idiomas
                  </span>
                )}

                {idiomas.map((i, index) => (
                  <span
                    key={`${i}-${index}`}
                    className="perfil-chip perfil-chip-azul"
                  >

                    💬 {i}

                    {editando && (
                      <button
                        type="button"
                        className="perfil-chip-quitar"
                        onClick={() =>
                          setIdiomas(
                            idiomas.filter(
                              (_, idx) => idx !== index
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    )}

                  </span>
                ))}

              </div>

              {editando && (
                <div className="perfil-agregar">

                  <input
                    placeholder="Ej: Inglés"
                    value={nuevoIdioma}
                    onChange={(e) =>
                      setNuevoIdioma(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        agregarIdioma()
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={agregarIdioma}
                  >
                    +
                  </button>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* =====================================
          GUSTOS VIAJEROS
      ====================================== */}

      <div className="perfil-seccion-wrapper">

        <button
          className="perfil-seccion-cabecera"
          onClick={() => toggleSeccion('gustos')}
        >

          <div className="perfil-seccion-titulo">

            <span className="perfil-seccion-icono">
              🌎
            </span>

            <div>
              <strong>Mi mundo viajero</strong>
              <small>
                Lo que te gusta encontrar
              </small>
            </div>

          </div>

          <span className="perfil-flecha">
            {seccionesAbiertas.gustos ? '⌃' : '⌄'}
          </span>

        </button>

        {seccionesAbiertas.gustos && (
          <div className="perfil-seccion-contenido perfil-seccion-morada">

            {/* CLIMA */}

            <div className="perfil-gustos-bloque">

              <p className="perfil-gustos-titulo">
                ☀️ Clima favorito
              </p>

              <div className="perfil-chip-lista">

                {climas.length === 0 && !editando && (
                  <span className="perfil-vacio">
                    Sin definir todavía
                  </span>
                )}

                {(editando
                  ? climasDisponibles
                  : climas
                ).map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${
                      climas.includes(c)
                        ? 'perfil-chip-activo'
                        : ''
                    } ${
                      !editando
                        ? 'perfil-chip-solo-lectura'
                        : ''
                    }`}
                    onClick={() =>
                      editando &&
                      toggleEnLista(
                        c,
                        climas,
                        setClimas
                      )
                    }
                  >
                    {c}
                  </button>
                ))}

              </div>

            </div>

            {/* DESTINO */}

            <div className="perfil-gustos-bloque">

              <p className="perfil-gustos-titulo">
                🗺️ Tipo de destino
              </p>

              <div className="perfil-chip-lista">

                {tiposDestino.length === 0 &&
                  !editando && (
                    <span className="perfil-vacio">
                      Sin definir todavía
                    </span>
                  )}

                {(editando
                  ? tiposDestinoDisponibles
                  : tiposDestino
                ).map((t) => (
                  <button
                    type="button"
                    key={t}
                    className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${
                      tiposDestino.includes(t)
                        ? 'perfil-chip-activo'
                        : ''
                    } ${
                      !editando
                        ? 'perfil-chip-solo-lectura'
                        : ''
                    }`}
                    onClick={() =>
                      editando &&
                      toggleEnLista(
                        t,
                        tiposDestino,
                        setTiposDestino
                      )
                    }
                  >
                    {t}
                  </button>
                ))}

              </div>

            </div>

            {/* INTERESES */}

            <div className="perfil-gustos-bloque">

              <p className="perfil-gustos-titulo">
                ❤️ Mis intereses
              </p>

              <div className="perfil-chip-lista">

                {intereses.length === 0 &&
                  !editando && (
                    <span className="perfil-vacio">
                      Sin definir todavía
                    </span>
                  )}

                {(editando
                  ? interesesCatalogo
                  : intereses
                ).map((i) => (
                  <button
                    type="button"
                    key={i}
                    className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${
                      intereses.includes(i)
                        ? 'perfil-chip-activo'
                        : ''
                    } ${
                      !editando
                        ? 'perfil-chip-solo-lectura'
                        : ''
                    }`}
                    onClick={() =>
                      editando &&
                      toggleEnLista(
                        i,
                        intereses,
                        setIntereses
                      )
                    }
                  >
                    {i}
                  </button>
                ))}

              </div>

            </div>

            {/* RITMO */}

            <div className="perfil-gustos-bloque">

              <p className="perfil-gustos-titulo">
                🧭 Ritmo de viaje
              </p>

              {editando ? (
                <div className="perfil-ritmos">

                  {[
                    'Relajado',
                    'Equilibrado',
                    'Intenso',
                    'Espontáneo',
                  ].map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={
                        ritmo === r
                          ? 'perfil-ritmo-activo'
                          : ''
                      }
                      onClick={() =>
                        setRitmo(r)
                      }
                    >
                      {r}
                    </button>
                  ))}

                </div>
              ) : (
                <div className="perfil-chip-lista">

                  {ritmo ? (
                    <span className="perfil-chip perfil-chip-morada perfil-chip-solo-lectura">
                      🧭 {ritmo}
                    </span>
                  ) : (
                    <span className="perfil-vacio">
                      Sin definir todavía
                    </span>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* =====================================
          SEGURIDAD
      ====================================== */}

      <div className="perfil-seccion-wrapper perfil-seguridad-wrapper">

        <button
          className="perfil-seccion-cabecera"
          onClick={() => toggleSeccion('seguridad')}
        >

          <div className="perfil-seccion-titulo">

            <span className="perfil-seccion-icono">
              🛡️
            </span>

            <div>
              <strong>Seguridad y emergencia</strong>
              <small>
                Información importante durante un viaje
              </small>
            </div>

          </div>

          <span className="perfil-flecha">
            {seccionesAbiertas.seguridad ? '⌃' : '⌄'}
          </span>

        </button>

        {seccionesAbiertas.seguridad && (
          <div className="perfil-seguridad-contenido">

            {/* INFORMACIÓN MÉDICA */}

            <div className="perfil-seccion-interna perfil-seccion-rosa">

              <div className="perfil-subtitulo">
                <span>🚑</span>
                <strong>
                  Información médica
                </strong>
              </div>

              <p className="perfil-nota-privacidad">
                🔒 Esta información es privada y está pensada para situaciones de emergencia.
              </p>

              {editando ? (
                <>

                  <label className="perfil-campo-label">
                    Tipo de sangre
                  </label>

                  <select
                    className="perfil-campo-input"
                    value={tipoSangre}
                    onChange={(e) =>
                      setTipoSangre(e.target.value)
                    }
                  >
                    <option value="">
                      Seleccioná una opción
                    </option>

                    {tiposSangre.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}

                  </select>

                  <label className="perfil-campo-label">
                    Alergias
                  </label>

                  <input
                    className="perfil-campo-input"
                    placeholder="Ej: Penicilina, maní"
                    value={alergias}
                    onChange={(e) =>
                      setAlergias(e.target.value)
                    }
                  />

                  <label className="perfil-campo-label">
                    Condiciones médicas
                  </label>

                  <input
                    className="perfil-campo-input"
                    placeholder="Ej: Asma, diabetes"
                    value={condicionesMedicas}
                    onChange={(e) =>
                      setCondicionesMedicas(
                        e.target.value
                      )
                    }
                  />

                  <label className="perfil-campo-label">
                    Medicamentos
                  </label>

                  <input
                    className="perfil-campo-input"
                    placeholder="Ej: Ninguno"
                    value={medicamentos}
                    onChange={(e) =>
                      setMedicamentos(
                        e.target.value
                      )
                    }
                  />

                </>
              ) : (
                <>

                  <div className="perfil-dato">
                    <span className="perfil-dato-label">
                      Tipo de sangre
                    </span>

                    <span className="perfil-dato-valor">
                      {tipoSangre || '—'}
                    </span>
                  </div>

                  <div className="perfil-dato">
                    <span className="perfil-dato-label">
                      Alergias
                    </span>

                    <span className="perfil-dato-valor">
                      {alergias || '—'}
                    </span>
                  </div>

                  <div className="perfil-dato">
                    <span className="perfil-dato-label">
                      Condiciones médicas
                    </span>

                    <span className="perfil-dato-valor">
                      {condicionesMedicas || '—'}
                    </span>
                  </div>

                  <div className="perfil-dato">
                    <span className="perfil-dato-label">
                      Medicamentos
                    </span>

                    <span className="perfil-dato-valor">
                      {medicamentos || '—'}
                    </span>
                  </div>

                </>
              )}

            </div>

            {/* CONTACTOS */}

            <div className="perfil-seccion-interna perfil-seccion-rosa">

              <div className="perfil-subtitulo">
                <span>📞</span>
                <strong>
                  Contactos de emergencia
                </strong>
              </div>

              {contactos.length === 0 && (
                <p className="perfil-vacio">
                  Todavía no agregaste contactos de emergencia.
                </p>
              )}

              <div className="perfil-contactos">

                {contactos.map((c) => (
                  <div
                    key={c.id}
                    className="perfil-contacto"
                  >

                    <div className="perfil-contacto-icono">
                      📞
                    </div>

                    <div className="perfil-contacto-info">

                      <strong>
                        {c.nombre}
                      </strong>

                      <span>
                        {c.telefono}
                      </span>

                    </div>

                    {editando && (
                      <button
                        type="button"
                        className="perfil-contacto-eliminar"
                        onClick={() =>
                          setContactos(
                            contactos.filter(
                              (x) => x.id !== c.id
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    )}

                  </div>
                ))}

              </div>

              {editando && (
                <div className="perfil-agregar-contacto">

                  <input
                    placeholder="Nombre"
                    value={nuevoContactoNombre}
                    onChange={(e) =>
                      setNuevoContactoNombre(
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Teléfono"
                    value={nuevoContactoTelefono}
                    onChange={(e) =>
                      setNuevoContactoTelefono(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={agregarContacto}
                  >
                    + Agregar contacto
                  </button>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* =====================================
          PREFERENCIAS
      ====================================== */}

      <div className="perfil-seccion-wrapper">

        <button
          className="perfil-seccion-cabecera"
          onClick={() => toggleSeccion('preferencias')}
        >

          <div className="perfil-seccion-titulo">

            <span className="perfil-seccion-icono">
              ⚙️
            </span>

            <div>
              <strong>Preferencias de viaje</strong>
              <small>
                Cómo quieres experimentar tus viajes
              </small>
            </div>

          </div>

          <span className="perfil-flecha">
            {seccionesAbiertas.preferencias
              ? '⌃'
              : '⌄'}
          </span>

        </button>

        {seccionesAbiertas.preferencias && (
          <div className="perfil-seccion-contenido perfil-seccion-azul">

            <label className="perfil-campo-label">
              💰 Moneda preferida
            </label>

            <select
              className="perfil-campo-input"
              value={moneda}
              onChange={(e) =>
                setMoneda(e.target.value)
              }
              disabled={!editando}
            >
              <option value="CRC">
                ₡ Colón costarricense
              </option>

              <option value="USD">
                $ Dólar estadounidense
              </option>

              <option value="EUR">
                € Euro
              </option>

              <option value="MXN">
                $ Peso mexicano
              </option>
            </select>

            <label className="perfil-campo-label">
              📏 Unidad de distancia
            </label>

            <div className="perfil-toggle-grupo">

              <button
                type="button"
                disabled={!editando}
                className={
                  unidadDistancia === 'km'
                    ? 'perfil-toggle-activo'
                    : ''
                }
                onClick={() =>
                  setUnidadDistancia('km')
                }
              >
                Kilómetros
              </button>

              <button
                type="button"
                disabled={!editando}
                className={
                  unidadDistancia === 'mi'
                    ? 'perfil-toggle-activo'
                    : ''
                }
                onClick={() =>
                  setUnidadDistancia('mi')
                }
              >
                Millas
              </button>

            </div>

            <label className="perfil-campo-label">
              🌡️ Unidad de temperatura
            </label>

            <div className="perfil-toggle-grupo">

              <button
                type="button"
                disabled={!editando}
                className={
                  unidadTemp === 'C'
                    ? 'perfil-toggle-activo'
                    : ''
                }
                onClick={() =>
                  setUnidadTemp('C')
                }
              >
                °C
              </button>

              <button
                type="button"
                disabled={!editando}
                className={
                  unidadTemp === 'F'
                    ? 'perfil-toggle-activo'
                    : ''
                }
                onClick={() =>
                  setUnidadTemp('F')
                }
              >
                °F
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =====================================
          FRASE FINAL
      ====================================== */}

      <div className="perfil-frase-final">

        <div className="perfil-frase-avion">
          ✈️
        </div>

        <div>
          <strong>
            Tu próxima aventura comienza aquí.
          </strong>

          <span>
            MOVIXA está lista para acompañarte.
          </span>
        </div>

      </div>

      {/* =====================================
          CONFIGURACIÓN
      ====================================== */}

      <button
        className="perfil-boton-config"
        onClick={irAConfiguracion}
      >
        <span>⚙️</span>
        Ir a Configuración
        <span>→</span>
      </button>

    </div>
  )
}

export default Perfil