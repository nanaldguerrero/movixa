import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Onboarding.css'

const climas = [
  { id: 'calido', emoji: '☀️', nombre: 'Cálido' },
  { id: 'frio', emoji: '🥶', nombre: 'Frío' },
  { id: 'templado', emoji: '🌤️', nombre: 'Templado' },
  { id: 'nevado', emoji: '❄️', nombre: 'Nevado' },
  { id: 'verano', emoji: '🌻', nombre: 'Verano' },
  { id: 'otoño', emoji: '🍂', nombre: 'Otoño' },
  { id: 'invierno', emoji: '⛄', nombre: 'Invierno' },
  { id: 'primavera', emoji: '🌸', nombre: 'Primavera' },
  { id: 'cualquiera', emoji: '🌍', nombre: 'Cualquiera' },
]

const tiposDestino = [
  { id: 'playa', emoji: '🏖️', nombre: 'Playa' },
  { id: 'ciudad', emoji: '🏙️', nombre: 'Ciudad' },
  { id: 'naturaleza', emoji: '🌲', nombre: 'Naturaleza' },
  { id: 'montaña', emoji: '⛰️', nombre: 'Montaña' },
  { id: 'campo', emoji: '🌾', nombre: 'Campo' },
  { id: 'desierto', emoji: '🏜️', nombre: 'Desierto' },
  { id: 'isla', emoji: '🏝️', nombre: 'Isla' },
  { id: 'lago', emoji: '🏞️', nombre: 'Lago / Río' },
]

const ritmos = [
  { id: 'relax', emoji: '🧘', nombre: 'Relax' },
  { id: 'aventura', emoji: '🧗', nombre: 'Aventura' },
  { id: 'equilibrado', emoji: '⚖️', nombre: 'Un poco de todo' },
]

const interesesDisponibles = [
  { id: 'gastronomia', emoji: '🍽️', nombre: 'Gastronomía' },
  { id: 'fotografia', emoji: '📸', nombre: 'Fotografía' },
  { id: 'historia', emoji: '🏛️', nombre: 'Historia' },
  { id: 'deportes', emoji: '⚽', nombre: 'Deportes' },
  { id: 'compras', emoji: '🛍️', nombre: 'Compras' },
  { id: 'vidaNocturna', emoji: '🌃', nombre: 'Vida nocturna' },
  { id: 'musica', emoji: '🎵', nombre: 'Música' },
  { id: 'arte', emoji: '🎨', nombre: 'Arte' },
  { id: 'animales', emoji: '🐾', nombre: 'Animales' },
  { id: 'wellness', emoji: '💆', nombre: 'Bienestar' },
  { id: 'senderismo', emoji: '🥾', nombre: 'Senderismo' },
  { id: 'buceo', emoji: '🤿', nombre: 'Buceo / Snorkel' },
  { id: 'cine', emoji: '🎬', nombre: 'Cine y series' },
  { id: 'arquitectura', emoji: '🏰', nombre: 'Arquitectura' },
  { id: 'religion', emoji: '🛕', nombre: 'Sitios religiosos' },
  { id: 'festivales', emoji: '🎉', nombre: 'Festivales' },
]

