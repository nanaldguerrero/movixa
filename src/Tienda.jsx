import './Tienda.css'

const categorias = [
  {
    nombre: 'Seguros de viaje',
    icono: '🛡️',
    desc: 'Cobertura médica y de equipaje para tu viaje',
  },
  {
    nombre: 'SIM / Datos móviles',
    icono: '📶',
    desc: 'Conectate apenas llegues a tu destino',
  },
  {
    nombre: 'Hoteles',
    icono: '🏨',
    desc: 'Reservas con descuento para usuarios MOVIXA',
  },
  {
    nombre: 'Vuelos',
    icono: '✈️',
    desc: 'Comparación de aerolíneas y precios',
  },
  {
    nombre: 'Tours y actividades',
    icono: '🗺️',
    desc: 'Experiencias guiadas en tu destino',
  },
  {
    nombre: 'Universidades',
    icono: '🎓',
    desc: 'Programas de intercambio y estudios',
  },
]

function Tienda({ irADashboard }) {
  return (
    <div className="tienda">
      <div className="tie-header">
        <button className="tie-volver" onClick={irADashboard}>← Volver</button>
        <div className="tie-logo">MOVIXA</div>
      </div>

      <h2 className="tie-titulo">🛍️ Tienda</h2>
      <p className="tie-subtitulo">Servicios recomendados para tu viaje</p>

      <div className="tie-grid">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="tie-tarjeta">
            <div className="tie-icono">{cat.icono}</div>
            <div className="tie-nombre">{cat.nombre}</div>
            <div className="tie-desc">{cat.desc}</div>
            <button className="tie-boton">Ver opciones</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tienda