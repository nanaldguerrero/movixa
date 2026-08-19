import { useState } from 'react'
import './DetalleViaje.css'

const checklistInicial = [
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

function DetalleViaje({ irADashboard, destino = 'Japón', motivo = 'Turismo' }) {
  const [checklist, setChecklist] = useState(checklistInicial)

  const toggleItem = (id) => {
    setChecklist(checklist.map((item) =>
      item.id === id ? { ...item, hecho: !item.hecho } : item
    ))
  }

  const categorias = [...new Set(checklist.map((i) => i.categoria))]
  const hechos = checklist.filter((i) => i.hecho).length
  const porcentaje = Math.round((hechos / checklist.length) * 100)

  return (
    <div className="dv">
      <div className="dv-header">
        <button className="dv-volver" onClick={irADashboard}>← Volver</button>
        <div className="dv-logo">MOVIXA</div>
      </div>

      <div className="dv-portada">
        <div className="dv-destino">✈️ {destino}</div>
        <div className="dv-motivo">{motivo}</div>
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