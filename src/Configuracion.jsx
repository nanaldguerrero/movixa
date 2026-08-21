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

function Configuracion({ irADashboard }) {
  const {
    tema, setTema,
    tamañoLetra, setTamañoLetra,
    tipoLetra, setTipoLetra,
    idioma, setIdioma,
    companero, setCompanero,
  } = useConfiguracion()

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

      <button className="config-cerrar-sesion">Cerrar sesión</button>
    </div>
  )
}

export default Configuracion