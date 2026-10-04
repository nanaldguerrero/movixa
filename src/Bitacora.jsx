import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'
import './Bitacora.css'

const emociones = [
  { id: 'increible', emoji: '🤩', nombre: 'Inolvidable' },
  { id: 'feliz', emoji: '🥰', nombre: 'Feliz' },
  { id: 'emocionado', emoji: '✨', nombre: 'Emocionante' },
  { id: 'tranquilo', emoji: '😌', nombre: 'Tranquilo' },
  { id: 'cansado', emoji: '🥱', nombre: 'Cansado' },
  { id: 'triste', emoji: '🥹', nombre: 'Difícil' },
  { id: 'estresado', emoji: '😰', nombre: 'Estresante' },
]

const tiposRecuerdo = [
  { id: 'foto', emoji: '📸', nombre: 'Foto' },
  { id: 'ticket', emoji: '🎟️', nombre: 'Ticket' },
  { id: 'comida', emoji: '🍜', nombre: 'Comida' },
  { id: 'lugar', emoji: '📍', nombre: 'Lugar' },
  { id: 'frase', emoji: '💬', nombre: 'Frase' },
  { id: 'regalo', emoji: '🎁', nombre: 'Recuerdo' },
  { id: 'otro', emoji: '⭐', nombre: 'Otro' },
]

