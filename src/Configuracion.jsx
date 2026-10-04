import { useState, useEffect } from 'react'
import { useConfiguracion } from './ConfiguracionContext'
import { supabase } from './supabaseClient'
import './Configuracion.css'

const temas = [
  { id: 'claro', emoji: '☀️', nombre: 'Claro' },
  { id: 'oscuro', emoji: '🌙', nombre: 'Oscuro' },
]

const tamaños = [
  { id: 'pequena', nombre: 'Pequeña' },
  { id: 'normal', nombre: 'Normal' },
  { id: 'grande', nombre: 'Grande' },
]

const tiposLetra = [
  { id: 'normal', nombre: 'Normal' },
  { id: 'cursiva', nombre: 'Cursiva' },
  { id: 'clasica', nombre: 'Clásica' },
]

const companeros = [
  { id: 'perro', nombre: 'Perro' },
  { id: 'gato', nombre: 'Gato' },
  { id: 'tortuga', nombre: 'Tortuga' },
  { id: 'ninguno', nombre: 'Ninguno' },
]

/* =========================================================
   ILUSTRACIONES SVG
   Solo visuales. No afectan la funcionalidad.
========================================================= */

function CompaneroSVG({ tipo }) {

  /* =========================
     PERRO
  ========================= */
  if (tipo === 'perro') {
    return (
      <svg
        className="companion-svg companion-dog"
        viewBox="0 0 140 125"
        aria-hidden="true"
      >
        <ellipse
          className="svg-shadow"
          cx="70"
          cy="112"
          rx="36"
          ry="5"
        />

        {/* orejas */}
        <path
          className="dog-ear"
          d="M40 42 C24 25 17 31 21 53 C23 66 31 72 43 66 L48 51 Z"
        />

        <path
          className="dog-ear"
          d="M100 42 C116 25 123 31 119 53 C117 66 109 72 97 66 L92 51 Z"
        />

        {/* cabeza */}
        <path
          className="dog-head"
          d="M70 27
             C48 27 34 43 34 67
             C34 91 49 105 70 105
             C91 105 106 91 106 67
             C106 43 92 27 70 27 Z"
        />

        {/* manchita */}
        <path
          className="dog-spot"
          d="M76 31
             C91 34 99 46 98 58
             C94 56 89 55 84 57
             C79 52 76 43 76 31 Z"
        />

        {/* ojos */}
        <ellipse
          className="dog-eye"
          cx="55"
          cy="62"
          rx="5"
          ry="6"
        />

        <ellipse
          className="dog-eye"
          cx="85"
          cy="62"
          rx="5"
          ry="6"
        />

        <circle
          className="dog-eye-shine"
          cx="53.5"
          cy="60"
          r="1.5"
        />

        <circle
          className="dog-eye-shine"
          cx="83.5"
          cy="60"
          r="1.5"
        />

        {/* hocico */}
        <ellipse
          className="dog-muzzle"
          cx="70"
          cy="76"
          rx="17"
          ry="13"
        />

        <path
          className="dog-nose"
          d="M63 72
             Q70 67 77 72
             Q77 78 70 80
             Q63 78 63 72 Z"
        />

        {/* boca */}
        <path
          className="dog-mouth"
          d="M70 79
             C70 84 65 85 63 82
             M70 79
             C70 84 75 85 77 82"
        />

        {/* lengua */}
        <path
          className="dog-tongue"
          d="M66 84 Q70 81 74 84 Q74 92 70 94 Q66 92 66 84 Z"
        />

        {/* pañuelo */}
        <path
          className="dog-scarf"
          d="M38 82
             Q70 94 102 82
             L98 94
             Q70 104 42 94 Z"
        />

        <path
          className="dog-scarf-tip"
          d="M91 91 L104 103 L92 99 Z"
        />

        {/* pequeña maleta */}
        <rect
          className="dog-bag"
          x="101"
          y="78"
          width="25"
          height="25"
          rx="7"
        />

        <path
          className="dog-bag-handle"
          d="M107 78 V72 Q113 67 120 72 V78"
        />

        <circle
          className="dog-bag-detail"
          cx="113.5"
          cy="90"
          r="2"
        />
      </svg>
    )
  }

  /* =========================
     GATO
  ========================= */
  if (tipo === 'gato') {
    return (
      <svg
        className="companion-svg companion-cat"
        viewBox="0 0 140 125"
        aria-hidden="true"
      >
        <ellipse
          className="svg-shadow"
          cx="70"
          cy="112"
          rx="36"
          ry="5"
        />

        {/* orejas */}
        <path
          className="cat-ear"
          d="M38 48 L40 19 L61 39 Z"
        />

        <path
          className="cat-ear"
          d="M102 48 L100 19 L79 39 Z"
        />

        <path
          className="cat-ear-inner"
          d="M43 39 L43 27 L54 39 Z"
        />

        <path
          className="cat-ear-inner"
          d="M97 39 L97 27 L86 39 Z"
        />

        {/* cabeza */}
        <path
          className="cat-head"
          d="M70 29
             C48 29 34 45 34 68
             C34 91 49 105 70 105
             C91 105 106 91 106 68
             C106 45 92 29 70 29 Z"
        />

        {/* ojos */}
        <ellipse
          className="cat-eye"
          cx="55"
          cy="62"
          rx="5"
          ry="7"
        />

        <ellipse
          className="cat-eye"
          cx="85"
          cy="62"
          rx="5"
          ry="7"
        />

        <path
          className="cat-pupil"
          d="M55 57 V67"
        />

        <path
          className="cat-pupil"
          d="M85 57 V67"
        />

        {/* nariz */}
        <path
          className="cat-nose"
          d="M66 73 Q70 70 74 73 Q70 78 66 73 Z"
        />

        {/* boca */}
        <path
          className="cat-mouth"
          d="M70 77
             C70 82 65 83 63 80
             M70 77
             C70 82 75 83 77 80"
        />

        {/* bigotes */}
        <path
          className="cat-whisker"
          d="M48 76 L23 71"
        />

        <path
          className="cat-whisker"
          d="M48 82 L22 83"
        />

        <path
          className="cat-whisker"
          d="M92 76 L117 71"
        />

        <path
          className="cat-whisker"
          d="M92 82 L118 83"
        />

        {/* pañuelo */}
        <path
          className="cat-scarf"
          d="M40 86
             Q70 96 100 86
             L96 98
             Q70 106 44 98 Z"
        />

        {/* maletita */}
        <rect
          className="cat-suitcase"
          x="45"
          y="91"
          width="50"
          height="23"
          rx="6"
        />

        <path
          className="cat-suitcase-handle"
          d="M57 91 V85 Q70 78 83 85 V91"
        />

        <circle
          className="cat-suitcase-detail"
          cx="70"
          cy="102"
          r="2"
        />
      </svg>
    )
  }

  /* =========================
     TORTUGA
  ========================= */
  if (tipo === 'tortuga') {
    return (
      <svg
        className="companion-svg companion-turtle"
        viewBox="0 0 140 125"
        aria-hidden="true"
      >
        <ellipse
          className="svg-shadow"
          cx="68"
          cy="111"
          rx="39"
          ry="5"
        />

        <ellipse
          className="turtle-shell"
          cx="64"
          cy="66"
          rx="39"
          ry="30"
        />

        {/* diseño caparazón */}
        <path
          className="turtle-shell-line"
          d="M64 36 V96
             M28 66 H100
             M39 45 L89 87
             M89 45 L39 87"
        />

        {/* cabeza */}
        <circle
          className="turtle-head"
          cx="104"
          cy="66"
          r="16"
        />

        <circle
          className="turtle-eye"
          cx="109"
          cy="62"
          r="3"
        />

        <circle
          className="turtle-eye-shine"
          cx="110"
          cy="61"
          r="1"
        />

        {/* patitas */}
        <path
          className="turtle-leg"
          d="M35 83 Q25 98 17 91"
        />

        <path
          className="turtle-leg"
          d="M52 91 Q46 106 37 100"
        />

        <path
          className="turtle-leg"
          d="M78 91 Q84 106 93 100"
        />

        {/* mochila */}
        <rect
          className="turtle-backpack"
          x="48"
          y="43"
          width="28"
          height="24"
          rx="7"
        />

        <path
          className="turtle-backpack-line"
          d="M55 43 V37 Q62 32 69 37 V43"
        />

        <circle
          className="turtle-backpack-detail"
          cx="62"
          cy="54"
          r="2"
        />
      </svg>
    )
  }

  /* =========================
     NINGUNO / VIAJERO
  ========================= */
  return (
    <svg
      className="companion-svg companion-none"
      viewBox="0 0 140 125"
      aria-hidden="true"
    >
      <ellipse
        className="svg-shadow"
        cx="70"
        cy="111"
        rx="35"
        ry="5"
      />

      {/* globo */}
      <circle
        className="globe"
        cx="63"
        cy="65"
        r="34"
      />

      <path
        className="globe-line"
        d="M29 65 H97
           M63 31 C46 43 46 87 63 99
           M63 31 C80 43 80 87 63 99"
      />

      {/* avión */}
      <path
        className="airplane"
        d="M92 32
           L124 23
           L106 48
           L95 45
           L86 58
           L81 56
           L89 43
           L79 38
           Z"
      />

      <path
        className="airplane-detail"
        d="M95 45 L106 48"
      />
    </svg>
  )
}

