import { useState } from 'react'
import { useConfiguracion } from './ConfiguracionContext'
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

function Configuracion({ irADashboard, irATerminos, irAPrivacidad, irAAyuda }) {
  const {
    tema, setTema,
    tamañoLetra, setTamañoLetra,
    tipoLetra, setTipoLetra,
    idioma, setIdioma,
    companero, setCompanero,
  } = useConfiguracion()

  const [notifViajes, setNotifViajes] = useState(true)
  const [notifDocumentos, setNotifDocumentos] = useState(true)
  const [notifOfertas, setNotifOfertas] = useState(false)

  const [cambiandoPass, setCambiandoPass] = useState(false)
  const [correoVerificado, setCorreoVerificado] = useState(false)

  const sesiones = [
    { id: 1, dispositivo: '📱 iPhone 14 — San José, CR', actual: true },
    { id: 2, dispositivo: '💻 Chrome en Windows — San José, CR', actual: false },
  ]

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

        <div className="config-switch-fila">
          <span>Recordatorios de viaje</span>
          <div className={`config-switch ${notifViajes ? 'config-switch-on' : ''}`} onClick={() => setNotifViajes(!notifViajes)}>
            <div className="config-switch-bola"></div>
          </div>
        </div>

        <div className="config-switch-fila">
          <span>Alertas de documentos</span>
          <div className={`config-switch ${notifDocumentos ? 'config-switch-on' : ''}`} onClick={() => setNotifDocumentos(!notifDocumentos)}>
            <div className="config-switch-bola"></div>
          </div>
        </div>

        <div className="config-switch-fila">
          <span>Ofertas y promociones</span>
          <div className={`config-switch ${notifOfertas ? 'config-switch-on' : ''}`} onClick={() => setNotifOfertas(!notifOfertas)}>
            <div className="config-switch-bola"></div>
          </div>
        </div>
      </div>

      <div className="config-seccion">
        <h3>Seguridad</h3>

        <button className="config-fila-boton" onClick={() => setCambiandoPass(!cambiandoPass)}>
          <span>🔑 Cambiar contraseña</span>
          <span className="config-fila-flecha">{cambiandoPass ? '▲' : '›'}</span>
        </button>

        {cambiandoPass && (
          <div className="config-form-inline">
            <input type="password" placeholder="Contraseña actual" className="config-input" />
            <input type="password" placeholder="Nueva contraseña" className="config-input" />
            <input type="password" placeholder="Confirmar nueva contraseña" className="config-input" />
            <button className="config-boton-guardar">Guardar nueva contraseña</button>
          </div>
        )}

        <div className="config-fila-boton config-fila-estatica">
          <span>✉️ Verificar correo electrónico</span>
          {correoVerificado ? (
            <span className="config-badge-verificado">Verificado ✓</span>
          ) : (
            <button className="config-boton-chico" onClick={() => setCorreoVerificado(true)}>Enviar verificación</button>
          )}
        </div>

        <div className="config-sesiones">
          <p className="config-sesiones-titulo">📟 Sesiones activas</p>
          {sesiones.map((s) => (
            <div key={s.id} className="config-sesion-item">
              <span>{s.dispositivo}</span>
              {s.actual && <span className="config-badge-actual">Este dispositivo</span>}
            </div>
          ))}
        </div>

        <button className="config-boton-peligro">Cerrar sesión en otros dispositivos</button>
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

      <button className="config-cerrar-sesion">Cerrar sesión</button>
    </div>
  )
}

export default Configuracion