function Bitacora({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [cargando, setCargando] = useState(true)

  const [entradas, setEntradas] = useState([])
  const [entradaAbierta, setEntradaAbierta] = useState(null)

  const [mostrarNuevaEntrada, setMostrarNuevaEntrada] = useState(false)
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [tituloEntrada, setTituloEntrada] = useState('')
  const [textoEntrada, setTextoEntrada] = useState('')
  const [emocionEntrada, setEmocionEntrada] = useState('')

  const [mostrarRecuerdo, setMostrarRecuerdo] = useState(false)
  const [tipoRecuerdo, setTipoRecuerdo] = useState('foto')
  const [tituloRecuerdo, setTituloRecuerdo] = useState('')
  const [descripcionRecuerdo, setDescripcionRecuerdo] = useState('')

  const [mostrarDibujo, setMostrarDibujo] = useState(false)
  const [dibujos, setDibujos] = useState([])

  const canvasRef = useRef(null)
  const dibujandoRef = useRef(false)

  const hoy = new Date().toLocaleDateString('en-CA')

  // ---------------------------------------------------------
  // CARGAR VIAJE
  // ---------------------------------------------------------

  useEffect(() => {
    const cargar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setCargando(false)
        return
      }

      let { data: viajes } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .eq('activo', true)
        .limit(1)

      if (!viajes || viajes.length === 0) {
        const resultado = await supabase
          .from('viajes')
          .select('*')
          .eq('user_id', user.id)
          .order('creado_en', { ascending: false })
          .limit(1)

        viajes = resultado.data
      }

      if (viajes && viajes.length > 0) {
        const v = viajes[0]

        setViaje(v)

        setEntradas(
          Array.isArray(v.bitacora_entradas)
            ? v.bitacora_entradas
            : []
        )

        setDibujos(
          Array.isArray(v.bitacora_dibujos)
            ? v.bitacora_dibujos
            : []
        )
      }

      setCargando(false)
    }

    cargar()
  }, [])

  // ---------------------------------------------------------
  // GUARDAR EN SUPABASE
  // ---------------------------------------------------------

  const guardarCampo = async (campo, valor) => {
    if (!viaje) return

    await supabase
      .from('viajes')
      .update({
        [campo]: valor,
      })
      .eq('id', viaje.id)

    setViaje((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  // ---------------------------------------------------------
  // NUEVA ENTRADA
  // ---------------------------------------------------------

  const abrirNuevaEntrada = () => {
    setFechaEntrada(hoy)
    setTituloEntrada('')
    setTextoEntrada('')
    setEmocionEntrada('')
    setMostrarNuevaEntrada(true)
  }

  const guardarEntrada = async () => {
    if (!tituloEntrada.trim() && !textoEntrada.trim()) return

    const nuevaEntrada = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fecha: fechaEntrada || hoy,
      titulo: tituloEntrada.trim() || 'Un recuerdo de mi viaje',
      texto: textoEntrada.trim(),
      emocion: emocionEntrada || null,
      recuerdos: [],
      creado_en: new Date().toISOString(),
    }

    const nuevasEntradas = [
      ...entradas,
      nuevaEntrada,
    ]

    setEntradas(nuevasEntradas)

    await guardarCampo(
      'bitacora_entradas',
      nuevasEntradas
    )

    setMostrarNuevaEntrada(false)
    setEntradaAbierta(nuevaEntrada.id)
  }

  // ---------------------------------------------------------
  // ELIMINAR ENTRADA
  // ---------------------------------------------------------

  const eliminarEntrada = async (id) => {
    const nuevasEntradas = entradas.filter(
      (entrada) => entrada.id !== id
    )

    setEntradas(nuevasEntradas)

    await guardarCampo(
      'bitacora_entradas',
      nuevasEntradas
    )

    if (entradaAbierta === id) {
      setEntradaAbierta(null)
    }
  }

  // ---------------------------------------------------------
  // EMOCIÓN
  // ---------------------------------------------------------

  const cambiarEmocionEntrada = async (entradaId, emocion) => {
    const nuevasEntradas = entradas.map((entrada) =>
      entrada.id === entradaId
        ? {
            ...entrada,
            emocion,
          }
        : entrada
    )

    setEntradas(nuevasEntradas)

    await guardarCampo(
      'bitacora_entradas',
      nuevasEntradas
    )
  }

  // ---------------------------------------------------------
  // RECUERDOS
  // ---------------------------------------------------------

  const abrirRecuerdo = () => {
    setTipoRecuerdo('foto')
    setTituloRecuerdo('')
    setDescripcionRecuerdo('')
    setMostrarRecuerdo(true)
  }

  const guardarRecuerdo = async () => {
    if (!tituloRecuerdo.trim()) return

    const nuevoRecuerdo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      tipo: tipoRecuerdo,
      titulo: tituloRecuerdo.trim(),
      descripcion: descripcionRecuerdo.trim(),
      fecha: hoy,
    }

    if (entradaAbierta) {
      const nuevasEntradas = entradas.map((entrada) =>
        entrada.id === entradaAbierta
          ? {
              ...entrada,
              recuerdos: [
                ...(entrada.recuerdos || []),
                nuevoRecuerdo,
              ],
            }
          : entrada
      )

      setEntradas(nuevasEntradas)

      await guardarCampo(
        'bitacora_entradas',
        nuevasEntradas
      )
    } else {
      const nuevaEntradaRecuerdo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        fecha: hoy,
        titulo: 'Recuerdo guardado',
        texto: '',
        emocion: null,
        recuerdos: [nuevoRecuerdo],
        creado_en: new Date().toISOString(),
      }

      const nuevasEntradas = [
        ...entradas,
        nuevaEntradaRecuerdo,
      ]

      setEntradas(nuevasEntradas)

      await guardarCampo(
        'bitacora_entradas',
        nuevasEntradas
      )
    }

    setMostrarRecuerdo(false)
  }

  // ---------------------------------------------------------
  // DIBUJO
  // ---------------------------------------------------------

  const prepararCanvas = () => {
    setMostrarDibujo(true)

    setTimeout(() => {
      const canvas = canvasRef.current

      if (!canvas) return

      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#fffdf8'
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#5b4b8a'
    }, 50)
  }

  const obtenerPosicion = (evento) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    const clienteX =
      evento.touches?.[0]?.clientX ??
      evento.clientX

    const clienteY =
      evento.touches?.[0]?.clientY ??
      evento.clientY

    return {
      x:
        (clienteX - rect.left) *
        (canvas.width / rect.width),

      y:
        (clienteY - rect.top) *
        (canvas.height / rect.height),
    }
  }

  const empezarDibujo = (evento) => {
    evento.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const posicion = obtenerPosicion(evento)

    dibujandoRef.current = true

    ctx.beginPath()
    ctx.moveTo(posicion.x, posicion.y)
  }

  const dibujar = (evento) => {
    if (!dibujandoRef.current) return

    evento.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const posicion = obtenerPosicion(evento)

    ctx.lineTo(posicion.x, posicion.y)
    ctx.stroke()
  }

  const terminarDibujo = () => {
    dibujandoRef.current = false
  }

  const limpiarDibujo = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#fffdf8'
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    )
  }

  const guardarDibujo = async () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const imagen = canvas.toDataURL('image/png')

    const nuevoDibujo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fecha: hoy,
      imagen,
      entrada_id: entradaAbierta || null,
    }

    const nuevosDibujos = [
      ...dibujos,
      nuevoDibujo,
    ]

    setDibujos(nuevosDibujos)

    await guardarCampo(
      'bitacora_dibujos',
      nuevosDibujos
    )

    setMostrarDibujo(false)
  }

  // ---------------------------------------------------------
  // FORMATO FECHA
  // ---------------------------------------------------------

  const formatearFecha = (fecha) => {
    if (!fecha) return ''

    const [año, mes, dia] = fecha.split('-')

    return new Date(
      año,
      mes - 1,
      dia
    ).toLocaleDateString('es-CR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const obtenerEmocion = (id) => {
    return emociones.find(
      (emocion) => emocion.id === id
    )
  }

  const entradasOrdenadas = [...entradas].sort(
    (a, b) =>
      b.fecha.localeCompare(a.fecha)
  )

  // ---------------------------------------------------------
  // CARGANDO
  // ---------------------------------------------------------

  if (cargando) {
    return (
      <div className="bit">
        <div className="bit-cargando">
          <div className="bit-cargando-avion">
            ✈️
          </div>

          <h2>Preparando tu bitácora...</h2>

          <p>
            Estamos abriendo tus recuerdos.
          </p>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------
  // SIN VIAJE
  // ---------------------------------------------------------

  if (!viaje) {
    return (
      <div className="bit">
        <div className="bit-header">
          <button
            className="bit-volver"
            onClick={irADashboard}
          >
            ← Volver
          </button>

          <div className="bit-logo">
            MOVIXA
          </div>
        </div>

        <div className="bit-sin-viaje">
          <div className="bit-sin-viaje-icon">
            📖
          </div>

          <h2>
            Tu bitácora está esperando
          </h2>

          <p>
            Crea tu primer viaje y comienza
            a guardar historias, dibujos,
            recuerdos y momentos.
          </p>

          <button
            className="bit-boton-principal"
            onClick={irACrearViaje}
          >
            ✈️ Crear mi primer viaje
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="bit">

      {/* HEADER */}

      <div className="bit-header">
        <button
          className="bit-volver"
          onClick={irADashboard}
        >
          ← Volver
        </button>

        <div className="bit-logo">
          MOVIXA
        </div>
      </div>

      {/* PORTADA */}

      <section className="bit-portada">

        <div className="bit-portada-decoracion">
          ✈️
        </div>

        <div className="bit-portada-contenido">

          <span className="bit-portada-etiqueta">
            MI AVENTURA
          </span>

          <h1>
            Mi bitácora
          </h1>

          <h2>
            {viaje.destino}
          </h2>

          <p>
            Un lugar para guardar
            todo aquello que no
            quieres olvidar.
          </p>

          <div className="bit-portada-linea">
            ✦ ✈️ ✦
          </div>

        </div>

      </section>

      {/* ACCIONES CREATIVAS */}

      <section className="bit-crear">

        <div className="bit-seccion-heading">
          <span>✨</span>

          <div>
            <h2>
              Hazlo tuyo
            </h2>

            <p>
              Este viaje también puede
              contarse a tu manera.
            </p>
          </div>
        </div>

        <div className="bit-crear-grid">

          <button
            className="bit-crear-card bit-crear-escribir"
            onClick={abrirNuevaEntrada}
          >
            <span className="bit-crear-icon">
              ✍️
            </span>

            <strong>
              Escribir
            </strong>

            <small>
              Cuenta lo que viviste
            </small>
          </button>

          <button
            className="bit-crear-card bit-crear-dibujar"
            onClick={prepararCanvas}
          >
            <span className="bit-crear-icon">
              🎨
            </span>

            <strong>
              Dibujar
            </strong>

            <small>
              Pinta tu recuerdo
            </small>
          </button>

          <button
            className="bit-crear-card bit-crear-recuerdo"
            onClick={abrirRecuerdo}
          >
            <span className="bit-crear-icon">
              🎟️
            </span>

            <strong>
              Guardar
            </strong>

            <small>
              Conserva un recuerdo
            </small>
          </button>

        </div>

      </section>

      {/* NUEVA ENTRADA */}

      {mostrarNuevaEntrada && (
        <div className="bit-modal-fondo">

          <div className="bit-modal">

            <button
              className="bit-modal-cerrar"
              onClick={() =>
                setMostrarNuevaEntrada(false)
              }
            >
              ×
            </button>

            <span className="bit-modal-icon">
              ✍️
            </span>

            <h2>
              Cuéntame tu día
            </h2>

            <p>
              No tienes que escribir perfecto.
              Solo escribe lo que quieras recordar.
            </p>

            <label>
              Fecha
            </label>

            <input
              type="date"
              value={fechaEntrada}
              onChange={(e) =>
                setFechaEntrada(e.target.value)
              }
            />

            <label>
              Título
            </label>

            <input
              type="text"
              placeholder="Ej: Mi primer día en Japón"
              value={tituloEntrada}
              onChange={(e) =>
                setTituloEntrada(e.target.value)
              }
            />

            <label>
              ¿Cómo fue?
            </label>

            <div className="bit-emociones">

              {emociones.map((emocion) => (
                <button
                  key={emocion.id}
                  className={
                    emocionEntrada === emocion.id
                      ? 'bit-emocion-activa'
                      : ''
                  }
                  onClick={() =>
                    setEmocionEntrada(emocion.id)
                  }
                >
                  <span>
                    {emocion.emoji}
                  </span>

                  <small>
                    {emocion.nombre}
                  </small>
                </button>
              ))}

            </div>

            <label>
              Tu recuerdo
            </label>

            <textarea
              placeholder="¿Qué pasó? ¿Qué viste? ¿Qué sentiste? ¿Qué quieres recordar?"
              value={textoEntrada}
              onChange={(e) =>
                setTextoEntrada(e.target.value)
              }
            />

            <button
              className="bit-modal-guardar"
              onClick={guardarEntrada}
            >
              💜 Guardar en mi bitácora
            </button>

          </div>
        </div>
      )}

      {/* RECUERDO */}

      {mostrarRecuerdo && (
        <div className="bit-modal-fondo">

          <div className="bit-modal">

            <button
              className="bit-modal-cerrar"
              onClick={() =>
                setMostrarRecuerdo(false)
              }
            >
              ×
            </button>

            <span className="bit-modal-icon">
              🎟️
            </span>

            <h2>
              Guarda un recuerdo
            </h2>

            <p>
              Los pequeños detalles también
              forman parte de tu viaje.
            </p>

            <div className="bit-recuerdos-tipos">

              {tiposRecuerdo.map((tipo) => (
                <button
                  key={tipo.id}
                  className={
                    tipoRecuerdo === tipo.id
                      ? 'bit-recuerdo-tipo-activo'
                      : ''
                  }
                  onClick={() =>
                    setTipoRecuerdo(tipo.id)
                  }
                >
                  <span>
                    {tipo.emoji}
                  </span>

                  <small>
                    {tipo.nombre}
                  </small>
                </button>
              ))}

            </div>

            <label>
              ¿Qué quieres guardar?
            </label>

            <input
              type="text"
              placeholder="Ej: El ramen que comí por primera vez"
              value={tituloRecuerdo}
              onChange={(e) =>
                setTituloRecuerdo(e.target.value)
              }
            />

            <label>
              Cuéntame un poco más
            </label>

            <textarea
              placeholder="Escribe algo que quieras recordar..."
              value={descripcionRecuerdo}
              onChange={(e) =>
                setDescripcionRecuerdo(e.target.value)
              }
            />

            <button
              className="bit-modal-guardar"
              onClick={guardarRecuerdo}
            >
              🎁 Guardar recuerdo
            </button>

          </div>

        </div>
      )}

      {/* DIBUJAR */}

      {mostrarDibujo && (
        <div className="bit-modal-fondo">

          <div className="bit-modal bit-modal-dibujo">

            <button
              className="bit-modal-cerrar"
              onClick={() =>
                setMostrarDibujo(false)
              }
            >
              ×
            </button>

            <div className="bit-dibujo-titulo">
              <span>🎨</span>

              <div>
                <h2>
                  Crea algo
                </h2>

                <p>
                  No importa si sabes dibujar.
                  Este recuerdo es tuyo.
                </p>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={900}
              height={600}
              className="bit-canvas"
              onMouseDown={empezarDibujo}
              onMouseMove={dibujar}
              onMouseUp={terminarDibujo}
              onMouseLeave={terminarDibujo}
              onTouchStart={empezarDibujo}
              onTouchMove={dibujar}
              onTouchEnd={terminarDibujo}
            />

            <div className="bit-dibujo-controles">

              <button
                onClick={limpiarDibujo}
              >
                🧽 Limpiar
              </button>

              <button
                className="bit-modal-guardar"
                onClick={guardarDibujo}
              >
                💜 Guardar dibujo
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ENTRADAS */}

      <section className="bit-historias">

        <div className="bit-seccion-heading">
          <span>📖</span>

          <div>
            <h2>
              Mis historias
            </h2>

            <p>
              Los momentos que decidiste guardar.
            </p>
          </div>
        </div>

        {entradasOrdenadas.length === 0 ? (

          <div className="bit-vacio">

            <div>
              📖
            </div>

            <h3>
              Todavía no has escrito tu historia
            </h3>

            <p>
              Tu primera página puede comenzar
              con algo tan sencillo como:
              "Hoy llegué..."
            </p>

            <button
              onClick={abrirNuevaEntrada}
            >
              ✍️ Escribir mi primera página
            </button>

          </div>

        ) : (

          <div className="bit-libro">

            {entradasOrdenadas.map(
              (entrada, indice) => {

                const emocion =
                  obtenerEmocion(
                    entrada.emocion
                  )

                const abierta =
                  entradaAbierta === entrada.id

                return (
                  <article
                    key={entrada.id}
                    className={`bit-pagina ${
                      abierta
                        ? 'bit-pagina-abierta'
                        : ''
                    }`}
                  >

                    <div
                      className="bit-pagina-cabecera"
                      onClick={() =>
                        setEntradaAbierta(
                          abierta
                            ? null
                            : entrada.id
                        )
                      }
                    >

                      <div className="bit-pagina-fecha">
                        <span>
                          {entrada.fecha?.slice(8, 10)}
                        </span>

                        <small>
                          {entrada.fecha?.slice(5, 7)}
                        </small>
                      </div>

                      <div className="bit-pagina-info">

                        <span className="bit-pagina-dia">
                          {formatearFecha(
                            entrada.fecha
                          )}
                        </span>

                        <h3>
                          {entrada.titulo}
                        </h3>

                        {entrada.texto && (
                          <p>
                            {entrada.texto.slice(
                              0,
                              100
                            )}
                            {entrada.texto.length > 100
                              ? '...'
                              : ''}
                          </p>
                        )}

                      </div>

                      {emocion && (
                        <span className="bit-pagina-emocion">
                          {emocion.emoji}
                        </span>
                      )}

                      <span className="bit-pagina-flecha">
                        {abierta ? '⌃' : '⌄'}
                      </span>

                    </div>

                    {abierta && (

                      <div className="bit-pagina-contenido">

                        {entrada.texto && (
                          <div className="bit-texto-recuerdo">
                            {entrada.texto}
                          </div>
                        )}

                        {emocion && (
                          <div className="bit-como-me-senti">

                            <span>
                              {emocion.emoji}
                            </span>

                            <div>
                              <small>
                                Ese día me sentí
                              </small>

                              <strong>
                                {emocion.nombre}
                              </strong>
                            </div>

                          </div>
                        )}

                        {entrada.recuerdos &&
                          entrada.recuerdos.length > 0 && (

                            <div className="bit-recuerdos">

                              <h4>
                                🎟️ Recuerdos de este día
                              </h4>

                              <div className="bit-recuerdos-grid">

                                {entrada.recuerdos.map(
                                  (recuerdo) => {

                                    const tipo =
                                      tiposRecuerdo.find(
                                        (t) =>
                                          t.id ===
                                          recuerdo.tipo
                                      )

                                    return (
                                      <div
                                        key={
                                          recuerdo.id
                                        }
                                        className="bit-recuerdo"
                                      >

                                        <span>
                                          {tipo?.emoji ||
                                            '⭐'}
                                        </span>

                                        <strong>
                                          {recuerdo.titulo}
                                        </strong>

                                        {recuerdo.descripcion && (
                                          <p>
                                            {
                                              recuerdo.descripcion
                                            }
                                          </p>
                                        )}

                                      </div>
                                    )
                                  }
                                )}

                              </div>

                            </div>
                          )}

                        <div className="bit-pagina-acciones">

                          <button
                            onClick={() => {
                              setEntradaAbierta(
                                entrada.id
                              )
                              abrirRecuerdo()
                            }}
                          >
                            🎟️ Agregar recuerdo
                          </button>

                          <button
                            onClick={() => {
                              setEntradaAbierta(
                                entrada.id
                              )
                              prepararCanvas()
                            }}
                          >
                            🎨 Dibujar
                          </button>

                          <button
                            className="bit-eliminar"
                            onClick={() =>
                              eliminarEntrada(
                                entrada.id
                              )
                            }
                          >
                            🗑️ Eliminar
                          </button>

                        </div>

                      </div>
                    )}

                  </article>
                )
              }
            )}

          </div>
        )}

      </section>

      {/* DIBUJOS */}

      {dibujos.length > 0 && (

        <section className="bit-galeria">

          <div className="bit-seccion-heading">
            <span>🎨</span>

            <div>
              <h2>
                Mis creaciones
              </h2>

              <p>
                Todo lo que dibujaste durante
                la aventura.
              </p>
            </div>
          </div>

          <div className="bit-galeria-grid">

            {dibujos.map((dibujo) => (

              <div
                key={dibujo.id}
                className="bit-dibujo-card"
              >

                <img
                  src={dibujo.imagen}
                  alt="Dibujo de viaje"
                />

                <span>
                  {formatearFecha(
                    dibujo.fecha
                  )}
                </span>

              </div>

            ))}

          </div>

        </section>
      )}

      {/* FRASE FINAL */}

      <section className="bit-final">

        <div className="bit-final-avion">
          ✈️
        </div>

        <h2>
          Los viajes terminan...
        </h2>

        <p>
          pero las historias que guardamos
          pueden quedarse para siempre.
        </p>

        <button
          onClick={() =>
            irADetalle(viaje.id)
          }
        >
          Ver mi viaje completo →
        </button>

      </section>

    </div>
  )
}

export default Bitacora