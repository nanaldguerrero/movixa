import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde } from './nacionalidadUtils'
import './Papeleo.css'

function Papeleo({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [requisito, setRequisito] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }

      const { data: perfil } = await supabase.from('perfiles').select('nacionalidad').eq('id', user.id).single()

      const { data: viajes } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .order('creado_en', { ascending: false })
        .limit(1)

      if (viajes && viajes.length > 0) {
        const viajeReciente = viajes[0]
        setViaje(viajeReciente)

        const nacionalidad = nacionalidadDesde(viajeReciente.pasaporte, perfil?.nacionalidad)
        const { data: req } = await supabase
          .from('requisitos_visa')
          .select('*')
          .eq('nacionalidad', nacionalidad)
          .ilike('destino', `%${viajeReciente.destino}%`)
          .maybeSingle()

        setRequisito(req)
      }

      setCargando(false)
    }
    cargar()
  }, [])

  const toggleItem = async (id) => {
    const nuevoChecklist = viaje.checklist.map((item) =>
      item.id === id ? { ...item, hecho: !item.hecho } : item
    )
    setViaje({ ...viaje, checklist: nuevoChecklist })
    await supabase.from('viajes').update({ checklist: nuevoChecklist }).eq('id', viaje.id)
  }

  if (cargando) {
    return <div className="papeleo"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando papeleo...</p></div>
  }

  if (!viaje) {
    return (
      <div className="papeleo">
        <div className="pap-header">
          <button className="pap-volver" onClick={irADashboard}>← Volver</button>
          <div className="pap-logo">MOVIXA</div>
        </div>
        <h2 className="pap-titulo">📋 Papeleo</h2>
        <p className="pap-sin-info">Todavía no tenés ningún viaje. Creá uno para ver acá tu papeleo específico.</p>
        <button className="pap-boton-crear" onClick={irACrearViaje}>+ Crear mi primer viaje</button>
      </div>
    )
  }

  const itemsPapeleo = (viaje.checklist || []).filter((i) => i.categoria === 'Papeleo')
  const completados = itemsPapeleo.filter((d) => d.hecho).length
  const vacunaObligatoria = requisito?.vacunas?.startsWith('OBLIGATORIA')

  return (
    <div className="papeleo">
      <div className="pap-header">
        <button className="pap-volver" onClick={irADashboard}>← Volver</button>
        <div className="pap-logo">MOVIXA</div>
      </div>

      <h2 className="pap-titulo">📋 Papeleo para {viaje.destino}</h2>
      <p className="pap-progreso">{completados} de {itemsPapeleo.length} completados</p>

      {requisito ? (
        <div className="pap-info-destino">
          <div className="pap-info-item">
            <span className="pap-info-icono">🌤️</span>
            <span>Clima: {requisito.clima_general}</span>
          </div>
          <div className="pap-info-item">
            <span className="pap-info-icono">💱</span>
            <span>Moneda: {requisito.moneda}</span>
          </div>
          <div className="pap-info-item">
            <span className="pap-info-icono">🗣️</span>
            <span>Idioma: {requisito.idioma_principal}</span>
          </div>
        </div>
      ) : (
        <p className="pap-sin-info">Todavía no tenemos información detallada de {viaje.destino}.</p>
      )}

      {requisito && (
        <>
          <div className={`pap-visa-card ${requisito.requiere_visa ? 'pap-visa-si' : 'pap-visa-no'}`}>
            <div className="pap-visa-titulo">
              {requisito.requiere_visa ? '⚠️ Necesitás visa' : '✅ No necesitás visa'}
            </div>
            {requisito.nombre_permiso && <p className="pap-visa-detalle"><strong>{requisito.nombre_permiso}</strong></p>}
            {requisito.notas && <p className="pap-visa-notas">{requisito.notas}</p>}
          </div>

          {requisito.vacunas && (
            <div className={`pap-visa-card ${vacunaObligatoria ? 'pap-visa-si' : 'pap-visa-no'}`}>
              <div className="pap-visa-titulo">
                {vacunaObligatoria ? '💉 Vacuna obligatoria' : '💉 Vacunas'}
              </div>
              <p className="pap-visa-detalle">{requisito.vacunas}</p>
            </div>
          )}
        </>
      )}

      <div className="pap-lista">
        {itemsPapeleo.map((doc) => (
          <div
            key={doc.id}
            className={`pap-item ${doc.hecho ? 'pap-item-hecho' : ''}`}
            onClick={() => toggleItem(doc.id)}
          >
            <div className={`pap-checkbox ${doc.hecho ? 'pap-checkbox-marcado' : ''}`}>
              {doc.hecho && '✓'}
            </div>
            <span>{doc.texto}</span>
          </div>
        ))}
      </div>

      <button className="pap-boton-ver-viaje" onClick={() => irADetalle(viaje.id)}>Ver viaje completo →</button>
    </div>
  )
}

export default Papeleo