function Onboarding({ irADashboard }) {
  const [paso, setPaso] = useState(1)
  const [clima, setClima] = useState([])
  const [tipoDestino, setTipoDestino] = useState([])
  const [ritmo, setRitmo] = useState(null)
  const [intereses, setIntereses] = useState([])
  const [guardando, setGuardando] = useState(false)

  const toggleClima = (id) => {
    setClima(clima.includes(id) ? clima.filter((c) => c !== id) : [...clima, id])
  }

  const toggleTipoDestino = (id) => {
    if (tipoDestino.includes(id)) {
      setTipoDestino(tipoDestino.filter((t) => t !== id))
    } else if (tipoDestino.length < 3) {
      setTipoDestino([...tipoDestino, id])
    }
  }

  const toggleInteres = (id) => {
    setIntereses(intereses.includes(id) ? intereses.filter((i) => i !== id) : [...intereses, id])
  }

  const siguiente = () => setPaso(paso + 1)
  const atras = () => setPaso(paso - 1)

  const nombreDe = (lista, catalogo) =>
    lista.map((id) => catalogo.find((c) => c.id === id)?.nombre || id)

  const finalizar = async () => {
    setGuardando(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('perfiles').upsert({
        id: user.id,
        climas: nombreDe(clima, climas),
        tipos_destino: nombreDe(tipoDestino, tiposDestino),
        intereses: nombreDe(intereses, interesesDisponibles),
        ritmo: ritmos.find((r) => r.id === ritmo)?.nombre || null,
      })
    }

    setGuardando(false)
    irADashboard()
  }

  return (
    <div className="onb">
      <svg className="onb-fondo" viewBox="0 0 400 150" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="30" r="3" fill="white" />
        <circle cx="200" cy="15" r="3" fill="white" />
        <circle cx="340" cy="50" r="3" fill="white" />
        <circle cx="100" cy="80" r="3" fill="white" />
        <circle cx="300" cy="100" r="3" fill="white" />
        <path d="M40,30 Q120,-10 200,15 Q280,40 340,50 Q380,60 300,100 Q220,130 100,80 Q60,65 40,30"
          fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 7" opacity="0.7" />
        <g transform="translate(200,15) rotate(50)"><path d="M0,-7 L6,5 L0,1.5 L-6,5 Z" fill="white" /></g>
      </svg>

      <div className="onb-header">
        <div className="onb-logo">MOVIXA</div>
        <div className="onb-pasos">Paso {paso} de 4</div>
      </div>

      <div className="onb-barra-fondo">
        <div className="onb-barra-relleno" style={{ width: `${(paso / 4) * 100}%` }}></div>
      </div>

      {paso === 1 && (
        <div className="onb-card">
          <h2>¿Qué clima preferís?</h2>
          <p className="onb-sub">Podés elegir varias opciones</p>
          <div className="onb-grid">
            {climas.map((c) => (
              <button
                key={c.id}
                className={`onb-opcion ${clima.includes(c.id) ? 'onb-opcion-activa' : ''}`}
                onClick={() => toggleClima(c.id)}
              >
                <span className="onb-emoji">{c.emoji}</span>
                <span>{c.nombre}</span>
              </button>
            ))}
          </div>
          <button className="onb-boton" disabled={clima.length === 0} onClick={siguiente}>
            Continuar
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="onb-card">
          <h2>¿Qué tipo de destino te gusta?</h2>
          <p className="onb-sub">Elegí entre 1 y 3 opciones</p>
          <div className="onb-grid">
            {tiposDestino.map((t) => (
              <button
                key={t.id}
                className={`onb-opcion ${tipoDestino.includes(t.id) ? 'onb-opcion-activa' : ''}`}
                onClick={() => toggleTipoDestino(t.id)}
              >
                <span className="onb-emoji">{t.emoji}</span>
                <span>{t.nombre}</span>
              </button>
            ))}
          </div>
          <div className="onb-botones-fila">
            <button className="onb-boton-atras" onClick={atras}>← Atrás</button>
            <button className="onb-boton" disabled={tipoDestino.length === 0} onClick={siguiente}>
              Continuar
            </button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="onb-card">
          <h2>¿Cómo te gusta viajar?</h2>
          <p className="onb-sub">El ritmo que buscás en tus viajes</p>
          <div className="onb-grid">
            {ritmos.map((r) => (
              <button
                key={r.id}
                className={`onb-opcion ${ritmo === r.id ? 'onb-opcion-activa' : ''}`}
                onClick={() => setRitmo(r.id)}
              >
                <span className="onb-emoji">{r.emoji}</span>
                <span>{r.nombre}</span>
              </button>
            ))}
          </div>
          <div className="onb-botones-fila">
            <button className="onb-boton-atras" onClick={atras}>← Atrás</button>
            <button className="onb-boton" disabled={!ritmo} onClick={siguiente}>
              Continuar
            </button>
          </div>
        </div>
      )}

      {paso === 4 && (
        <div className="onb-card">
          <h2>¿Qué te interesa?</h2>
          <p className="onb-sub">Podés elegir varias opciones</p>
          <div className="onb-chips">
            {interesesDisponibles.map((i) => (
              <button
                key={i.id}
                className={`onb-chip ${intereses.includes(i.id) ? 'onb-chip-activo' : ''}`}
                onClick={() => toggleInteres(i.id)}
              >
                {i.emoji} {i.nombre}
              </button>
            ))}
          </div>
          <div className="onb-botones-fila">
            <button className="onb-boton-atras" onClick={atras}>← Atrás</button>
            <button className="onb-boton" disabled={intereses.length === 0 || guardando} onClick={finalizar}>
              {guardando ? 'Guardando...' : 'Empezar a usar MOVIXA'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Onboarding