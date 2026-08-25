import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './DetalleViaje.css'

function DetalleViaje({ irADashboard, viajeId }) {
  const [viaje, setViaje] = useState(null)
  const [requisito, setRequisito] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      if (!viajeId) {
        setCargando(false)
        return
      }
      const { data } = await supabase.from('viajes').select('*').eq('id', viajeId).single()
      setViaje(data)

      if (data) {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: perfil } = await supabase.from('perfiles').select('nacionalidad').eq('id', user.id).single()
        const nacionalidad = perfil?.nacionalidad || 'Costarricense'

        const { data: req } = await supabase
          .from('requisitos_visa')
          .select('*')
          .eq('nacionalidad', nacionalidad)
          .ilike('destino', `%${data.destino}%`)
          .maybeSingle()

        setRequisito(req)
      }

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

      {requisito ? (
        <div className={`dv-visa-card ${requisito.requiere_visa ? 'dv-visa-si' : 'dv-visa-no'}`}>
          <div className="dv-visa-titulo">
            {requisito.requiere_visa ? '⚠️ Necesitás visa' : '✅ No necesitás visa'}
          </div>
          {requisito.nombre_permiso && <p className="dv-visa-detalle"><strong>{requisito.nombre_permiso}</strong></p>}
          <p className="dv-visa-detalle">Estadía máxima: {requisito.dias_permitidos} días</p>
          <p className="dv-visa-detalle">Pasaporte con al menos {requisito.vigencia_pasaporte_meses} meses de vigencia</p>
          {requisito.notas && <p className="dv-visa-notas">{requisito.notas}</p>}
        </div>
      ) : (
        <div className="dv-visa-card dv-visa-desconocido">
          <p className="dv-visa-detalle">Todavía no tenemos información verificada de requisitos para este destino. Te recomendamos consultar directamente con la embajada correspondiente antes de viajar.</p>
        </div>
      )}

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