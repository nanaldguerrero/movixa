import './Login.css'

function Login({ irARegistro }) {
  return (
    <div className="login">
      <svg className="ruta-avion" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,400 0,330 60,270 120,320 180,250 240,310 300,260 360,320 400,280 400,400" fill="white" fillOpacity="0.07" />
        <polygon points="0,400 0,360 50,310 100,350 160,290 220,340 280,300 340,350 400,310 400,400" fill="white" fillOpacity="0.12" />
        <path d="M10,290 Q120,230 200,270 T380,200" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 8" />
        <text x="380" y="200" fontSize="26" textAnchor="middle" dominantBaseline="middle" transform="rotate(20 380 200)" opacity="0.7">✈️</text>
      </svg>
      <div className="login-logo">MOVIXA</div>

      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <div className="login-input-wrapper">
          <span className="login-input-icono">👤</span>
          <input type="text" placeholder="Usuario o correo" className="login-input" />
        </div>
        <div className="login-input-wrapper">
          <span className="login-input-icono">🔒</span>
          <input type="password" placeholder="Contraseña" className="login-input" />
        </div>

        <button className="login-boton">Iniciar sesión</button>

        <p className="login-olvide">¿Olvidaste tu contraseña?</p>

        <div className="login-separador">o</div>

        <button className="login-crear-cuenta" onClick={irARegistro}>
          Crear cuenta
        </button>
      </div>
    </div>
  )
}

export default Login
