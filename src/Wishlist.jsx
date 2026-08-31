import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Wishlist.css'

const destinosIniciales = [
  { id: 1, pais: 'Japón', emoji: '🇯🇵', nota: 'Cerezos en flor, primavera' },
  { id: 2, pais: 'Italia', emoji: '🇮🇹', nota: 'Comida y arquitectura' },
  { id: 3, pais: 'Canadá', emoji: '🇨🇦', nota: 'Naturaleza y auroras' },
]

function Wishlist({ irADashboard, irACrearViajeDesde }) {
  const [destinos, setDestinos] = useState(destinosIniciales)
  const [nuevoPais, setNuevoPais] = useState('')
  const [userId, setUserId] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }
      setUserId(user.id)

      const { data } = await supabase.from('perfiles').select('wishlist').eq('id', user.id).single()

      if (data && data.wishlist) {
        setDestinos(data.wishlist)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const guardar = async (nuevosDestinos) => {
    if (!userId) return
    await supabase.from('perfiles').upsert({ id: userId, wishlist: nuevosDestinos })
  }

  const agregarDestino = () => {
    if (nuevoPais.trim() === '') return
    const nuevo = [
      ...destinos,
      { id: Date.now(), pais: nuevoPais, emoji: '🌍', nota: '' },
    ]
    setDestinos(nuevo)
    guardar(nuevo)
    setNuevoPais('')
  }

  const eliminarDestino = (id) => {
    const nuevo = destinos.filter((d) => d.id !== id)
    setDestinos(nuevo)
    guardar(nuevo)
  }

  if (cargando) {
    return <div className="wishlist"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando wishlist...</p></div>
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
            <button className="wl-boton-viaje" onClick={() => irACrearViajeDesde(destino.pais)}>✈️ Crear viaje</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist