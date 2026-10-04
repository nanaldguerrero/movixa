import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde } from './nacionalidadUtils'
import './CrearViaje.css'

const checklistPorDefecto = [
  { id: 1, categoria: 'Papeleo', texto: 'Pasaporte vigente', hecho: false },
  { id: 2, categoria: 'Papeleo', texto: 'Visa (si aplica)', hecho: false },
  { id: 3, categoria: 'Papeleo', texto: 'Seguro de viaje', hecho: false },
  { id: 4, categoria: 'Papeleo', texto: 'Reserva de hotel', hecho: false },
  { id: 5, categoria: 'Maleta', texto: 'Ropa para el clima', hecho: false },
  { id: 6, categoria: 'Maleta', texto: 'Cargador y adaptador', hecho: false },
  { id: 7, categoria: 'Maleta', texto: 'Artículos de higiene', hecho: false },
  { id: 8, categoria: 'Antes de salir', texto: 'Avisar al banco del viaje', hecho: false },
  { id: 9, categoria: 'Antes de salir', texto: 'Confirmar transporte al aeropuerto', hecho: false },
]

const categoriaDestinos = {
  playa: ['Panamá', 'República Dominicana', 'Cuba', 'Colombia'],
  montaña: ['Perú', 'Chile', 'Argentina'],
  ciudad: [
    'España',
    'Francia',
    'Italia',
    'Alemania',
    'Japón',
    'Corea del Sur',
    'Reino Unido',
  ],
  aventura: ['Ecuador', 'Perú', 'Chile', 'Argentina'],
  relax: ['Panamá', 'República Dominicana', 'Cuba', 'México'],
}

const mapaRitmoCategoria = {
  Relax: 'relax',
  Aventura: 'aventura',
}

/* =========================================================
   ILUSTRACIÓN CENTRAL
========================================================= */

