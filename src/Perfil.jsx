import './Perfil.css'

function Perfil({ irADashboard, irAConfiguracion }) {
  return (
    <div className="perfil">
      <div className="perfil-header">
        <button className="perfil-volver" onClick={irADashboard}>← Volver</button>
        <div className="perfil-logo">MOVIXA</div>
      </div>

      <div className="perfil-portada">
        <div className="perfil-avatar">🐶</div>
        <h2 className="perfil-nombre">Adriana Guerrero Ortiz</h2>
        <p className="perfil-usuario">@nanaLD</p>
      </div>

      <div className="perfil-stats">
        <div className="perfil-stat">
          <div className="perfil-stat-num">3</div>
          <div className="perfil-stat-label">Viajes</div>
        </div>
        <div className="perfil-stat">
          <div className="perfil-stat-num">2</div>
          <div className="perfil-stat-label">Pasaportes</div>
        </div>
        <div className="perfil-stat">
          <div className="perfil-stat-num">3</div>
          <div className="perfil-stat-label">Idiomas</div>
        </div>
      </div>

      <div className="perfil-seccion">
        <h3>Información personal</h3>
        <div className="perfil-dato">
          <span className="perfil-dato-label">Nombre completo</span>
          <span className="perfil-dato-valor">Adriana Guerrero Ortiz</span>
        </div>
        <div className="perfil-dato">
          <span className="perfil-dato-label">Fecha de nacimiento</span>
          <span className="perfil-dato-valor">01/01/2000</span>
        </div>
        <div className="perfil-dato">
          <span className="perfil-dato-label">Correo</span>
          <span className="perfil-dato-valor">adriana@ejemplo.com</span>
        </div>
      </div>

      <div className="perfil-seccion">
        <h3>Pasaportes</h3>
        <div className="perfil-chip-lista">
          <span className="perfil-chip">🇨🇷 Costa Rica</span>
          <span className="perfil-chip">🇨🇦 Canadá</span>
        </div>
      </div>

            <div className="perfil-seccion">
        <h3>Idiomas que hablo</h3>
        <div className="perfil-chip-lista">
          <span className="perfil-chip">Español</span>
          <span className="perfil-chip">Inglés</span>
          <span className="perfil-chip">Francés</span>
        </div>
      </div>

      <div className="perfil-seccion">
        <h3>Mis gustos</h3>
        <div className="perfil-dato">
          <span className="perfil-dato-label">Clima favorito</span>
          <span className="perfil-dato-valor">☀️ Cálido</span>
        </div>
        <div className="perfil-dato">
          <span className="perfil-dato-label">Tipo de viaje</span>
          <span className="perfil-dato-valor">🏖️ Playa y relax</span>
        </div>
        <div className="perfil-chip-lista" style={{ marginTop: '12px' }}>
          <span className="perfil-chip">🥾 Naturaleza</span>
          <span className="perfil-chip">📸 Fotografía</span>
          <span className="perfil-chip">🍽️ Gastronomía</span>
          <span className="perfil-chip">🏛️ Cultura</span>
        </div>
      </div>

      <button className="perfil-boton-config" onClick={irAConfiguracion}>
        ⚙️ Ir a Configuración
      </button>
    </div>
  )
}

export default Perfil