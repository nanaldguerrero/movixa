import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './DetalleViaje.css'

function DetalleViaje({ irADashboard, viajeId }) {
  const [viaje, setViaje] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      if (!viajeId) {
        setCargando(false)
        return
      }
      const { data } = await supabase.from('viajes').select('*').eq('id', viajeId).single()
      setViaje(data)
      setCargando(false)
    }
    cargar()
  }, [viajeId])

  const toggleItem = async (id) => {
    const nuevoChecklist = viaje.checklist.map((item) =>
      item.id === id ? { ...item, hecho: !item.hecho } : item
    )
    setViaje({ ...viaje, checklist: nuevoChecklist })
    await supabase.from('viajes').update({ checklist: nuevoChecklist }).eq('id', viajeId)
  }

  if (cargando) {
    return <div className="dv"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando viaje...</p></div>
  }

  if (!viaje) {
    return (
      <div className="dv">
        <div className="dv-header">
          <button className="dv-volver" onClick={irADashboard}>← Volver</button>
          <div className="dv-logo">MOVIXA</div>
        </div>
        <p style={{ textAlign: 'center', paddingTop: '40px', color: '#888' }}>No se encontró este viaje.</p>
      </div>
    )
  }

  const checklist = viaje.checklist || []
  const categorias = [...new Set(checklist.map((i) => i.categoria))]
  const hechos = checklist.filter((i) => i.hecho).length
  const porcentaje = checklist.length > 0 ? Math.round((hechos / checklist.length) * 100) : 0

  return (
    <div className="dv">
      <div className="dv-header">
        <button className="dv-volver" onClick={irADashboard}>← Volver</button>
        <div className="dv-logo">MOVIXA</div>
      </div>

      <div className="dv-portada">
        <div className="dv-destino">✈️ {viaje.destino}</div>
        <div className="dv-motivo">{viaje.motivo}</div>
      </div>

      <div className="dv-progreso-card">
        <div className="dv-progreso-texto">
          <span>{hechos} de {checklist.length} listos</span>
          <span className="dv-progreso-porcentaje">{porcentaje}%</span>
        </div>
        <div className="dv-barra-fondo">
          <div className="dv-barra-relleno" style={{ width: `${porcentaje}%` }}></div>
        </div>
      </div>

      {categorias.map((categoria) => (
        <div key={categoria} className="dv-categoria">
          <h3 className="dv-categoria-titulo">{categoria}</h3>
          <div className="dv-lista">
            {checklist
              .filter((item) => item.categoria === categoria)
              .map((item) => (
                <div
                  key={item.id}
                  className={`dv-item ${item.hecho ? 'dv-item-hecho' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className={`dv-checkbox ${item.hecho ? 'dv-checkbox-marcado' : ''}`}>
                    {item.hecho && '✓'}
                  </div>
                  <span>{item.texto}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DetalleViaje