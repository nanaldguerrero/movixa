import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'
import './Diario.css'

const emociones = [
  { id: 'feliz', emoji: '😊', nombre: 'Feliz' },
  { id: 'emocionada', emoji: '🤩', nombre: 'Emocionada' },
  { id: 'tranquila', emoji: '😌', nombre: 'Tranquila' },
  { id: 'sorprendida', emoji: '😲', nombre: 'Sorprendida' },
  { id: 'enamorada', emoji: '🥰', nombre: 'Enamorada' },
  { id: 'aventurera', emoji: '🧭', nombre: 'Aventurera' },
  { id: 'cansada', emoji: '😴', nombre: 'Cansada' },
  { id: 'nostalgica', emoji: '🥹', nombre: 'Nostálgica' }
]

const tiposRecuerdo = [
  { id: 'favorito', emoji: '⭐', nombre: 'Momento favorito' },
  { id: 'comida', emoji: '🍜', nombre: 'Comida' },
  { id: 'lugar', emoji: '📍', nombre: 'Lugar especial' },
  { id: 'persona', emoji: '❤️', nombre: 'Persona especial' },
  { id: 'aventura', emoji: '🏔️', nombre: 'Aventura' },
  { id: 'ticket', emoji: '🎟️', nombre: 'Ticket / entrada' },
  { id: 'otro', emoji: '✨', nombre: 'Otro recuerdo' }
]

