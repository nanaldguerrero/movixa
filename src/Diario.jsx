import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Diario.css'

function Diario({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [entradas, setEntradas] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')
  const [fotoArchivo, setFotoArchivo] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
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

  const elegirFoto = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setFotoArchivo(archivo)
    setFotoPreview(URL.createObjectURL(archivo))
  }

  const quitarFoto = () => {
    setFotoArchivo(null)
    setFotoPreview(null)
  }

  const agregarEntrada = async () => {
    if (titulo.trim() === '' || texto.trim() === '') return

    setSubiendo(true)
    let urlFoto = null

    if (fotoArchivo) {
      const { data: { user } } = await supabase.auth.getUser()
      const nombreArchivo = `${user.id}/${Date.now()}-${fotoArchivo.name}`
      const { error: errorSubida } = await supabase.storage.from('diario-fotos').upload(nombreArchivo, fotoArchivo)
      if (!errorSubida) {
        const { data: urlData } = supabase.storage.from('diario-fotos').getPublicUrl(nombreArchivo)
        urlFoto = urlData.publicUrl
      }
    }

    const hoy = new Date().toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })
    const nuevo = [{ id: Date.now(), titulo, fecha: hoy, texto, foto: urlFoto }, ...entradas]
    setEntradas(nuevo)
    guardar(nuevo)
    setTitulo('')
    setTexto('')
    setFotoArchivo(null)
    setFotoPreview(null)
    setSubiendo(false)
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

      <div className="dia-hero">
        <h2 className="dia-titulo">📔 Diario de {viaje.destino}</h2>
        <p className="dia-subtitulo">Tus recuerdos y experiencias de este viaje</p>
      </div>

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

          {fotoPreview ? (
            <div className="dia-foto-preview-wrapper">
              <img src={fotoPreview} alt="Vista previa" className="dia-foto-preview" />
              <button className="dia-foto-quitar" onClick={quitarFoto}>× Quitar foto</button>
            </div>
          ) : (
            <label className="dia-foto-boton">
              📷 Agregar una foto (opcional)
              <input type="file" accept="image/*" onChange={elegirFoto} style={{ display: 'none' }} />
            </label>
          )}

          <div className="dia-form-botones">
            <button className="dia-boton-cancelar" onClick={() => { setMostrarForm(false); quitarFoto() }}>Cancelar</button>
            <button className="dia-boton-guardar" onClick={agregarEntrada} disabled={subiendo}>
              {subiendo ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      )}

      {entradas.length === 0 && !mostrarForm && (
        <p className="dia-sin-info">Todavía no escribiste ninguna entrada de este viaje.</p>
      )}

      <div className="dia-lista">
        {entradas.map((entrada) => (
          <div key={entrada.id} className="dia-entrada">
            {entrada.foto && <img src={entrada.foto} alt={entrada.titulo} className="dia-entrada-foto" />}
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