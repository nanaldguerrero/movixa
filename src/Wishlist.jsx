import { useState } from 'react'
import './Wishlist.css'

const destinosIniciales = [
  { id: 1, pais: 'Japón', emoji: '🇯🇵', nota: 'Cerezos en flor, primavera' },
  { id: 2, pais: 'Italia', emoji: '🇮🇹', nota: 'Comida y arquitectura' },
  { id: 3, pais: 'Canadá', emoji: '🇨🇦', nota: 'Naturaleza y auroras' },
]

function Wishlist({ irADashboard }) {
  const [destinos, setDestinos] = useState(destinosIniciales)
  const [nuevoPais, setNuevoPais] = useState('')

  const agregarDestino = () => {
    if (nuevoPais.trim() === '') return
    setDestinos([
      ...destinos,
      { id: Date.now(), pais: nuevoPais, emoji: '🌍', nota: '' },
    ])
    setNuevoPais('')
  }

  const eliminarDestino = (id) => {
    setDestinos(destinos.filter((d) => d.id !== id))
  }

  return (
    <div className="wishlist">
      <div className="wl-header">
        <button className="wl-volver" onClick={irADashboard}>← Volver</button>
        <div className="wl-logo">MOVIXA</div>
      </div>

      <h2 className="wl-titulo">⭐ Wishlist</h2>
      <p className="wl-subtitulo">Los destinos que soñás visitar</p>

      <div className="wl-agregar">
        <input
          type="text"
          placeholder="Agregar un país..."
          className="wl-input"
          value={nuevoPais}
          onChange={(e) => setNuevoPais(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregarDestino()}
        />
        <button className="wl-boton-agregar" onClick={agregarDestino}>+</button>
      </div>

      <div className="wl-grid">
        {destinos.map((destino) => (
          <div key={destino.id} className="wl-tarjeta">
            <button className="wl-eliminar" onClick={() => eliminarDestino(destino.id)}>×</button>
            <div className="wl-emoji">{destino.emoji}</div>
            <div className="wl-pais">{destino.pais}</div>
            {destino.nota && <div className="wl-nota">{destino.nota}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist