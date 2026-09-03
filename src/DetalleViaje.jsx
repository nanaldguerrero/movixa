import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde, requisitosCambiaron } from './nacionalidadUtils'
import './DetalleViaje.css'

function DetalleViaje({ irADashboard, viajeId }) {
  const [viaje, setViaje] = useState(null)
  const [requisito, setRequisito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)

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
        const nacionalidad = nacionalidadDesde(data.pasaporte, perfil?.nacionalidad)

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

  const actualizarNotaLocal = (id, texto) => {
    const nuevoChecklist = viaje.checklist.map((item) =>
      item.id === id ? { ...item, nota: texto } : item
    )
    setViaje({ ...viaje, checklist: nuevoChecklist })
  }

  const guardarNota = async () => {
    await supabase.from('viajes').update({ checklist: viaje.checklist }).eq('id', viajeId)
  }

  const actualizarSnapshot = async () => {
    setActualizando(true)
    await supabase.from('viajes').update({ requisitos_snapshot: requisito }).eq('id', viajeId)
    setViaje({ ...viaje, requisitos_snapshot: requisito })
    setActualizando(false)
  }
const compartirViaje = () => {
    const checklist = viaje.checklist || []
    const hechos = checklist.filter((i) => i.hecho).length

    let mensaje = `✈️ Mi viaje a ${viaje.destino}\n`
    mensaje += `Motivo: ${viaje.motivo}\n\n`

    if (requisito) {
      mensaje += requisito.requiere_visa
        ? `⚠️ Necesito visa (${requisito.nombre_permiso || 'trámite requerido'})\n`
        : `✅ No necesito visa\n`
      if (requisito.vacunas && requisito.vacunas.startsWith('OBLIGATORIA')) {
        mensaje += `💉 Vacuna obligatoria: ver detalles en MOVIXA\n`
      }
      mensaje += `\n`
    }

    mensaje += `📋 Checklist: ${hechos} de ${checklist.length} completado\n\n`

    const pendientes = checklist.filter((i) => !i.hecho)
    if (pendientes.length > 0) {
      mensaje += `Pendiente:\n`
      pendientes.forEach((item) => {
        mensaje += `• ${item.texto}\n`
      })
    }

    mensaje += `\nCreado con MOVIXA`

    if (navigator.share) {
      navigator.share({ title: `Mi viaje a ${viaje.destino}`, text: mensaje }).catch(() => {})
    } else {
      navigator.clipboard.writeText(mensaje)
      alert('El resumen del viaje se copió al portapapeles. Ya podés pegarlo donde quieras (WhatsApp, notas, etc.)')
    }
  }

  const eliminarViaje = async () => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este viaje? Esta acción no se puede deshacer.')
    if (!confirmar) return

    await supabase.from('viajes').delete().eq('id', viajeId)
    irADashboard()
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
  const vacunaObligatoria = requisito?.vacunas?.startsWith('OBLIGATORIA')
  const cambio = requisitosCambiaron(viaje.requisitos_snapshot, requisito)

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

      {cambio && (
        <div className="dv-alerta-cambio">
          <div className="dv-alerta-titulo">⚠️ Los requisitos de este viaje cambiaron</div>
          <p className="dv-alerta-texto">Desde que creaste este viaje, actualizamos la información de requisitos para este destino. Revisá los detalles abajo.</p>
          <button className="dv-alerta-boton" onClick={actualizarSnapshot} disabled={actualizando}>
            {actualizando ? 'Actualizando...' : 'Ya lo revisé, actualizar'}
          </button>
        </div>
      )}

      {requisito ? (
        <>
          <div className={`dv-visa-card ${requisito.requiere_visa ? 'dv-visa-si' : 'dv-visa-no'}`}>
            <div className="dv-visa-titulo">
              {requisito.requiere_visa ? '⚠️ Necesitás visa' : '✅ No necesitás visa'}
            </div>
            {requisito.nombre_permiso && <p className="dv-visa-detalle"><strong>{requisito.nombre_permiso}</strong></p>}
            <p className="dv-visa-detalle">Estadía máxima: {requisito.dias_permitidos} días</p>
            <p className="dv-visa-detalle">Pasaporte con al menos {requisito.vigencia_pasaporte_meses} meses de vigencia</p>
            {requisito.notas && <p className="dv-visa-notas">{requisito.notas}</p>}
          </div>

          {requisito.vacunas && (
            <div className={`dv-visa-card ${vacunaObligatoria ? 'dv-visa-si' : 'dv-visa-no'}`}>
              <div className="dv-visa-titulo">
                {vacunaObligatoria ? '💉 Vacuna obligatoria' : '💉 Vacunas'}
              </div>
              <p className="dv-visa-detalle">{requisito.vacunas}</p>
            </div>
          )}
        </>
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
                <div key={item.id} className="dv-item-bloque">
                  <div
                    className={`dv-item ${item.hecho ? 'dv-item-hecho' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className={`dv-checkbox ${item.hecho ? 'dv-checkbox-marcado' : ''}`}>
                      {item.hecho && '✓'}
                    </div>
                    <span>{item.texto}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Agregar detalles..."
                    className="dv-nota-input"
                    value={item.nota || ''}
                    onChange={(e) => actualizarNotaLocal(item.id, e.target.value)}
                    onBlur={guardarNota}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      <button className="dv-boton-compartir" onClick={compartirViaje}>📤 Compartir viaje</button>
      <button className="dv-boton-eliminar" onClick={eliminarViaje}>🗑️ Eliminar este viaje</button>
    </div>
  )
}

export default DetalleViaje