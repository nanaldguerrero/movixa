import './Dashboard.css'

function Dashboard({ irACrearViaje, irAPapeleo,  irAMaleta, irAWishlist,  irADiario, irATienda, irAConfiguracion, irAPerfil  }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-logo">MOVIXA</div>
        <div className="dashboard-avatar" onClick={irAPerfil} style={{ cursor: 'pointer' }}>👤</div>
      </div>

      <h2 className="dashboard-saludo">¡Hola, Adriana! 👋</h2>

      <div className="dashboard-principal">
<button className="tarjeta tarjeta-grande" onClick={irACrearViaje}>          <span className="tarjeta-icono">✈️</span>
          <span className="tarjeta-texto">Crear viaje</span>
        </button>
      </div>

      <div className="dashboard-grid">
        <button className="tarjeta" onClick={irAPapeleo}>
  <span className="tarjeta-icono">📋</span>
  <span className="tarjeta-texto">Papeleo</span>
</button>

        <button className="tarjeta" onClick={irAMaleta}>
  <span className="tarjeta-icono">🧳</span>
  <span className="tarjeta-texto">Maleta</span>
</button>

        <button className="tarjeta" onClick={irAWishlist}>
  <span className="tarjeta-icono">⭐</span>
  <span className="tarjeta-texto">Wishlist</span>
</button>

       <button className="tarjeta" onClick={irADiario}>
  <span className="tarjeta-icono">📔</span>
  <span className="tarjeta-texto">Diario de viajes</span>
</button>
      </div>

      <div className="dashboard-secundario">
<button className="tarjeta-chica" onClick={irATienda}>🛍️ Tienda</button>        <button className="tarjeta-chica" onClick={irAConfiguracion}>⚙️ Más opciones</button>
      </div>
    </div>
  )
}

export default Dashboard