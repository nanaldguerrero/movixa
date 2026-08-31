import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Diario.css'

function Diario({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [entradas, setEntradas] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
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
        setEntradas(viajes[0].diario || [])
      }

      setCargando(false)
    }
    cargar()
  }, [])

  const guardar = async (nuevasEntradas) => {
    if (!viaje) return
    await supabase.from('viajes').update({ diario: nuevasEntradas }).eq('id', viaje.id)
  }

  const agregarEntrada = () => {
    if (titulo.trim() === '' || texto.trim() === '') return
    const hoy = new Date().toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })
    const nuevo = [{ id: Date.now(), titulo, fecha: hoy, texto }, ...entradas]
    setEntradas(nuevo)
    guardar(nuevo)
    setTitulo('')
    setTexto('')
    setMostrarForm(false)
  }

  if (cargando) {
    return <div className="diario"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando diario...</p></div>
  }

  if (!viaje) {
    return (
      <div className="diario">
        <div className="dia-header">
          <button className="dia-volver" onClick={irADashboard}>← Volver</button>
          <div className="dia-logo">MOVIXA</div>
        </div>
        <h2 className="dia-titulo">📔 Diario de viajes</h2>
        <p className="dia-sin-info">Todavía no tenés ningún viaje. Creá uno para empezar tu diario acá.</p>
        <button className="dia-boton-crear" onClick={irACrearViaje}>+ Crear mi primer viaje</button>
      </div>
    )
  }

  return (
    <div className="diario">
      <div className="dia-header">
        <button className="dia-volver" onClick={irADashboard}>← Volver</button>
        <div className="dia-logo">MOVIXA</div>
      </div>

      <h2 className="dia-titulo">📔 Diario de {viaje.destino}</h2>
      <p className="dia-subtitulo">Tus recuerdos y experiencias de este viaje</p>

      {!mostrarForm ? (
        <button className="dia-boton-nueva" onClick={() => setMostrarForm(true)}>
          + Nueva entrada
        </button>
      ) : (
        <div className="dia-form">
          <input
            type="text"
            placeholder="Título de la entrada"
            className="dia-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="¿Qué pasó hoy?"
            className="dia-textarea"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <div className="dia-form-botones">
            <button className="dia-boton-cancelar" onClick={() => setMostrarForm(false)}>Cancelar</button>
            <button className="dia-boton-guardar" onClick={agregarEntrada}>Guardar</button>
          </div>
        </div>
      )}

      {entradas.length === 0 && !mostrarForm && (
        <p className="dia-sin-info">Todavía no escribiste ninguna entrada de este viaje.</p>
      )}

      <div className="dia-lista">
        {entradas.map((entrada) => (
          <div key={entrada.id} className="dia-entrada">
            <div className="dia-entrada-header">
              <h3>{entrada.titulo}</h3>
              <span className="dia-fecha">{entrada.fecha}</span>
            </div>
            <p>{entrada.texto}</p>
          </div>
        ))}
      </div>

      <button className="dia-boton-ver-viaje" onClick={() => irADetalle(viaje.id)}>Ver viaje completo →</button>
    </div>
  )
}

export default Diario