function IlustracionViaje() {
  return (
    <div className="cv-ilustracion">
      <svg
        viewBox="0 0 620 260"
        className="cv-ilustracion-svg"
        role="img"
        aria-label="Mapa, cámara y maleta de viaje"
      >
        {/* Ruta */}
        <path
          d="M105 140 C180 80, 235 185, 315 125 S455 70, 515 108"
          fill="none"
          stroke="#7654D9"
          strokeWidth="4"
          strokeDasharray="10 9"
          strokeLinecap="round"
        />

        {/* Punto inicial */}
        <circle
          cx="105"
          cy="140"
          r="8"
          fill="#7654D9"
        />

        {/* Punto destino */}
        <circle
          cx="515"
          cy="108"
          r="9"
          fill="#69BFE8"
        />

        {/* MAPA */}
        <g transform="translate(190 63)">
          <path
            d="M0 22 L82 5 L162 25 L242 7 L242 155 L162 173 L82 151 L0 168 Z"
            fill="#EEF5F3"
            stroke="#596B76"
            strokeWidth="3"
          />

          <path
            d="M82 5 L82 151"
            stroke="#9BB1B8"
            strokeWidth="2"
          />

          <path
            d="M162 25 L162 173"
            stroke="#9BB1B8"
            strokeWidth="2"
          />

          <path
            d="M23 55 C60 36, 91 73, 123 54 S183 44, 218 71"
            fill="none"
            stroke="#8CBCC8"
            strokeWidth="6"
            strokeLinecap="round"
            opacity=".65"
          />

          <path
            d="M32 113 C72 92, 101 123, 142 105 S197 94, 224 121"
            fill="none"
            stroke="#A7C7B7"
            strokeWidth="10"
            strokeLinecap="round"
            opacity=".45"
          />

          {/* Pin */}
          <path
            d="M121 56 C121 42, 132 32, 146 32 C160 32, 171 42, 171 56 C171 76, 146 98, 146 98 S121 76, 121 56Z"
            fill="#7046D8"
            stroke="#47308E"
            strokeWidth="3"
          />

          <circle
            cx="146"
            cy="55"
            r="7"
            fill="white"
          />
        </g>

        {/* CÁMARA */}
        <g transform="translate(54 158)">
          <rect
            x="0"
            y="26"
            width="125"
            height="72"
            rx="15"
            fill="#60707A"
            stroke="#35424B"
            strokeWidth="4"
          />

          <path
            d="M24 26 L38 7 L76 7 L89 26"
            fill="#778992"
            stroke="#35424B"
            strokeWidth="4"
          />

          <circle
            cx="62"
            cy="62"
            r="28"
            fill="#DCECF3"
            stroke="#35424B"
            strokeWidth="5"
          />

          <circle
            cx="62"
            cy="62"
            r="16"
            fill="#6B50D8"
          />

          <circle
            cx="67"
            cy="57"
            r="5"
            fill="#CFEFFF"
          />

          <circle
            cx="105"
            cy="43"
            r="6"
            fill="#F1C46C"
          />
        </g>

        {/* MALETA */}
        <g transform="translate(405 139)">
          <rect
            x="17"
            y="35"
            width="125"
            height="91"
            rx="17"
            fill="#6654B8"
            stroke="#3F347E"
            strokeWidth="4"
          />

          <rect
            x="48"
            y="8"
            width="61"
            height="35"
            rx="12"
            fill="none"
            stroke="#3F347E"
            strokeWidth="9"
          />

          <line
            x1="52"
            y1="43"
            x2="52"
            y2="119"
            stroke="#8A7BD0"
            strokeWidth="4"
          />

          <line
            x1="108"
            y1="43"
            x2="108"
            y2="119"
            stroke="#8A7BD0"
            strokeWidth="4"
          />

          {/* Estrella */}
          <path
            d="M79 55 L84 66 L96 67 L87 75 L90 87 L79 81 L68 87 L71 75 L62 67 L74 66 Z"
            fill="#F5C96B"
          />

          {/* Foto */}
          <rect
            x="92"
            y="90"
            width="30"
            height="23"
            rx="4"
            fill="#D8F0F3"
            transform="rotate(-5 92 90)"
          />

          <circle
            cx="100"
            cy="97"
            r="3"
            fill="#F0C56B"
          />

          <path
            d="M94 108 L103 101 L110 106 L117 101 L121 110"
            fill="#77B4A7"
          />
        </g>

        {/* NUBECITA */}
        <g transform="translate(465 35)">
          <circle
            cx="28"
            cy="26"
            r="20"
            fill="white"
            stroke="#AABAD0"
            strokeWidth="3"
          />

          <circle
            cx="51"
            cy="20"
            r="25"
            fill="white"
            stroke="#AABAD0"
            strokeWidth="3"
          />

          <circle
            cx="75"
            cy="29"
            r="19"
            fill="white"
            stroke="#AABAD0"
            strokeWidth="3"
          />

          <rect
            x="24"
            y="28"
            width="55"
            height="22"
            fill="white"
          />
        </g>
      </svg>
    </div>
  )
}

/* =========================================================
   SELLOS DECORATIVOS
========================================================= */

function SelloViaje({ texto, clase }) {
  return (
    <div className={`cv-sello ${clase || ''}`}>
      <span>✈</span>
      <strong>{texto}</strong>
      <small>✦ MOVIXA ✦</small>
    </div>
  )
}

