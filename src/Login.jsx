import './Login.css'

function Login({ irARegistro }) {
  return (
    <div className="login">
      <div className="login-logo">MOVIXA</div>

      <div className="login-card">
        <h2>Iniciar sesión</h2>

        <input type="text" placeholder="Usuario o correo" className="login-input" />
        <input type="password" placeholder="Contraseña" className="login-input" />

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
