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
  { id: 'perro', emoji: '🐶', nombre: 'Perro' },
  { id: 'gato', emoji: '🐱', nombre: 'Gato' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga' },
  { id: 'ninguno', emoji: '🚫', nombre: 'Ninguno' },
]

function Configuracion({ irADashboard, irATerminos, irAPrivacidad, irAAyuda, onCerrarSesion }) {
  const {
    tema, setTema,
    tamañoLetra, setTamañoLetra,
    tipoLetra, setTipoLetra,
    idioma, setIdioma,
    companero, setCompanero,
  } = useConfiguracion()

  const [userId, setUserId] = useState(null)
  const [notifViajes, setNotifViajes] = useState(true)
  const [notifDocumentos, setNotifDocumentos] = useState(true)
  const [notifOfertas, setNotifOfertas] = useState(false)
  const [permisoNotif, setPermisoNotif] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'denied')
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
    { id: 1, dispositivo: '📱 Este navegador', actual: true },
  ]

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setCorreoUsuario(user.email)
        setCorreoVerificado(!!user.email_confirmed_at)

        const { data } = await supabase.from('perfiles').select('notif_viajes, notif_documentos').eq('id', user.id).single()
        if (data) {
          setNotifViajes(data.notif_viajes !== false)
          setNotifDocumentos(data.notif_documentos !== false)
        }
      }
    }
    cargar()
  }, [])

  const pedirPermisoNotif = async () => {
    if (typeof Notification === 'undefined') {
      setAvisoPermiso('Tu navegador no soporta notificaciones.')
      return false
    }
    if (Notification.permission === 'granted') return true

    const resultado = await Notification.requestPermission()
    setPermisoNotif(resultado)

    if (resultado !== 'granted') {
      setAvisoPermiso('No diste permiso de notificaciones. Podés activarlo desde la configuración de tu navegador.')
      return false
    }
    setAvisoPermiso('')
    return true
  }

  const toggleNotifViajes = async () => {
    const nuevoValor = !notifViajes
    if (nuevoValor) {
      const permitido = await pedirPermisoNotif()
      if (!permitido) return
    }
    setNotifViajes(nuevoValor)
    if (userId) await supabase.from('perfiles').update({ notif_viajes: nuevoValor }).eq('id', userId)
  }

  const toggleNotifDocumentos = async () => {
    const nuevoValor = !notifDocumentos
    if (nuevoValor) {
      const permitido = await pedirPermisoNotif()
      if (!permitido) return
    }
    setNotifDocumentos(nuevoValor)
    if (userId) await supabase.from('perfiles').update({ notif_documentos: nuevoValor }).eq('id', userId)
  }

  const cambiarPassword = async () => {
    setErrorPass('')
    setExitoPass('')

    if (!passActual || !passNueva || !passConfirmar) {
      setErrorPass('Completá los tres campos.')
      return
    }
    if (passNueva !== passConfirmar) {
      setErrorPass('La nueva contraseña y la confirmación no coinciden.')
      return
    }
    if (passNueva.length < 6) {
      setErrorPass('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    setGuardandoPass(true)

    const { error: errorVerificar } = await supabase.auth.signInWithPassword({
      email: correoUsuario,
      password: passActual,
    })

    if (errorVerificar) {
      setGuardandoPass(false)
      setErrorPass('Tu contraseña actual no es correcta.')
      return
    }

    const { error: errorActualizar } = await supabase.auth.updateUser({ password: passNueva })

    setGuardandoPass(false)

    if (errorActualizar) {
      setErrorPass('Hubo un problema: ' + errorActualizar.message)
      return
    }

    setExitoPass('Tu contraseña se actualizó correctamente.')
    setPassActual('')
    setPassNueva('')
    setPassConfirmar('')
  }

  const enviarVerificacion = async () => {
    setEnviandoVerificacion(true)
    setMensajeVerificacion('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: correoUsuario })
    setEnviandoVerificacion(false)
    if (error) {
      setMensajeVerificacion('Hubo un problema: ' + error.message)
    } else {
      setMensajeVerificacion('Te enviamos un correo de verificación. Revisá tu bandeja de entrada.')
    }
  }

  const cerrarOtrasSesiones = async () => {
    setCerrandoOtras(true)
    setMensajeOtras('')
    const { error } = await supabase.auth.signOut({ scope: 'others' })
    setCerrandoOtras(false)
    setMensajeOtras(error ? 'Hubo un problema: ' + error.message : 'Se cerraron las demás sesiones correctamente.')
  }

  return (
    <div className="config">
      <div className="config-header">
        <button className="config-volver" onClick={irADashboard}>← Volver</button>
        <div className="config-logo">MOVIXA</div>
      </div>

      <h2 className="config-titulo">⚙️ Configuración</h2>

      <div className="config-seccion">
        <h3>Compañero de viaje</h3>
        <div className="config-companeros">
          {companeros.map((c) => (
            <button
              key={c.id}
              className={`config-companero ${companero === c.id ? 'config-companero-activo' : ''}`}
              onClick={() => setCompanero(c.id)}
            >
              <span className="config-companero-emoji">{c.emoji}</span>
              <span>{c.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="config-seccion">
        <h3>Tema</h3>
        <div className="config-companeros">
          {temas.map((t) => (
            <button
              key={t.id}
              className={`config-companero ${tema === t.id ? 'config-companero-activo' : ''}`}
              onClick={() => setTema(t.id)}
            >
              <span className="config-companero-emoji">{t.emoji}</span>
              <span>{t.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="config-seccion">
        <h3>Tamaño de letra</h3>
        <div className="config-toggle-grupo config-toggle-grupo-3">
          {tamaños.map((t) => (
            <button
              key={t.id}
              className={`config-toggle ${tamañoLetra === t.id ? 'config-toggle-activo' : ''}`}
              onClick={() => setTamañoLetra(t.id)}
            >
              {t.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="config-seccion">
        <h3>Tipo de letra</h3>
        <div className="config-toggle-grupo config-toggle-grupo-3">
          {tiposLetra.map((t) => (
            <button
              key={t.id}
              className={`config-toggle ${tipoLetra === t.id ? 'config-toggle-activo' : ''}`}
              onClick={() => setTipoLetra(t.id)}
            >
              {t.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="config-seccion">
        <h3>Idioma</h3>
        <div className="config-toggle-grupo">
          <button
            className={`config-toggle ${idioma === 'es' ? 'config-toggle-activo' : ''}`}
            onClick={() => setIdioma('es')}
          >
            Español
          </button>
          <button
            className={`config-toggle ${idioma === 'en' ? 'config-toggle-activo' : ''}`}
            onClick={() => setIdioma('en')}
          >
            English
          </button>
        </div>
      </div>

      <div className="config-seccion">
        <h3>Notificaciones</h3>
        <p className="config-nota-notif">
          Estas notificaciones aparecen mientras tenés MOVIXA abierto en el navegador. Todavía no funcionan con la app cerrada.
        </p>

        <div className="config-switch-fila">
          <span>Recordatorios de viaje (plan de hoy)</span>
          <div className={`config-switch ${notifViajes ? 'config-switch-on' : ''}`} onClick={toggleNotifViajes}>
            <div className="config-switch-bola"></div>
          </div>
        </div>

        <div className="config-switch-fila">
          <span>Alertas de cambios de requisitos</span>
          <div className={`config-switch ${notifDocumentos ? 'config-switch-on' : ''}`} onClick={toggleNotifDocumentos}>
            <div className="config-switch-bola"></div>
          </div>
        </div>

        <div className="config-switch-fila">
          <span>Ofertas y promociones</span>
          <div className={`config-switch ${notifOfertas ? 'config-switch-on' : ''}`} onClick={() => setNotifOfertas(!notifOfertas)}>
            <div className="config-switch-bola"></div>
          </div>
        </div>

        {avisoPermiso && <p className="config-mensaje-error">{avisoPermiso}</p>}
      </div>

      <div className="config-seccion">
        <h3>Seguridad</h3>

        <button className="config-fila-boton" onClick={() => setCambiandoPass(!cambiandoPass)}>
          <span>🔑 Cambiar contraseña</span>
          <span className="config-fila-flecha">{cambiandoPass ? '▲' : '›'}</span>
        </button>

        {cambiandoPass && (
          <div className="config-form-inline">
            <input
              type="password"
              placeholder="Contraseña actual"
              className="config-input"
              value={passActual}
              onChange={(e) => setPassActual(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="config-input"
              value={passNueva}
              onChange={(e) => setPassNueva(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="config-input"
              value={passConfirmar}
              onChange={(e) => setPassConfirmar(e.target.value)}
            />
            {errorPass && <p className="config-mensaje-error">{errorPass}</p>}
            {exitoPass && <p className="config-mensaje-exito">{exitoPass}</p>}
            <button className="config-boton-guardar" onClick={cambiarPassword} disabled={guardandoPass}>
              {guardandoPass ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </div>
        )}

        <div className="config-fila-boton config-fila-estatica">
          <span>✉️ Verificar correo electrónico</span>
          {correoVerificado ? (
            <span className="config-badge-verificado">Verificado ✓</span>
          ) : (
            <button className="config-boton-chico" onClick={enviarVerificacion} disabled={enviandoVerificacion}>
              {enviandoVerificacion ? 'Enviando...' : 'Enviar verificación'}
            </button>
          )}
        </div>
        {mensajeVerificacion && <p className="config-mensaje">{mensajeVerificacion}</p>}

        <div className="config-sesiones">
          <p className="config-sesiones-titulo">📟 Sesiones activas</p>
          {sesiones.map((s) => (
            <div key={s.id} className="config-sesion-item">
              <span>{s.dispositivo}</span>
              {s.actual && <span className="config-badge-actual">Este dispositivo</span>}
            </div>
          ))}
        </div>

        <button className="config-boton-peligro" onClick={cerrarOtrasSesiones} disabled={cerrandoOtras}>
          {cerrandoOtras ? 'Cerrando sesiones...' : 'Cerrar sesión en otros dispositivos'}
        </button>
        {mensajeOtras && <p className="config-mensaje">{mensajeOtras}</p>}
      </div>

      <div className="config-seccion">
        <h3>Acerca de MOVIXA</h3>
        <div className="config-fila">
          <span>Versión</span>
          <span className="config-valor-tenue">1.0.0 (MVP)</span>
        </div>
        <button className="config-fila-boton" onClick={irATerminos}>
          <span>📄 Términos y condiciones</span>
          <span className="config-fila-flecha">›</span>
        </button>
        <button className="config-fila-boton" onClick={irAPrivacidad}>
          <span>🔒 Política de privacidad</span>
          <span className="config-fila-flecha">›</span>
        </button>
        <button className="config-fila-boton" onClick={irAAyuda}>
          <span>💬 Ayuda y soporte</span>
          <span className="config-fila-flecha">›</span>
        </button>
      </div>

      <button className="config-cerrar-sesion" onClick={onCerrarSesion}>Cerrar sesión</button>
    </div>
  )
}

export default Configuracion