function Diario({ irADashboard, irACrearViaje, irADetalle, irALibro  }) {
  const canvasRef = useRef(null)
  const dibujandoRef = useRef(false)

  const [viaje, setViaje] = useState(null)
  const [entradas, setEntradas] = useState([])

  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarDibujo, setMostrarDibujo] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [lugar, setLugar] = useState('')
  const [emocion, setEmocion] = useState('')
  const [tipoRecuerdo, setTipoRecuerdo] = useState('')
  const [favorito, setFavorito] = useState(false)
  const [etiquetas, setEtiquetas] = useState('')

  const [fotoArchivos, setFotoArchivos] = useState([])
  const [fotoPreviews, setFotoPreviews] = useState([])

  const [dibujoData, setDibujoData] = useState(null)
  const [dibujoGuardado, setDibujoGuardado] = useState(false)

  const [colorLapiz, setColorLapiz] = useState('#7657d9')
  const [grosorLapiz, setGrosorLapiz] = useState(5)

  const [subiendo, setSubiendo] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDiario()
  }, [])

  useEffect(() => {
    if (mostrarDibujo) {
      setTimeout(() => prepararCanvas(), 50)
    }
  }, [mostrarDibujo])

  const cargarDiario = async () => {
    try {
      const {
        data: { user }
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
        setViaje(viajes[0])

        const diarioGuardado = Array.isArray(viajes[0].diario)
          ? viajes[0].diario
          : []

        setEntradas(diarioGuardado)
      }
    } catch (error) {
      console.error('Error cargando diario:', error)
    } finally {
      setCargando(false)
    }
  }

  const guardarEntradas = async (nuevasEntradas) => {
    if (!viaje) return false

    const { error } = await supabase
      .from('viajes')
      .update({
        diario: nuevasEntradas
      })
      .eq('id', viaje.id)

    if (error) {
      console.error('Error guardando diario:', error)
      return false
    }

    return true
  }

  const elegirFotos = (e) => {
    const archivos = Array.from(e.target.files || [])

    if (archivos.length === 0) return

    const imagenes = archivos.filter((archivo) =>
      archivo.type.startsWith('image/')
    )

    const nuevasPreviews = imagenes.map((archivo) => ({
      archivo,
      preview: URL.createObjectURL(archivo)
    }))

    setFotoArchivos((actuales) => [...actuales, ...imagenes])
    setFotoPreviews((actuales) => [...actuales, ...nuevasPreviews])

    e.target.value = ''
  }

  const quitarFoto = (indice) => {
    setFotoArchivos((actuales) =>
      actuales.filter((_, index) => index !== indice)
    )

    setFotoPreviews((actuales) => {
      const copia = [...actuales]

      if (copia[indice]?.preview) {
        URL.revokeObjectURL(copia[indice].preview)
      }

      return copia.filter((_, index) => index !== indice)
    })
  }

  const limpiarFormulario = () => {
    setTitulo('')
    setTexto('')
    setLugar('')
    setEmocion('')
    setTipoRecuerdo('')
    setFavorito(false)
    setEtiquetas('')

    fotoPreviews.forEach((item) => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview)
      }
    })

    setFotoArchivos([])
    setFotoPreviews([])

    setDibujoData(null)
    setDibujoGuardado(false)
    setMostrarForm(false)
  }

  const subirArchivo = async (archivo, carpeta = 'fotos') => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return null

    const extension =
      archivo.name.split('.').pop()?.toLowerCase() || 'jpg'

    const nombreArchivo =
      `${user.id}/` +
      `${carpeta}/` +
      `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const { error } = await supabase.storage
      .from('diario-fotos')
      .upload(nombreArchivo, archivo, {
        upsert: false
      })

    if (error) {
      console.error('Error subiendo archivo:', error)
      return null
    }

    const { data } = supabase.storage
      .from('diario-fotos')
      .getPublicUrl(nombreArchivo)

    return data?.publicUrl || null
  }

  const prepararCanvas = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const contenedor = canvas.parentElement
    const ancho = Math.min(contenedor.clientWidth || 700, 900)

    canvas.width = ancho
    canvas.height = 430

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#fffdf8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = colorLapiz
    ctx.lineWidth = grosorLapiz
  }

  const obtenerPosicion = (evento) => {
    const canvas = canvasRef.current

    if (!canvas) {
      return { x: 0, y: 0 }
    }

    const rect = canvas.getBoundingClientRect()

    return {
      x:
        (evento.clientX - rect.left) *
        (canvas.width / rect.width),
      y:
        (evento.clientY - rect.top) *
        (canvas.height / rect.height)
    }
  }

  const empezarDibujo = (evento) => {
    const canvas = canvasRef.current

    if (!canvas) return

    evento.preventDefault()

    dibujandoRef.current = true

    const posicion = obtenerPosicion(evento)
    const ctx = canvas.getContext('2d')

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

    ctx.strokeStyle = colorLapiz
    ctx.lineWidth = grosorLapiz

    ctx.lineTo(posicion.x, posicion.y)
    ctx.stroke()
  }

  const terminarDibujo = () => {
    dibujandoRef.current = false
  }

  const limpiarCanvas = () => {
    prepararCanvas()
  }

  const guardarDibujo = () => {
    const canvas = canvasRef.current

    if (!canvas) return

    const imagen = canvas.toDataURL('image/png')

    setDibujoData(imagen)
    setDibujoGuardado(true)
    setMostrarDibujo(false)
  }

  const abrirDibujo = () => {
    setMostrarDibujo(true)
  }

  const agregarEntrada = async () => {
    if (!titulo.trim() || !texto.trim()) return

    setSubiendo(true)

    try {
      const fotosSubidas = []

      for (const archivo of fotoArchivos) {
        const url = await subirArchivo(archivo, 'fotos')

        if (url) {
          fotosSubidas.push(url)
        }
      }

      const urlDibujo = dibujoData

      const hoy = new Date().toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      const nuevo = {
        id: Date.now(),
        titulo: titulo.trim(),
        fecha: hoy,
        texto: texto.trim(),
        lugar: lugar.trim(),
        emocion,
        tipoRecuerdo,
        favorito,
        etiquetas: etiquetas
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        foto: fotosSubidas[0] || null,
        fotos: fotosSubidas,
        dibujo: urlDibujo,
        creadoEn: new Date().toISOString()
      }

      const nuevasEntradas = [nuevo, ...entradas]

      const guardado = await guardarEntradas(nuevasEntradas)

      if (!guardado) {
        alert(
          'No se pudo guardar la entrada. Intentá nuevamente.'
        )
        return
      }

      setEntradas(nuevasEntradas)
      limpiarFormulario()
    } catch (error) {
      console.error('Error guardando recuerdo:', error)
      alert('Ocurrió un error al guardar el recuerdo.')
    } finally {
      setSubiendo(false)
    }
  }

  const eliminarEntrada = async (id) => {
    const confirmar = window.confirm(
      '¿Querés eliminar este recuerdo del diario?'
    )

    if (!confirmar) return

    const nuevasEntradas = entradas.filter(
      (entrada) => entrada.id !== id
    )

    const guardado = await guardarEntradas(nuevasEntradas)

    if (guardado) {
      setEntradas(nuevasEntradas)
    }
  }

  const alternarFavorito = async (id) => {
    const nuevasEntradas = entradas.map((entrada) =>
      entrada.id === id
        ? {
            ...entrada,
            favorito: !entrada.favorito
          }
        : entrada
    )

    const guardado = await guardarEntradas(nuevasEntradas)

    if (guardado) {
      setEntradas(nuevasEntradas)
    }
  }

  const totalFotos = entradas.reduce((total, entrada) => {
    if (Array.isArray(entrada.fotos)) {
      return total + entrada.fotos.length
    }

    return total + (entrada.foto ? 1 : 0)
  }, 0)

  const totalFavoritos = entradas.filter(
    (entrada) => entrada.favorito
  ).length

  const totalDibujos = entradas.filter(
    (entrada) => entrada.dibujo
  ).length

  if (cargando) {
    return (
      <div className="diario diario-cargando">
        <div className="dia-cargando-icono">📖</div>

        <h3>Abriendo tu diario...</h3>

        <p>Preparando tus recuerdos de viaje</p>
      </div>
    )
  }

  if (!viaje) {
    return (
      <div className="diario">
        <header className="dia-header">
          <button
            className="dia-volver"
            onClick={irADashboard}
          >
            ← Volver
          </button>

          <div className="dia-logo">
            MOVIXA
          </div>
        </header>

        <main className="dia-sin-viaje">
          <div className="dia-sin-viaje-icono">
            📖
          </div>

          <span className="dia-kicker">
            TU HISTORIA COMIENZA AQUÍ
          </span>

          <h1>
            Todavía no tenés
            <br />
            ningún viaje
          </h1>

          <p>
            Creá una aventura y este espacio se convertirá
            en tu diario de recuerdos.
          </p>

          <button
            className="dia-boton-principal"
            onClick={irACrearViaje}
          >
            ✈️ Crear mi primer viaje
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="diario">

      {/* HEADER */}
      <header className="dia-header">
        <button
          className="dia-volver"
          onClick={irADashboard}
        >
          ← Volver
        </button>

        <div className="dia-logo">
          MOVIXA
        </div>

        <div className="dia-header-avion">
          ✈️
        </div>
      </header>

      {/* PORTADA */}
      <section className="dia-portada">
        <div className="dia-portada-decoracion dia-deco-1">
          ✦
        </div>

        <div className="dia-portada-decoracion dia-deco-2">
          ☁️
        </div>

        <div className="dia-portada-contenido">
          <span className="dia-kicker">
            📖 MI DIARIO DE VIAJE
          </span>

          <h1>
            {viaje.destino}
          </h1>

          <p>
            Un lugar para guardar todo aquello
            que no querés olvidar.
          </p>

          <div className="dia-stats">
            <div>
              <strong>{entradas.length}</strong>
              <span>historias</span>
            </div>

            <div>
              <strong>{totalFotos}</strong>
              <span>fotos</span>
            </div>

            <div>
              <strong>{totalFavoritos}</strong>
              <span>favoritos</span>
            </div>

            <div>
              <strong>{totalDibujos}</strong>
              <span>dibujos</span>
            </div>
          </div>
        </div>

        <div className="dia-portada-sello">
          <span>ADVENTURE</span>
          <strong>✈</strong>
          <span>MOVIXA</span>
        </div>
      </section>

      {/* BOTÓN CREAR */}
      {!mostrarForm && (
        <section className="dia-crear-seccion">
          <button
            className="dia-boton-nueva"
            onClick={() => setMostrarForm(true)}
          >
            <span className="dia-boton-nueva-icono">
              ✨
            </span>

            <span>
              <strong>
                Crear un nuevo recuerdo
              </strong>

              <small>
                Escribí, agregá fotos, dibujá y guardá el momento.
              </small>
            </span>

            <b>＋</b>
          </button>
        </section>
      )}

      {/* FORMULARIO */}
      {mostrarForm && (
        <section className="dia-crear">

          <div className="dia-crear-titulo">
            <div>
              <span>✦ NUEVA PÁGINA</span>

              <h2>
                Contá tu historia
              </h2>
            </div>

            <button
              className="dia-cerrar-form"
              onClick={limpiarFormulario}
            >
              ×
            </button>
          </div>

          <div className="dia-form-grid">

            <div className="dia-form-principal">

              <label>
                Título de tu recuerdo

                <input
                  type="text"
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(e.target.value)
                  }
                  placeholder="Ej. Una aventura inolvidable"
                  maxLength={100}
                />
              </label>

              <label>
                ¿Qué pasó?

                <textarea
                  value={texto}
                  onChange={(e) =>
                    setTexto(e.target.value)
                  }
                  placeholder="Escribí todo lo que quieras recordar de este momento..."
                  rows={8}
                />
              </label>

              <div className="dia-form-datos">

                <label>
                  📍 Lugar

                  <input
                    type="text"
                    value={lugar}
                    onChange={(e) =>
                      setLugar(e.target.value)
                    }
                    placeholder="Ej. Monte Fuji"
                  />
                </label>

                <label>
                  🏷️ Etiquetas

                  <input
                    type="text"
                    value={etiquetas}
                    onChange={(e) =>
                      setEtiquetas(e.target.value)
                    }
                    placeholder="aventura, comida, familia"
                  />
                </label>

              </div>
            </div>

            {/* EMOCIÓN */}
            <div className="dia-form-lateral">

              <div className="dia-form-bloque">
                <h3>
                  ¿Cómo te sentiste?
                </h3>

                <div className="dia-emociones">
                  {emociones.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        emocion === item.id
                          ? 'dia-emocion activo'
                          : 'dia-emocion'
                      }
                      onClick={() =>
                        setEmocion(item.id)
                      }
                    >
                      <span>
                        {item.emoji}
                      </span>

                      <small>
                        {item.nombre}
                      </small>
                    </button>
                  ))}
                </div>
              </div>

              {/* TIPO DE RECUERDO */}
              <div className="dia-form-bloque">
                <h3>
                  ¿Qué tipo de recuerdo es?
                </h3>

                <div className="dia-recuerdos">
                  {tiposRecuerdo.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        tipoRecuerdo === item.id
                          ? 'dia-recuerdo activo'
                          : 'dia-recuerdo'
                      }
                      onClick={() =>
                        setTipoRecuerdo(item.id)
                      }
                    >
                      <span>
                        {item.emoji}
                      </span>

                      {item.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAVORITO */}
              <button
                type="button"
                className={
                  favorito
                    ? 'dia-favorito activo'
                    : 'dia-favorito'
                }
                onClick={() =>
                  setFavorito(!favorito)
                }
              >
                <span>⭐</span>

                <div>
                  <strong>
                    Marcar como favorito
                  </strong>

                  <small>
                    Guardá este momento entre tus recuerdos especiales.
                  </small>
                </div>
              </button>

            </div>
          </div>

          {/* FOTOS */}
          <div className="dia-form-seccion">

            <div className="dia-seccion-titulo">
              <div>
                <span className="dia-seccion-icono">
                  📸
                </span>

                <div>
                  <h3>
                    Fotos del momento
                  </h3>

                  <p>
                    Podés agregar varias fotografías.
                  </p>
                </div>
              </div>

              <label className="dia-agregar-fotos">
                ＋ Agregar fotos

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={elegirFotos}
                  hidden
                />
              </label>
            </div>

            {fotoPreviews.length > 0 && (
              <div className="dia-fotos-preview">
                {fotoPreviews.map((foto, index) => (
                  <div
                    className="dia-foto-preview-item"
                    key={`${foto.preview}-${index}`}
                  >
                    <img
                      src={foto.preview}
                      alt={`Recuerdo ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        quitarFoto(index)
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {fotoPreviews.length === 0 && (
              <label className="dia-fotos-vacio">
                <span>📷</span>

                <strong>
                  Agregá las fotos de este momento
                </strong>

                <small>
                  Podés seleccionar varias fotografías.
                </small>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={elegirFotos}
                  hidden
                />
              </label>
            )}
          </div>

          {/* DIBUJO */}
          <div className="dia-form-seccion dia-dibujo-seccion">

            <div className="dia-seccion-titulo">
              <div>
                <span className="dia-seccion-icono">
                  🎨
                </span>

                <div>
                  <h3>
                    Dibujá tu recuerdo
                  </h3>

                  <p>
                    No tiene que ser perfecto. Es tu historia.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="dia-boton-dibujar"
                onClick={abrirDibujo}
              >
                🎨{' '}
                {dibujoGuardado
                  ? 'Editar dibujo'
                  : 'Abrir lienzo'}
              </button>
            </div>

            {dibujoData && (
              <div className="dia-dibujo-preview">
                <img
                  src={dibujoData}
                  alt="Dibujo del recuerdo"
                />

                <button
                  type="button"
                  onClick={() => {
                    setDibujoData(null)
                    setDibujoGuardado(false)
                  }}
                >
                  Eliminar dibujo
                </button>
              </div>
            )}

          </div>

          {/* BOTONES */}
          <div className="dia-form-final">

            <button
              type="button"
              className="dia-boton-cancelar"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="dia-boton-guardar"
              onClick={agregarEntrada}
              disabled={
                subiendo ||
                !titulo.trim() ||
                !texto.trim()
              }
            >
              {subiendo
                ? 'Guardando recuerdo...'
                : '💜 Guardar mi recuerdo'}
            </button>

          </div>

        </section>
      )}

      {/* HISTORIAS */}
      <main className="dia-historias">

        <div className="dia-historias-heading">
          <div>
            <span>
              ✦ TUS RECUERDOS
            </span>

            <h2>
              Las páginas de tu aventura
            </h2>
          </div>

          {entradas.length > 0 && (
            <span className="dia-contador">
              {entradas.length}{' '}
              {entradas.length === 1
                ? 'recuerdo'
                : 'recuerdos'}
            </span>
          )}
        </div>

        {entradas.length === 0 && !mostrarForm && (
          <div className="dia-vacio">
            <div>📖</div>

            <h3>
              Tu historia todavía está en blanco
            </h3>

            <p>
              Este puede ser el primer recuerdo de
              tu aventura en {viaje.destino}.
            </p>

            <button
              onClick={() =>
                setMostrarForm(true)
              }
            >
              ✨ Escribir mi primer recuerdo
            </button>
          </div>
        )}

        <div className="dia-lista">

          {entradas.map((entrada, indice) => {

            const fotos =
              Array.isArray(entrada.fotos) &&
              entrada.fotos.length > 0
                ? entrada.fotos
                : entrada.foto
                  ? [entrada.foto]
                  : []

            const emocionInfo =
              emociones.find(
                (item) =>
                  item.id === entrada.emocion
              )

            return (
              <article
                key={entrada.id || indice}
                className={
                  indice % 2 === 0
                    ? 'dia-pagina'
                    : 'dia-pagina dia-pagina-alterna'
                }
              >

                <div className="dia-pagina-cinta">
                  MOVIXA ✈
                </div>

                <div className="dia-pagina-fecha">
                  <span>📅</span>
                  {entrada.fecha}
                </div>

                <div className="dia-pagina-contenido">

                  <div className="dia-pagina-texto">

                    <div className="dia-pagina-top">

                      {entrada.favorito && (
                        <span className="dia-favorito-mini">
                          ⭐ Favorito
                        </span>
                      )}

                      {entrada.tipoRecuerdo && (
                        <span className="dia-tipo-mini">
                          {tiposRecuerdo.find(
                            (item) =>
                              item.id ===
                              entrada.tipoRecuerdo
                          )?.emoji || '✨'}
                        </span>
                      )}

                    </div>

                    <h3>
                      {entrada.titulo}
                    </h3>

                    {(entrada.lugar ||
                      emocionInfo) && (
                      <div className="dia-meta">

                        {entrada.lugar && (
                          <span>
                            📍 {entrada.lugar}
                          </span>
                        )}

                        {emocionInfo && (
                          <span>
                            {emocionInfo.emoji}{' '}
                            {emocionInfo.nombre}
                          </span>
                        )}

                      </div>
                    )}

                    <p className="dia-texto">
                      {entrada.texto}
                    </p>

                    {Array.isArray(
                      entrada.etiquetas
                    ) &&
                      entrada.etiquetas.length > 0 && (
                        <div className="dia-etiquetas">
                          {entrada.etiquetas.map(
                            (tag, index) => (
                              <span key={index}>
                                #{tag}
                              </span>
                            )
                          )}
                        </div>
                      )}

                  </div>

                  {fotos.length > 0 && (
                    <div
                      className={
                        fotos.length === 1
                          ? 'dia-galeria una'
                          : 'dia-galeria'
                      }
                    >
                      {fotos.map(
                        (foto, fotoIndex) => (
                          <img
                            key={fotoIndex}
                            src={foto}
                            alt={`${entrada.titulo} ${fotoIndex + 1}`}
                          />
                        )
                      )}
                    </div>
                  )}

                  {entrada.dibujo && (
                    <div className="dia-pagina-dibujo">
                      <div>
                        🎨 Mi dibujo
                      </div>

                      <img
                        src={entrada.dibujo}
                        alt="Dibujo del recuerdo"
                      />
                    </div>
                  )}

                </div>

                <div className="dia-pagina-footer">

                  <button
                    type="button"
                    onClick={() =>
                      alternarFavorito(
                        entrada.id
                      )
                    }
                  >
                    {entrada.favorito
                      ? '⭐ Favorito'
                      : '☆ Guardar favorito'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      eliminarEntrada(
                        entrada.id
                      )
                    }
                  >
                    🗑️ Eliminar
                  </button>

                </div>

              </article>
            )
          })}

        </div>
      </main>

      {/* GALERÍA GENERAL */}
      {totalFotos > 0 && (
        <section className="dia-galeria-general">

          <div className="dia-historias-heading">
            <div>
              <span>
                📸 TODOS TUS MOMENTOS
              </span>

              <h2>
                Galería del viaje
              </h2>
            </div>
          </div>

          <div className="dia-mosaico">

            {entradas
              .flatMap((entrada) => {

                if (
                  Array.isArray(entrada.fotos) &&
                  entrada.fotos.length > 0
                ) {
                  return entrada.fotos.map(
                    (foto) => ({
                      foto,
                      titulo: entrada.titulo
                    })
                  )
                }

                if (entrada.foto) {
                  return [
                    {
                      foto: entrada.foto,
                      titulo: entrada.titulo
                    }
                  ]
                }

                return []
              })
              .map((item, index) => (
                <div
                  className="dia-mosaico-foto"
                  key={index}
                >
                  <img
                    src={item.foto}
                    alt={item.titulo}
                  />

                  <span>
                    {item.titulo}
                  </span>
                </div>
              ))}

          </div>
        </section>
      )}

      {/* FINAL */}
      <section className="dia-final">

        <div className="dia-final-avion">
          ✈️
        </div>

        <span>
          CADA VIAJE MERECE SER RECORDADO
        </span>

        <h2>
          Tu aventura,
          <br />
          tus recuerdos.
        </h2>

        <p>
          MOVIXA guarda los momentos que hacen
          que cada viaje sea único.
        </p>

      </section>

      <div className="dia-botones-finales">

        <button
          type="button"
          className="dia-boton-libro"
          onClick={irALibro}
        >
          📖 Ver mi libro de viaje (imprimir)
        </button>

        <button
          type="button"
          className="dia-boton-ver-viaje"
          onClick={() => irADetalle(viaje.id)}
        >
          Ver viaje completo →
        </button>

      </div>

      {/* MODAL DE DIBUJO */}
      {mostrarDibujo && (
        <div className="dia-modal-fondo">

          <div className="dia-modal-dibujo">

            <div className="dia-modal-header">
              <div>
                <span>
                  🎨 TU ESPACIO CREATIVO
                </span>

                <h2>
                  Dibujá tu recuerdo
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarDibujo(false)
                }
              >
                ×
              </button>
            </div>

            <div className="dia-canvas-contenedor">

              <canvas
                ref={canvasRef}
                className="dia-canvas"
                onPointerDown={empezarDibujo}
                onPointerMove={dibujar}
                onPointerUp={terminarDibujo}
                onPointerLeave={terminarDibujo}
              />

              <div className="dia-canvas-texto">
                Dibujá, escribí o simplemente hacé
                garabatos. Este espacio es tuyo. ✨
              </div>

            </div>

            <div className="dia-dibujo-controles">

              <label>
                Color

                <input
                  type="color"
                  value={colorLapiz}
                  onChange={(e) => {
                    setColorLapiz(e.target.value)

                    if (canvasRef.current) {
                      canvasRef.current
                        .getContext('2d')
                        .strokeStyle =
                        e.target.value
                    }
                  }}
                />
              </label>

              <label>
                Grosor

                <input
                  type="range"
                  min="1"
                  max="25"
                  value={grosorLapiz}
                  onChange={(e) =>
                    setGrosorLapiz(
                      Number(e.target.value)
                    )
                  }
                />
              </label>

              <button
                type="button"
                onClick={limpiarCanvas}
              >
                🧹 Limpiar
              </button>

            </div>

            <div className="dia-modal-footer">

              <button
                type="button"
                className="dia-boton-cancelar"
                onClick={() =>
                  setMostrarDibujo(false)
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="dia-boton-guardar"
                onClick={guardarDibujo}
              >
                💜 Guardar dibujo
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Diario