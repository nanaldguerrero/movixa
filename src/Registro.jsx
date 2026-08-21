import './Registro.css'

function Registro({ irALogin, irADashboard }) {
  return (
    <div className="registro">
      <div className="registro-logo">MOVIXA</div>

      <div className="registro-card">
        <h2>Crear cuenta</h2>

        <div className="registro-ruta">
          <div className="registro-ruta-avion">✈️</div>

          <label className="registro-label">Nombre completo</label>
          <input type="text" placeholder="Ej: Ariel Rodríguez Solís" className="registro-input" />

          <label className="registro-label">Nombre de usuario</label>
          <input type="text" placeholder="Ej: arielRS" className="registro-input" />

          <label className="registro-label">Correo electrónico</label>
          <input type="email" placeholder="Ej: ariel@correo.com" className="registro-input" />

          <label className="registro-label">Fecha de nacimiento</label>
          <div className="registro-fecha">
            <select className="registro-select">
              <option value="">Año</option>
              {Array.from({ length: 80 }, (_, i) => 2026 - i).map((año) => (
                <option key={año} value={año}>{año}</option>
              ))}
            </select>
            <select className="registro-select">
              <option value="">Mes</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                <option key={mes} value={mes}>{mes}</option>
              ))}
            </select>
            <select className="registro-select">
              <option value="">Día</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>

          <label className="registro-label">Género</label>
          <select className="registro-input">
            <option value="">Seleccioná una opción</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="otro">Otro</option>
            <option value="prefiero-no-decir">Prefiero no decirlo</option>
          </select>

          <label className="registro-label">Contraseña</label>
          <input type="password" placeholder="Contraseña" className="registro-input" />

          <label className="registro-label">Confirmar contraseña</label>
          <input type="password" placeholder="Confirmar contraseña" className="registro-input" />

          <div className="registro-ruta-meta">🏁</div>
        </div>

        <button className="registro-boton" onClick={irADashboard}>Crear cuenta</button>

        <p className="registro-volver" onClick={irALogin}>
          ¿Ya tenés cuenta? Iniciar sesión
        </p>
      </div>
       </div>
  )
}

export default Registro
