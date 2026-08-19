import { useState } from 'react'
import './CrearViaje.css'

function CrearViaje({ irADashboard, irADetalle  }) {
  const [sabeDestino, setSabeDestino] = useState(null)
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')

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

            <button className="cv-boton" onClick={() => irADetalle(destino, motivo)}>Continuar</button>
            <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
          </>
        )}

        {sabeDestino === false && (
          <>
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

<button className="cv-boton" onClick={() => irADetalle('Destino recomendado', motivo)}>Ver recomendaciones</button>            <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
          </>
        )}
      </div>
    </div>
  )
}

export default CrearViaje