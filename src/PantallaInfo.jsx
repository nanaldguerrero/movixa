import './PantallaInfo.css'

function PantallaInfo({ irAConfiguracion, titulo, parrafos }) {
  return (
    <div className="info-pantalla">
      <div className="info-header">
        <button className="info-volver" onClick={irAConfiguracion}>← Volver</button>
        <div className="info-logo">MOVIXA</div>
      </div>

      <h2 className="info-titulo">{titulo}</h2>

      <div className="info-contenido">
        {parrafos.map((parrafo, i) => (
          <p key={i}>{parrafo}</p>
        ))}
      </div>
    </div>
  )
}

export default PantallaInfo