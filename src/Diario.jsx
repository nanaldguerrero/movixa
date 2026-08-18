import { useState } from 'react'
import './Diario.css'

const entradasIniciales = [
  { id: 1, titulo: 'Llegada a Costa Rica', fecha: '10 de julio', texto: 'Primer día explorando San José, el clima estuvo perfecto.' },
]

function Diario({ irADashboard }) {
  const [entradas, setEntradas] = useState(entradasIniciales)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [texto, setTexto] = useState('')

  const agregarEntrada = () => {
    if (titulo.trim() === '' || texto.trim() === '') return
    const hoy = new Date().toLocaleDateString('es-CR', { day: 'numeric', month: 'long' })
    setEntradas([{ id: Date.now(), titulo, fecha: hoy, texto }, ...entradas])
    setTitulo('')
    setTexto('')
    setMostrarForm(false)
  }

  return (
    <div className="diario">
      <div className="dia-header">
        <button className="dia-volver" onClick={irADashboard}>← Volver</button>
        <div className="dia-logo">MOVIXA</div>
      </div>

      <h2 className="dia-titulo">📔 Diario de viajes</h2>
      <p className="dia-subtitulo">Tus recuerdos y experiencias</p>

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
    </div>
  )
}

export default Diario