function CrearViaje({ irADashboard, irADetalle, destinoInicial }) {
  const [sabeDestino, setSabeDestino] = useState(
    destinoInicial ? true : null
  )

  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState('')

  const [pasaportes, setPasaportes] = useState([])
  const [pasaporteSeleccionado, setPasaporteSeleccionado] = useState('')
  const [nacionalidadPerfil, setNacionalidadPerfil] = useState('')

  const [destinosDisponibles, setDestinosDisponibles] = useState([])
  const [destinoManual, setDestinoManual] = useState('')

  const [preferencia, setPreferencia] = useState('')
  const [sugerencias, setSugerencias] = useState([])

  const [climasPerfil, setClimasPerfil] = useState([])
  const [tiposDestinoPerfil, setTiposDestinoPerfil] = useState([])
  const [ritmoPerfil, setRitmoPerfil] = useState('')
  const [usarPreferenciasGuardadas, setUsarPreferenciasGuardadas] =
    useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('perfiles')
        .select(
          'pasaportes, nacionalidad, climas, tipos_destino, ritmo'
        )
        .eq('id', user.id)
        .single()

      const lista = data?.pasaportes || []

      setPasaportes(lista)
      setNacionalidadPerfil(data?.nacionalidad || '')

      if (lista.length > 0) {
        setPasaporteSeleccionado(lista[0])
      }

      setClimasPerfil(data?.climas || [])
      setTiposDestinoPerfil(data?.tipos_destino || [])
      setRitmoPerfil(data?.ritmo || '')

      const { data: destinos } = await supabase
        .from('requisitos_visa')
        .select('destino')

      if (destinos) {
        const unicos = [
          ...new Set(destinos.map((d) => d.destino)),
        ].sort((a, b) => a.localeCompare(b))

        setDestinosDisponibles(unicos)

        if (destinoInicial) {
          if (unicos.includes(destinoInicial)) {
            setDestino(destinoInicial)
          } else {
            setDestino('__otro__')
            setDestinoManual(destinoInicial)
          }
        }
      }
    }

    cargarDatos()
  }, [destinoInicial])

  const tienePreferenciasGuardadas =
    tiposDestinoPerfil.length > 0 || !!ritmoPerfil

  const obtenerSugerenciasDePerfil = (destinosDisp) => {
    const clavesValidas = Object.keys(categoriaDestinos)

    let candidatas = tiposDestinoPerfil
      .map((t) => t.toLowerCase())
      .filter((t) => clavesValidas.includes(t))

    if (candidatas.length === 0 && ritmoPerfil) {
      const clave = mapaRitmoCategoria[ritmoPerfil]

      if (clave) {
        candidatas = [clave]
      }
    }

    if (candidatas.length === 0) {
      candidatas = ['ciudad']
    }

    const todos = candidatas.flatMap(
      (c) => categoriaDestinos[c] || []
    )

    const unicos = [...new Set(todos)]

    return unicos
      .filter((c) => destinosDisp.includes(c))
      .slice(0, 3)
  }

  const elegirUsarPreferencias = () => {
    setUsarPreferenciasGuardadas(true)

    setSugerencias(
      obtenerSugerenciasDePerfil(destinosDisponibles)
    )
  }

  const elegirPreferencia = (valor) => {
    setPreferencia(valor)

    const candidatos = categoriaDestinos[valor] || []

    const disponibles = candidatos.filter((c) =>
      destinosDisponibles.includes(c)
    )

    setSugerencias(disponibles.slice(0, 3))
  }

  const crearViaje = async (destinoFinal, motivoFinal) => {
    setErrorCreacion('')

    if (!destinoFinal || destinoFinal.trim() === '') {
      setErrorCreacion(
        'Necesitás elegir un destino antes de continuar.'
      )
      return
    }

    setCreando(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setCreando(false)

      setErrorCreacion(
        'No pudimos confirmar tu sesión. Intentá iniciar sesión de nuevo.'
      )

      return
    }

    const nacionalidad = nacionalidadDesde(
      pasaporteSeleccionado,
      nacionalidadPerfil
    )

    await supabase
      .from('viajes')
      .update({ activo: false })
      .eq('user_id', user.id)

    const {
      data: requisito,
      error: errorRequisito,
    } = await supabase
      .from('requisitos_visa')
      .select('*')
      .eq('nacionalidad', nacionalidad)
      .ilike('destino', `%${destinoFinal}%`)
      .maybeSingle()

    if (errorRequisito) {
      console.warn(
        'No se pudo consultar requisitos:',
        errorRequisito.message
      )
    }

    const { data, error } = await supabase
      .from('viajes')
      .insert({
        user_id: user.id,
        destino: destinoFinal || 'Mi viaje',
        motivo: motivoFinal || 'Turismo',
        pasaporte: pasaporteSeleccionado || null,
        checklist: checklistPorDefecto,
        requisitos_snapshot: requisito || null,
        activo: true,
      })
      .select()
      .single()

    setCreando(false)

    if (error || !data) {
      setErrorCreacion(
        'Hubo un problema creando el viaje: ' +
          (error?.message ||
            'no se recibió confirmación del servidor.')
      )

      return
    }

    irADetalle(data.id)
  }

  const pasoActual =
    sabeDestino === null
      ? 1
      : sabeDestino === true
        ? 2
        : 2

  return (
    <div className="crear-viaje">

      {/* Decoraciones exteriores */}
      <SelloViaje
        texto="¡A LA AVENTURA!"
        clase="cv-sello-izquierdo"
      />

      <SelloViaje
        texto="NUEVAS HISTORIAS"
        clase="cv-sello-derecho"
      />

      <div className="cv-postal cv-postal-arriba">
        PASSPORT
        <span>✦</span>
      </div>

      <div className="cv-postal cv-postal-abajo">
        YOUR NEXT
        <span>ADVENTURE</span>
      </div>

      {/* HEADER */}
      <div className="cv-header">
        <button
          className="cv-volver"
          onClick={irADashboard}
        >
          <span className="cv-flecha">←</span>
          Volver
        </button>

        <div className="cv-logo">
          MOVIXA
        </div>
      </div>

      {/* RUTA DECORATIVA */}
      <div className="cv-ruta-fondo">
        <span className="cv-ruta-avion">✈</span>
        <span className="cv-ruta-punto cv-ruta-punto-1"></span>
        <span className="cv-ruta-punto cv-ruta-punto-2"></span>
        <span className="cv-ruta-punto cv-ruta-punto-3"></span>
      </div>

      {/* CARD */}
      <main className="cv-card">

        {/* PASOS */}
        <div className="cv-pasos">
          <div className="cv-paso-activo">
            <span>✧</span>
            PASO {pasoActual} DE 3
          </div>

          <div className="cv-pasos-linea">
            <span className="activo"></span>
            <span className={sabeDestino !== null ? 'activo' : ''}></span>
            <span></span>
          </div>
        </div>

        <div className="cv-titulo-wrap">
          <h1>
            {sabeDestino === null
              ? 'Planifiquemos tu aventura'
              : sabeDestino
                ? 'Cuéntanos sobre tu viaje'
                : 'Descubramos tu destino'}
          </h1>

          <div className="cv-estrellitas">
            ✦
          </div>

          <p>
            {sabeDestino === null
              ? 'Primero, contanos cómo querés comenzar.'
              : sabeDestino
                ? 'Unos pequeños detalles y MOVIXA se encargará del resto.'
                : 'Vamos a buscar un lugar que combine con vos.'}
          </p>
        </div>

        {/* ILUSTRACIÓN */}
        <IlustracionViaje />

        {/* =================================================
            PRIMER PASO
        ================================================= */}

        {sabeDestino === null && (
          <div className="cv-contenido">

            <button
              className="cv-opcion"
              onClick={() => setSabeDestino(true)}
            >
              <span className="cv-opcion-icono">
                <svg viewBox="0 0 64 64">
                  <path
                    d="M10 45 L17 20 L38 11 L54 20 L48 46 L29 54 Z"
                    fill="#DCEFF2"
                    stroke="#536B74"
                    strokeWidth="2"
                  />
                  <path
                    d="M28 16 L29 51"
                    stroke="#8BAAB1"
                    strokeWidth="2"
                  />
                  <path
                    d="M17 34 L29 29 L48 34"
                    fill="none"
                    stroke="#9BC3B8"
                    strokeWidth="3"
                  />
                  <path
                    d="M27 22 C27 16 32 12 38 12 C44 12 49 16 49 22 C49 31 38 40 38 40 S27 31 27 22Z"
                    fill="#7046D8"
                  />
                  <circle
                    cx="38"
                    cy="22"
                    r="4"
                    fill="white"
                  />
                </svg>
              </span>

              <span className="cv-opcion-texto">
                <strong>Ya tengo un destino</strong>
                <small>
                  Sé exactamente dónde quiero ir.
                </small>
              </span>

              <span className="cv-opcion-flecha">
                →
              </span>
            </button>

            <button
              className="cv-opcion cv-opcion-secundaria"
              onClick={() => setSabeDestino(false)}
            >
              <span className="cv-opcion-icono">
                <svg viewBox="0 0 64 64">
                  <path
                    d="M31 10 L31 53"
                    stroke="#7050D0"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M31 20 L52 20"
                    stroke="#7050D0"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M31 35 L12 35"
                    stroke="#6DBFD8"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M31 48 L48 48"
                    stroke="#E5A88D"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M50 14 L58 20 L50 26"
                    fill="#7050D0"
                  />

                  <path
                    d="M14 29 L6 35 L14 41"
                    fill="#6DBFD8"
                  />

                  <path
                    d="M46 42 L54 48 L46 54"
                    fill="#E5A88D"
                  />

                  <circle
                    cx="31"
                    cy="20"
                    r="5"
                    fill="#F0C567"
                  />

                  <circle
                    cx="31"
                    cy="35"
                    r="5"
                    fill="#8FC8A7"
                  />
                </svg>
              </span>

              <span className="cv-opcion-texto">
                <strong>Quiero descubrir un destino</strong>
                <small>
                  Ayúdame a encontrar el lugar perfecto para mí.
                </small>
              </span>

              <span className="cv-opcion-flecha">
                →
              </span>
            </button>

          </div>
        )}

        {/* =================================================
            DESTINO CONOCIDO
        ================================================= */}

        {sabeDestino === true && (
          <div className="cv-formulario">

            {pasaportes.length > 1 && (
              <div className="cv-campo">
                <label className="cv-label">
                  <span>🛂</span>
                  ¿Con qué pasaporte vas a viajar?
                </label>

                <select
                  className="cv-input"
                  value={pasaporteSeleccionado}
                  onChange={(e) =>
                    setPasaporteSeleccionado(e.target.value)
                  }
                >
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="cv-campo">
              <label className="cv-label">
                <span>📍</span>
                ¿A dónde querés ir?
              </label>

              <select
                className="cv-input"
                value={destino}
                onChange={(e) =>
                  setDestino(e.target.value)
                }
              >
                <option value="">
                  Seleccioná una opción
                </option>

                {destinosDisponibles.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}

                <option value="__otro__">
                  Otro (escribir destino)
                </option>
              </select>

              {destino === '__otro__' && (
                <input
                  type="text"
                  placeholder="Escribí tu destino"
                  className="cv-input"
                  value={destinoManual}
                  onChange={(e) =>
                    setDestinoManual(e.target.value)
                  }
                />
              )}
            </div>

            <div className="cv-campo">
              <label className="cv-label">
                <span>✈️</span>
                Motivo del viaje
              </label>

              <select
                className="cv-input"
                value={motivo}
                onChange={(e) =>
                  setMotivo(e.target.value)
                }
              >
                <option value="">
                  Seleccioná una opción
                </option>

                <option value="turismo">
                  Turismo
                </option>

                <option value="educacion">
                  Educación
                </option>

                <option value="negocios">
                  Negocios
                </option>

                <option value="reubicacion">
                  Reubicación
                </option>

                <option value="otro">
                  Otro
                </option>
              </select>
            </div>

            {errorCreacion && (
              <p className="cv-error">
                ⚠️ {errorCreacion}
              </p>
            )}

            <button
              className="cv-boton"
              onClick={() =>
                crearViaje(
                  destino === '__otro__'
                    ? destinoManual
                    : destino,
                  motivo
                )
              }
              disabled={creando}
            >
              <span>
                {creando
                  ? 'Creando tu aventura...'
                  : 'Continuar'}
              </span>

              {!creando && <span>→</span>}
            </button>

            <button
              className="cv-atras"
              onClick={() => setSabeDestino(null)}
            >
              ← Volver a elegir
            </button>
          </div>
        )}

        {/* =================================================
            DESCUBRIR DESTINO
        ================================================= */}

        {sabeDestino === false && (
          <div className="cv-formulario">

            {pasaportes.length > 1 && (
              <div className="cv-campo">
                <label className="cv-label">
                  <span>🛂</span>
                  ¿Con qué pasaporte vas a viajar?
                </label>

                <select
                  className="cv-input"
                  value={pasaporteSeleccionado}
                  onChange={(e) =>
                    setPasaporteSeleccionado(e.target.value)
                  }
                >
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {usarPreferenciasGuardadas === null &&
              tienePreferenciasGuardadas && (
                <div className="cv-descubrimiento">

                  <div className="cv-mini-intro">
                    <span>✨</span>

                    <div>
                      <strong>
                        Conocemos un poquito tus gustos
                      </strong>

                      <p>
                        Podemos usar la información que
                        guardaste en tu Perfil.
                      </p>
                    </div>
                  </div>

                  <div className="cv-chips-perfil">
                    {tiposDestinoPerfil.map((t) => (
                      <span
                        key={t}
                        className="cv-chip"
                      >
                        {t}
                      </span>
                    ))}

                    {ritmoPerfil && (
                      <span className="cv-chip">
                        {ritmoPerfil}
                      </span>
                    )}

                    {climasPerfil.length > 0 &&
                      climasPerfil.map((c) => (
                        <span
                          key={c}
                          className="cv-chip cv-chip-clima"
                        >
                          ☁ {c}
                        </span>
                      ))}
                  </div>

                  <button
                    className="cv-opcion cv-opcion-mini"
                    onClick={elegirUsarPreferencias}
                  >
                    <span className="cv-opcion-icono">
                      ✨
                    </span>

                    <span className="cv-opcion-texto">
                      <strong>
                        Sí, recomendame con esto
                      </strong>

                      <small>
                        Usá mis preferencias guardadas.
                      </small>
                    </span>

                    <span className="cv-opcion-flecha">
                      →
                    </span>
                  </button>

                  <button
                    className="cv-opcion cv-opcion-secundaria cv-opcion-mini"
                    onClick={() =>
                      setUsarPreferenciasGuardadas(false)
                    }
                  >
                    <span className="cv-opcion-icono">
                      🧭
                    </span>

                    <span className="cv-opcion-texto">
                      <strong>
                        Quiero algo distinto
                      </strong>

                      <small>
                        Elegiré qué tipo de viaje quiero.
                      </small>
                    </span>

                    <span className="cv-opcion-flecha">
                      →
                    </span>
                  </button>

                  <button
                    className="cv-atras"
                    onClick={() =>
                      setSabeDestino(null)
                    }
                  >
                    ← Volver
                  </button>
                </div>
              )}

            {(usarPreferenciasGuardadas === false ||
              (usarPreferenciasGuardadas === null &&
                !tienePreferenciasGuardadas)) &&
              sugerencias.length === 0 && (
                <div className="cv-descubrimiento">

                  <div className="cv-descubrimiento-titulo">
                    <span>🧭</span>

                    <div>
                      <h3>
                        ¿Qué te gustaría encontrar?
                      </h3>

                      <p>
                        Elegí el estilo de aventura que
                        más te llama la atención.
                      </p>
                    </div>
                  </div>

                  <div className="cv-campo">
                    <label className="cv-label">
                      Tu tipo de viaje
                    </label>

                    <select
                      className="cv-input"
                      value={preferencia}
                      onChange={(e) =>
                        elegirPreferencia(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Seleccioná una opción
                      </option>

                      <option value="playa">
                        🏝️ Playa
                      </option>

                      <option value="montaña">
                        🏔️ Montaña
                      </option>

                      <option value="ciudad">
                        🏙️ Ciudad / cultura
                      </option>

                      <option value="aventura">
                        🥾 Aventura
                      </option>

                      <option value="relax">
                        🌴 Relax
                      </option>
                    </select>
                  </div>

                  <button
                    className="cv-atras"
                    onClick={() =>
                      setSabeDestino(null)
                    }
                  >
                    ← Volver
                  </button>
                </div>
              )}

            {sugerencias.length > 0 && (
              <div className="cv-recomendaciones">

                <div className="cv-recomendaciones-header">
                  <span className="cv-compas">
                    ✦
                  </span>

                  <div>
                    <h3>
                      Destinos para vos
                    </h3>

                    <p>
                      Elegimos estas opciones según
                      tus preferencias.
                    </p>
                  </div>
                </div>

                {errorCreacion && (
                  <p className="cv-error">
                    ⚠️ {errorCreacion}
                  </p>
                )}

                <div className="cv-destinos">
                  {sugerencias.map((pais, index) => (
                    <button
                      key={pais}
                      className="cv-destino-card"
                      onClick={() =>
                        crearViaje(
                          pais,
                          'Turismo'
                        )
                      }
                      disabled={creando}
                    >
                      <span className="cv-destino-numero">
                        0{index + 1}
                      </span>

                      <span className="cv-destino-icono">
                        📍
                      </span>

                      <span className="cv-destino-nombre">
                        {pais}
                      </span>

                      <span className="cv-destino-flecha">
                        →
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  className="cv-atras"
                  onClick={() => {
                    setSugerencias([])
                    setPreferencia('')
                    setUsarPreferenciasGuardadas(null)
                  }}
                >
                  ← Elegir de otra forma
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Frase inferior */}
      <div className="cv-frase-final">
        <span>✈</span>
        Nuevas historias te esperan
        <span>✦</span>
      </div>

    </div>
  )
}

export default CrearViaje