/* =========================================================
   COMPONENTE
========================================================= */

function Configuracion({
  irADashboard,
  onCerrarSesion,
}) {
  const {
    tema,
    setTema,
    tamañoLetra,
    setTamañoLetra,
    tipoLetra,
    setTipoLetra,
    idioma,
    setIdioma,
    companero,
    setCompanero,
  } = useConfiguracion()

  const [userId, setUserId] = useState(null)

  const [notifViajes, setNotifViajes] = useState(true)
  const [notifDocumentos, setNotifDocumentos] = useState(true)
  const [notifOfertas, setNotifOfertas] = useState(false)

  const [permisoNotif, setPermisoNotif] = useState('default')
  const [avisoPermiso, setAvisoPermiso] = useState('')

  const [cambiandoPass, setCambiandoPass] = useState(false)
  const [passActual, setPassActual] = useState('')
  const [passNueva, setPassNueva] = useState('')
  const [passConfirmar, setPassConfirmar] = useState('')
  const [errorPass, setErrorPass] = useState('')
  const [guardandoPass, setGuardandoPass] = useState(false)
  const [exitoPass, setExitoPass] = useState('')

  const [correoVerificado, setCorreoVerificado] = useState(false)
  const [correoUsuario, setCorreoUsuario] = useState('')
  const [enviandoVerificacion, setEnviandoVerificacion] = useState(false)
  const [mensajeVerificacion, setMensajeVerificacion] = useState('')

  const [cerrandoOtras, setCerrandoOtras] = useState(false)
  const [mensajeOtras, setMensajeOtras] = useState('')

  const sesiones = [
    { id: 1, dispositivo: 'Este navegador', actual: true },
  ]

  useEffect(() => {
    const cargarDatos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        setCorreoUsuario(user.email || '')
        setCorreoVerificado(!!user.email_confirmed_at)

        const { data } = await supabase
          .from('perfiles')
          .select('notif_viajes, notif_documentos')
          .eq('id', user.id)
          .single()

        if (data) {
          setNotifViajes(data.notif_viajes !== false)
          setNotifDocumentos(data.notif_documentos !== false)
        }
      }

      if (typeof Notification !== 'undefined') {
        setPermisoNotif(Notification.permission)
      }
    }

    cargarDatos()
  }, [])

  const pedirPermisoNotif = async () => {
    if (typeof Notification === 'undefined') {
      setAvisoPermiso(
        'Las notificaciones no están disponibles en este navegador.'
      )
      return
    }

    try {
      const permiso = await Notification.requestPermission()
      setPermisoNotif(permiso)

      if (permiso === 'granted') {
        setAvisoPermiso('Notificaciones activadas.')
      } else if (permiso === 'denied') {
        setAvisoPermiso('El navegador bloqueó las notificaciones.')
      }
    } catch {
      setAvisoPermiso('No fue posible solicitar el permiso.')
    }
  }

  const toggleNotifViajes = async () => {
    const nuevo = !notifViajes
    setNotifViajes(nuevo)

    if (userId) {
      await supabase
        .from('perfiles')
        .update({ notif_viajes: nuevo })
        .eq('id', userId)
    }
  }

  const toggleNotifDocumentos = async () => {
    const nuevo = !notifDocumentos
    setNotifDocumentos(nuevo)

    if (userId) {
      await supabase
        .from('perfiles')
        .update({ notif_documentos: nuevo })
        .eq('id', userId)
    }
  }

  const cambiarPassword = async () => {
    setErrorPass('')
    setExitoPass('')

    if (!passActual || !passNueva || !passConfirmar) {
      setErrorPass('Completa todos los campos.')
      return
    }

    if (passNueva.length < 6) {
      setErrorPass(
        'La nueva contraseña debe tener al menos 6 caracteres.'
      )
      return
    }

    if (passNueva !== passConfirmar) {
      setErrorPass('Las contraseñas no coinciden.')
      return
    }

    setGuardandoPass(true)

    try {
      const { data: userData } =
        await supabase.auth.getUser()

      if (!userData?.user?.email) {
        setErrorPass('No se encontró el usuario.')
        return
      }

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: userData.user.email,
          password: passActual,
        })

      if (loginError) {
        setErrorPass('La contraseña actual no es correcta.')
        return
      }

      const { error } =
        await supabase.auth.updateUser({
          password: passNueva,
        })

      if (error) {
        setErrorPass(error.message)
        return
      }

      setExitoPass(
        'Contraseña actualizada correctamente.'
      )

      setPassActual('')
      setPassNueva('')
      setPassConfirmar('')
      setCambiandoPass(false)
    } finally {
      setGuardandoPass(false)
    }
  }

  const enviarVerificacion = async () => {
    if (!correoUsuario) return

    setEnviandoVerificacion(true)
    setMensajeVerificacion('')

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: correoUsuario,
    })

    if (error) {
      setMensajeVerificacion(
        'No fue posible enviar el correo de verificación.'
      )
    } else {
      setMensajeVerificacion(
        'Correo de verificación enviado.'
      )
    }

    setEnviandoVerificacion(false)
  }

  const cerrarOtrasSesiones = async () => {
    setCerrandoOtras(true)
    setMensajeOtras('')

    const { error } =
      await supabase.auth.signOut({
        scope: 'others',
      })

    if (error) {
      setMensajeOtras(
        'No fue posible cerrar las otras sesiones.'
      )
    } else {
      setMensajeOtras(
        'Las otras sesiones fueron cerradas.'
      )
    }

    setCerrandoOtras(false)
  }

  return (
    <div
      className={`config ${
        tema === 'oscuro' ? 'config-dark' : ''
      }`}
    >
      <div className="config-bg-orb config-bg-orb-1" />
      <div className="config-bg-orb config-bg-orb-2" />

      <div className="config-header">
        <button
          className="config-volver"
          onClick={irADashboard}
        >
          <span className="config-volver-icon">←</span>
          Volver
        </button>

        <div className="config-logo">
          MOVIXA
        </div>
      </div>

      <div className="config-intro">
        <div className="config-intro-text">
          <span className="config-kicker">
            TU EXPERIENCIA DE VIAJE
          </span>

          <h2 className="config-titulo">
            Personaliza tu MOVIXA
          </h2>

          <p className="config-subtitulo">
            Ajusta tu experiencia para que cada aventura
            se sienta como tuya.
          </p>
        </div>

        <div
          className="config-plane-deco"
          aria-hidden="true"
        >
          <svg viewBox="0 0 150 90">
            <path
              className="deco-route"
              d="M10 72 C45 15 92 88 140 20"
            />

            <path
              className="deco-plane"
              d="M93 38
                 L119 27
                 L104 48
                 L96 45
                 L89 54
                 L85 52
                 L91 43
                 L84 39
                 Z"
            />
          </svg>
        </div>
      </div>

      {/* COMPAÑERO */}
      <section className="config-seccion config-seccion-companero">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              COMPAÑERO DE VIAJE
            </span>

            <h3>¿Quién te acompaña?</h3>
          </div>

          <div className="config-sticker">
            ADVENTURE
          </div>
        </div>

        <div className="config-companeros">
          {companeros.map((c) => (
            <button
              key={c.id}
              className={`config-companero ${
                companero === c.id
                  ? 'config-companero-activo'
                  : ''
              }`}
              onClick={() => setCompanero(c.id)}
              type="button"
            >
              <div className="config-companero-art">
                <CompaneroSVG tipo={c.id} />
              </div>

              <span>{c.nombre}</span>

              {companero === c.id && (
                <span className="config-companero-check">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* APARIENCIA */}
      <section className="config-seccion">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              APARIENCIA
            </span>

            <h3>Haz que MOVIXA se sienta tuyo</h3>
          </div>
        </div>

        <div className="config-fila config-theme-row">
          <div className="config-fila-label">
            <strong>Tema</strong>
            <span>
              Elige la atmósfera de tu aventura
            </span>
          </div>

          <div className="config-theme-options">
            {temas.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`config-theme-card ${
                  tema === t.id
                    ? 'config-theme-card-activo'
                    : ''
                }`}
                onClick={() => setTema(t.id)}
              >
                <span
                  className={`theme-preview theme-preview-${t.id}`}
                >
                  <span className="theme-preview-sun" />
                  <span className="theme-preview-moon" />
                </span>

                <span>{t.nombre}</span>

                {tema === t.id && (
                  <span className="theme-check">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="config-divider" />

        <div className="config-fila">
          <div className="config-fila-label">
            <strong>Tamaño del texto</strong>
            <span>
              Adapta la lectura a tu comodidad
            </span>
          </div>

          <div className="config-toggle-grupo-3">
            {tamaños.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`config-toggle ${
                  tamañoLetra === t.id
                    ? 'config-toggle-activo'
                    : ''
                }`}
                onClick={() => setTamañoLetra(t.id)}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="config-fila">
          <div className="config-fila-label">
            <strong>Tipo de letra</strong>
            <span>
              Escoge tu estilo favorito
            </span>
          </div>

          <div className="config-toggle-grupo">
            {tiposLetra.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`config-toggle ${
                  tipoLetra === t.id
                    ? 'config-toggle-activo'
                    : ''
                }`}
                onClick={() => setTipoLetra(t.id)}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* IDIOMA */}
      <section className="config-seccion">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              IDIOMA
            </span>

            <h3>Tu MOVIXA, tu idioma</h3>
          </div>

          <div className="config-language-mark">
            A
          </div>
        </div>

        <div className="config-language-options">
          <button
            type="button"
            className={`config-language-card ${
              idioma === 'es'
                ? 'config-language-card-activo'
                : ''
            }`}
            onClick={() => setIdioma('es')}
          >
            <span className="language-flag">
              ES
            </span>

            <span>
              <strong>Español</strong>
              <small>Español</small>
            </span>

            {idioma === 'es' && (
              <span className="theme-check">
                ✓
              </span>
            )}
          </button>

          <button
            type="button"
            className={`config-language-card ${
              idioma === 'en'
                ? 'config-language-card-activo'
                : ''
            }`}
            onClick={() => setIdioma('en')}
          >
            <span className="language-flag">
              EN
            </span>

            <span>
              <strong>English</strong>
              <small>English</small>
            </span>

            {idioma === 'en' && (
              <span className="theme-check">
                ✓
              </span>
            )}
          </button>
        </div>
      </section>

      {/* NOTIFICACIONES */}
      <section className="config-seccion">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              ALERTAS DE VIAJE
            </span>

            <h3>Notificaciones</h3>
          </div>

          <div className="config-bell">
            <span />
          </div>
        </div>

        <p className="config-descripcion">
          MOVIXA puede avisarte sobre información
          importante de tus aventuras.
        </p>

        <div className="config-switch-fila">
          <div className="config-switch-label">
            <strong>Mis viajes</strong>
            <span>
              Recordatorios y cambios importantes
            </span>
          </div>

          <button
            type="button"
            className={`config-switch ${
              notifViajes
                ? 'config-switch-on'
                : ''
            }`}
            onClick={() => {
              if (permisoNotif !== 'granted') {
                pedirPermisoNotif()
              }

              toggleNotifViajes()
            }}
            aria-label="Notificaciones de viajes"
          >
            <span className="config-switch-bola" />
          </button>
        </div>

        <div className="config-switch-fila">
          <div className="config-switch-label">
            <strong>Documentos</strong>
            <span>
              Alertas sobre papeleo y requisitos
            </span>
          </div>

          <button
            type="button"
            className={`config-switch ${
              notifDocumentos
                ? 'config-switch-on'
                : ''
            }`}
            onClick={() => {
              if (permisoNotif !== 'granted') {
                pedirPermisoNotif()
              }

              toggleNotifDocumentos()
            }}
            aria-label="Notificaciones de documentos"
          >
            <span className="config-switch-bola" />
          </button>
        </div>

        <div className="config-switch-fila">
          <div className="config-switch-label">
            <strong>Ofertas</strong>
            <span>
              Promociones relacionadas con viajes
            </span>
          </div>

          <button
            type="button"
            className={`config-switch ${
              notifOfertas
                ? 'config-switch-on'
                : ''
            }`}
            onClick={() =>
              setNotifOfertas(!notifOfertas)
            }
            aria-label="Notificaciones de ofertas"
          >
            <span className="config-switch-bola" />
          </button>
        </div>

        {avisoPermiso && (
          <p className="config-mensaje">
            {avisoPermiso}
          </p>
        )}
      </section>

      {/* SEGURIDAD */}
      <section className="config-seccion">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              PROTEGE TU CUENTA
            </span>

            <h3>Seguridad</h3>
          </div>

          <div className="config-security-mark">
            <span />
          </div>
        </div>

        <button
          type="button"
          className="config-fila-boton"
          onClick={() => {
            setCambiandoPass(!cambiandoPass)
            setErrorPass('')
            setExitoPass('')
          }}
        >
          <span>
            <strong>Cambiar contraseña</strong>
            <small>
              Actualiza tu contraseña de acceso
            </small>
          </span>

          <span className="config-fila-flecha">
            {cambiandoPass ? '−' : '＋'}
          </span>
        </button>

        {cambiandoPass && (
          <div className="config-form-inline">
            <input
              className="config-input"
              type="password"
              placeholder="Contraseña actual"
              value={passActual}
              onChange={(e) =>
                setPassActual(e.target.value)
              }
            />

            <input
              className="config-input"
              type="password"
              placeholder="Nueva contraseña"
              value={passNueva}
              onChange={(e) =>
                setPassNueva(e.target.value)
              }
            />

            <input
              className="config-input"
              type="password"
              placeholder="Confirmar contraseña"
              value={passConfirmar}
              onChange={(e) =>
                setPassConfirmar(e.target.value)
              }
            />

            {errorPass && (
              <p className="config-mensaje-error">
                {errorPass}
              </p>
            )}

            {exitoPass && (
              <p className="config-mensaje-exito">
                {exitoPass}
              </p>
            )}

            <button
              type="button"
              className="config-boton-guardar"
              onClick={cambiarPassword}
              disabled={guardandoPass}
            >
              {guardandoPass
                ? 'Guardando...'
                : 'Guardar nueva contraseña'}
            </button>
          </div>
        )}

        <div className="config-email-row">
          <div>
            <strong>Correo electrónico</strong>
            <small>{correoUsuario}</small>
          </div>

          {correoVerificado ? (
            <span className="config-badge-verificado">
              Verificado
            </span>
          ) : (
            <button
              type="button"
              className="config-boton-chico"
              onClick={enviarVerificacion}
              disabled={enviandoVerificacion}
            >
              {enviandoVerificacion
                ? 'Enviando...'
                : 'Verificar'}
            </button>
          )}
        </div>

        {mensajeVerificacion && (
          <p className="config-mensaje">
            {mensajeVerificacion}
          </p>
        )}

        <div className="config-sesiones">
          <p className="config-sesiones-titulo">
            SESIONES ACTIVAS
          </p>

          {sesiones.map((sesion) => (
            <div
              key={sesion.id}
              className="config-sesion-item"
            >
              <span>
                {sesion.dispositivo}
              </span>

              {sesion.actual && (
                <span className="config-badge-actual">
                  Actual
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="config-boton-peligro"
          onClick={cerrarOtrasSesiones}
          disabled={cerrandoOtras}
        >
          {cerrandoOtras
            ? 'Cerrando sesiones...'
            : 'Cerrar otras sesiones'}
        </button>

        {mensajeOtras && (
          <p className="config-mensaje">
            {mensajeOtras}
          </p>
        )}
      </section>

      {/* ACERCA DE */}
      <section className="config-seccion">
        <div className="config-seccion-heading">
          <div>
            <span className="config-seccion-kicker">
              MOVIXA
            </span>

            <h3>Acerca de la aplicación</h3>
          </div>
        </div>

        <div className="config-info-version">
          <div>
            <strong>Versión</strong>
            <span>1.0.0 (MVP)</span>
          </div>

          <div className="config-version-ticket">
            YOUR JOURNEY
          </div>
        </div>

        <button
          type="button"
          className="config-fila-boton"
        >
          <span>Términos y condiciones</span>
          <span className="config-fila-flecha">
            →
          </span>
        </button>

        <button
          type="button"
          className="config-fila-boton"
        >
          <span>Política de privacidad</span>
          <span className="config-fila-flecha">
            →
          </span>
        </button>

        <button
          type="button"
          className="config-fila-boton"
        >
          <span>Ayuda y soporte</span>
          <span className="config-fila-flecha">
            →
          </span>
        </button>
      </section>

      <button
        type="button"
        className="config-cerrar-sesion"
        onClick={onCerrarSesion}
      >
        Cerrar sesión
      </button>

      <div className="config-footer">
        <span>✈</span>
        <span>MADE FOR YOUR NEXT ADVENTURE</span>
        <span>✈</span>
      </div>
    </div>
  )
}

export default Configuracion