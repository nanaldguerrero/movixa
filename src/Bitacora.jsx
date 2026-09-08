import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Bitacora.css'

function Bitacora({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [planes, setPlanes] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [titulo, setTitulo] = useState('')
  const [nota, setNota] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }

      let { data: viajes } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .eq('activo', true)
        .limit(1)

      if (!viajes || viajes.length === 0) {
        const resultado = await supabase
          .from('viajes')
          .select('*')
          .eq('user_id', user.id)
          .order('creado_en', { ascending: false })
          .limit(1)
        viajes = resultado.data
      }

      if (viajes && viajes.length > 0) {
        setViaje(viajes[0])
        setPlanes(viajes[0].itinerario || [])
      }

      setCargando(false)
    }
    cargar()
  }, [])

  const guardar = async (nuevosPlanes) => {
    if (!viaje) return
    await supabase.from('viajes').update({ itinerario: nuevosPlanes }).eq('id', viaje.id)
  }

  const agregarPlan = () => {
    if (fecha === '' || titulo.trim() === '') return
    const nuevo = [...planes, { id: Date.now(), fecha, hora, titulo, nota, hecho: false }]
    setPlanes(nuevo)
    guardar(nuevo)
    setFecha('')
    setHora('')
    setTitulo('')
    setNota('')
    setMostrarForm(false)
  }

  const toggleLogrado = (id) => {
    const nuevo = planes.map((p) => (p.id === id ? { ...p, hecho: !p.hecho } : p))
    setPlanes(nuevo)
    guardar(nuevo)
  }

  const eliminarPlan = (id) => {
    const nuevo = planes.filter((p) => p.id !== id)
    setPlanes(nuevo)
    guardar(nuevo)
  }

  if (cargando) {
    return <div className="bit"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando bitácora...</p></div>
  }

  if (!viaje) {
    return (
      <div className="bit">
        <div className="bit-header">
          <button className="bit-volver" onClick={irADashboard}>← Volver</button>
          <div className="bit-logo">MOVIXA</div>
        </div>
        <h2 className="bit-titulo">🗓️ Bitácora de viaje</h2>
        <p className="bit-sin-info">Todavía no tenés ningún viaje. Creá uno para armar tu bitácora acá.</p>
        <button className="bit-boton-crear" onClick={irACrearViaje}>+ Crear mi primer viaje</button>
      </div>
    )
  }

  const planesOrdenados = [...planes].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
    return (a.hora || '').localeCompare(b.hora || '')
  })

  const fechasUnicas = [...new Set(planesOrdenados.map((p) => p.fecha))]
  const totalPlanes = planes.length
  const totalLogrados = planes.filter((p) => p.hecho).length

  const formatearFecha = (f) => {
    const [año, mes, dia] = f.split('-')
    const fechaObj = new Date(año, mes - 1, dia)
    return fechaObj.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div className="bit">
      <div className="bit-header">
        <button className="bit-volver" onClick={irADashboard}>← Volver</button>
        <div className="bit-logo">MOVIXA</div>
      </div>

      <div className="bit-hero">
        <h2 className="bit-titulo">🗓️ Bitácora de {viaje.destino}</h2>
        <p className="bit-subtitulo">Tus planes día por día, y cuáles ya lograste</p>
      </div>

      {totalPlanes > 0 && (
        <div className="bit-progreso-card">
          <div className="bit-progreso-texto">
            <span>{totalLogrados} de {totalPlanes} planes logrados</span>
            <span className="bit-progreso-porcentaje">{Math.round((totalLogrados / totalPlanes) * 100)}%</span>
          </div>
          <div className="bit-barra-fondo">
            <div className="bit-barra-relleno" style={{ width: `${(totalLogrados / totalPlanes) * 100}%` }}></div>
          </div>
        </div>
      )}

      {!mostrarForm ? (
        <button className="bit-boton-nueva" onClick={() => setMostrarForm(true)}>
          + Agregar un plan
        </button>
      ) : (
        <div className="bit-form">
          <label className="bit-form-label">Fecha</label>
          <input type="date" className="bit-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />

          <label className="bit-form-label">Hora (opcional)</label>
          <input type="time" className="bit-input" value={hora} onChange={(e) => setHora(e.target.value)} />

          <label className="bit-form-label">¿Qué querés hacer?</label>
          <input
            type="text"
            placeholder="Ej: Visitar el Museo Nacional"
            className="bit-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label className="bit-form-label">Detalles (opcional)</label>
          <textarea
            placeholder="Dirección, horario de apertura, con quién vas..."
            className="bit-textarea"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />

          <div className="bit-form-botones">
            <button className="bit-boton-cancelar" onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button className="bit-boton-guardar" onClick={agregarPlan}>Guardar plan</button>
          </div>
        </div>
      )}

      {planes.length === 0 && !mostrarForm && (
        <p className="bit-sin-info">Todavía no tenés planes agendados para este viaje.</p>
      )}

      {fechasUnicas.map((f) => (
        <div key={f} className="bit-dia">
          <h3 className="bit-dia-titulo">{formatearFecha(f)}</h3>
          <div className="bit-lista">
            {planesOrdenados
              .filter((p) => p.fecha === f)
              .map((plan) => (
                <div key={plan.id} className={`bit-item ${plan.hecho ? 'bit-item-hecho' : ''}`}>
                  <div className="bit-item-check" onClick={() => toggleLogrado(plan.id)}>
                    <div className={`bit-checkbox ${plan.hecho ? 'bit-checkbox-marcado' : ''}`}>
                      {plan.hecho && '✓'}
                    </div>
                    <div className="bit-item-info">
                      {plan.hora && <span className="bit-item-hora">{plan.hora}</span>}
                      <span className="bit-item-titulo">{plan.titulo}</span>
                      {plan.nota && <span className="bit-item-nota">{plan.nota}</span>}
                    </div>
                  </div>
                  <button className="bit-item-eliminar" onClick={() => eliminarPlan(plan.id)}>×</button>
                </div>
              ))}
          </div>
        </div>
      ))}

      <button className="bit-boton-ver-viaje" onClick={() => irADetalle(viaje.id)}>Ver viaje completo →</button>
    </div>
  )
}

export default Bitacora