import { useState } from 'react'
import './Configuracion.css'

const companeros = [
  { id: 'perro', emoji: '🐶', nombre: 'Perro' },
  { id: 'gato', emoji: '🐱', nombre: 'Gato' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga' },
  { id: 'ninguno', emoji: '🚫', nombre: 'Ninguno' },
]

function Configuracion({ irADashboard }) {
  const [companero, setCompanero] = useState('perro')
  const [tema, setTema] = useState('claro')
  const [tamañoLetra, setTamañoLetra] = useState('normal')
  const [idioma, setIdioma] = useState('es')

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
        <h3>Apariencia</h3>
        <div className="config-fila">
          <span>Tema</span>
          <div className="config-toggle-grupo">
            <button
              className={`config-toggle ${tema === 'claro' ? 'config-toggle-activo' : ''}`}
              onClick={() => setTema('claro')}
            >
              ☀️ Claro
            </button>
            <button
              className={`config-toggle ${tema === 'oscuro' ? 'config-toggle-activo' : ''}`}
              onClick={() => setTema('oscuro')}
            >
              🌙 Oscuro
            </button>
          </div>
        </div>

        <div className="config-fila">
          <span>Tamaño de letra</span>
          <div className="config-toggle-grupo">
            <button
              className={`config-toggle ${tamañoLetra === 'normal' ? 'config-toggle-activo' : ''}`}
              onClick={() => setTamañoLetra('normal')}
            >
              Normal
            </button>
            <button
              className={`config-toggle ${tamañoLetra === 'grande' ? 'config-toggle-activo' : ''}`}
              onClick={() => setTamañoLetra('grande')}
            >
              Grande
            </button>
          </div>
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