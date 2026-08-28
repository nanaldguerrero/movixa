import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './MisViajes.css'

function MisViajes({ irADashboard, irACrearViaje, irADetalle }) {
  const [viajes, setViajes] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }
      const { data } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .order('creado_en', { ascending: false })
      setViajes(data || [])
      setCargando(false)
    }
    cargar()
  }, [])

  const calcularProgreso = (checklist) => {
    if (!checklist || checklist.length === 0) return 0
    const hechos = checklist.filter((i) => i.hecho).length
    return Math.round((hechos / checklist.length) * 100)
  }

  if (cargando) {
    return <div className="mv"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando tus viajes...</p></div>
  }

  return (
    <div className="mv">
      <div className="mv-header">
        <button className="mv-volver" onClick={irADashboard}>← Volver</button>
        <div className="mv-logo">MOVIXA</div>
      </div>

      <h2 className="mv-titulo">🧭 Mis viajes</h2>
      <p className="mv-subtitulo">{viajes.length} {viajes.length === 1 ? 'viaje planeado' : 'viajes planeados'}</p>

      <button className="mv-boton-nuevo" onClick={irACrearViaje}>+ Crear nuevo viaje</button>

      {viajes.length === 0 ? (
        <p className="mv-vacio">Todavía no tenés ningún viaje. ¡Creá el primero!</p>
      ) : (
        <div className="mv-lista">
          {viajes.map((v) => {
            const progreso = calcularProgreso(v.checklist)
            return (
              <div key={v.id} className="mv-tarjeta" onClick={() => irADetalle(v.id)}>
                <div className="mv-tarjeta-info">
                  <div className="mv-tarjeta-destino">✈️ {v.destino}</div>
                  <div className="mv-tarjeta-motivo">{v.motivo}</div>
                  {v.pasaporte && <div className="mv-tarjeta-pasaporte">{v.pasaporte}</div>}
                </div>
                <div className="mv-progreso-circulo" style={{ background: `conic-gradient(#6a3de8 ${progreso * 3.6}deg, #eee 0deg)` }}>
                  <span>{progreso}%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MisViajes