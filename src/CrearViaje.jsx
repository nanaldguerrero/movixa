import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './CrearViaje.css'

const checklistPorDefecto = [
  { id: 1, categoria: 'Papeleo', texto: 'Pasaporte vigente', hecho: false },
  { id: 2, categoria: 'Papeleo', texto: 'Visa (si aplica)', hecho: false },
  { id: 3, categoria: 'Papeleo', texto: 'Seguro de viaje', hecho: false },
  { id: 4, categoria: 'Papeleo', texto: 'Reserva de hotel', hecho: false },
  { id: 5, categoria: 'Maleta', texto: 'Ropa para el clima', hecho: false },
  { id: 6, categoria: 'Maleta', texto: 'Cargador y adaptador', hecho: false },
  { id: 7, categoria: 'Maleta', texto: 'Artículos de higiene', hecho: false },
  { id: 8, categoria: 'Antes de salir', texto: 'Avisar al banco del viaje', hecho: false },
  { id: 9, categoria: 'Antes de salir', texto: 'Confirmar transporte al aeropuerto', hecho: false },
]

function CrearViaje({ irADashboard, irADetalle }) {
  const [sabeDestino, setSabeDestino] = useState(null)
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [creando, setCreando] = useState(false)
  const [pasaportes, setPasaportes] = useState([])
  const [pasaporteSeleccionado, setPasaporteSeleccionado] = useState('')

  useEffect(() => {
    const cargarPasaportes = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('perfiles').select('pasaportes').eq('id', user.id).single()
      const lista = data?.pasaportes || []
      setPasaportes(lista)
      if (lista.length > 0) setPasaporteSeleccionado(lista[0])
    }
    cargarPasaportes()
  }, [])

  const crearViaje = async (destinoFinal, motivoFinal) => {
    setCreando(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setCreando(false)
      return
    }

    const { data, error } = await supabase
      .from('viajes')
      .insert({
        user_id: user.id,
        destino: destinoFinal || 'Mi viaje',
        motivo: motivoFinal || 'Turismo',
        pasaporte: pasaporteSeleccionado || null,
        checklist: checklistPorDefecto,
      })
      .select()
      .single()

    setCreando(false)

    if (error) {
      alert('Hubo un problema creando el viaje: ' + error.message)
      return
    }

    irADetalle(data.id)
  }

  return (
    <div className="crear-viaje">
      <div className="cv-header">
        <button className="cv-volver" onClick={irADashboard}>← Volver</button>
        <div className="cv-logo">MOVIXA</div>
      </div>

      <div className="cv-card">
        <h2>Crear viaje</h2>

        {sabeDestino === null && (
          <>
            <p className="cv-pregunta">¿Ya sabés a dónde querés viajar?</p>
            <button className="cv-opcion" onClick={() => setSabeDestino(true)}>
              Sí, ya sé mi destino
            </button>
            <button className="cv-opcion cv-opcion-secundaria" onClick={() => setSabeDestino(false)}>
              No, ayudame a elegir
            </button>
          </>
        )}

        {sabeDestino === true && (
          <>
            {pasaportes.length > 1 && (
              <>
                <label className="cv-label">¿Con qué pasaporte vas a viajar?</label>
                <select className="cv-input" value={pasaporteSeleccionado} onChange={(e) => setPasaporteSeleccionado(e.target.value)}>
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}

            <label className="cv-label">¿A dónde querés ir?</label>
            <input
              type="text"
              placeholder="Ej: Japón, España, Canadá..."
              className="cv-input"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />

            <label className="cv-label">Motivo del viaje</label>
            <select className="cv-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              <option value="turismo">Turismo</option>
              <option value="educacion">Educación</option>
              <option value="negocios">Negocios</option>
              <option value="reubicacion">Reubicación</option>
              <option value="otro">Otro</option>
            </select>

            <button className="cv-boton" onClick={() => crearViaje(destino, motivo)} disabled={creando}>
              {creando ? 'Creando...' : 'Continuar'}
            </button>
            <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
          </>
        )}

        {sabeDestino === false && (
          <>
            {pasaportes.length > 1 && (
              <>
                <label className="cv-label">¿Con qué pasaporte vas a viajar?</label>
                <select className="cv-input" value={pasaporteSeleccionado} onChange={(e) => setPasaporteSeleccionado(e.target.value)}>
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}

            <p className="cv-pregunta">Contame qué te gusta y te voy a recomendar 5 destinos</p>
            <label className="cv-label">¿Qué buscás en este viaje?</label>
            <select className="cv-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              <option value="playa">Playa</option>
              <option value="montaña">Montaña</option>
              <option value="ciudad">Ciudad / cultura</option>
              <option value="aventura">Aventura</option>
              <option value="relax">Relax</option>
            </select>

            <button className="cv-boton" onClick={() => crearViaje('Destino recomendado', motivo)} disabled={creando}>
              {creando ? 'Creando...' : 'Ver recomendaciones'}
            </button>
            <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
          </>
        )}
      </div>
    </div>
  )
}

export default CrearViaje