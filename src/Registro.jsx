import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Registro.css'

function Registro({ irALogin, irADashboard }) {
  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [año, setAño] = useState('')
  const [mes, setMes] = useState('')
  const [dia, setDia] = useState('')
  const [genero, setGenero] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const crearCuenta = async () => {
    setError('')

    if (!nombre || !usuario || !correo || !password) {
      setError('Completá al menos nombre, usuario, correo y contraseña.')
      return
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)

    const { data, error: errorRegistro } = await supabase.auth.signUp({
      email: correo,
      password: password,
    })

    if (errorRegistro) {
      setCargando(false)
      setError(errorRegistro.message)
      return
    }

    if (data.user) {
      const { error: errorPerfil } = await supabase.from('perfiles').insert({
        id: data.user.id,
        nombre_completo: nombre,
        nombre_usuario: usuario,
        correo: correo,
        fecha_nacimiento: año && mes && dia ? `${año}-${mes}-${dia}` : null,
        genero: genero,
      })

      if (errorPerfil) {
        setCargando(false)
        setError('Cuenta creada, pero hubo un problema guardando el perfil: ' + errorPerfil.message)
        return
      }
    }

    setCargando(false)
    irADashboard()
  }

  return (
    <div className="registro">
      <div className="registro-logo">MOVIXA</div>

      <div className="registro-card">
        <h2>Crear cuenta</h2>

        <div className="registro-ruta">
          <svg className="ruta-svg" viewBox="0 0 50 560" width="50" height="560" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M25,10 Q45,45 25,80 Q5,115 25,150 Q45,185 25,220 Q5,255 25,290 Q45,325 25,360 Q5,395 25,430 Q45,465 25,500 Q5,535 25,560"
              fill="none" stroke="#8a5cf0" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round"
            />
            <g transform="translate(25,10) rotate(35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,80) rotate(-35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,150) rotate(35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,220) rotate(-35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,290) rotate(35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,360) rotate(-35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
            <g transform="translate(25,430) rotate(35)"><path d="M0,-7 L6,5 L0,2 L-6,5 Z" fill="#4a2ba8" /></g>
          </svg>

          <div className="registro-campos">
            <label className="registro-label">Nombre completo</label>
            <input type="text" placeholder="Ej: Ariel Rodríguez Solís" className="registro-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />

            <label className="registro-label">Nombre de usuario</label>
            <input type="text" placeholder="Ej: arielRS" className="registro-input" value={usuario} onChange={(e) => setUsuario(e.target.value)} />

            <label className="registro-label">Correo electrónico</label>
            <input type="email" placeholder="Ej: ariel@correo.com" className="registro-input" value={correo} onChange={(e) => setCorreo(e.target.value)} />

            <label className="registro-label">Fecha de nacimiento</label>
            <div className="registro-fecha">
              <select className="registro-select" value={año} onChange={(e) => setAño(e.target.value)}>
                <option value="">Año</option>
                {Array.from({ length: 80 }, (_, i) => 2026 - i).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <select className="registro-select" value={mes} onChange={(e) => setMes(e.target.value)}>
                <option value="">Mes</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select className="registro-select" value={dia} onChange={(e) => setDia(e.target.value)}>
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <label className="registro-label">Género</label>
            <select className="registro-input" value={genero} onChange={(e) => setGenero(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="otro">Otro</option>
              <option value="prefiero-no-decir">Prefiero no decirlo</option>
            </select>

            <label className="registro-label">Contraseña</label>
            <input type="password" placeholder="Contraseña" className="registro-input" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label className="registro-label">Confirmar contraseña</label>
            <input type="password" placeholder="Confirmar contraseña" className="registro-input" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
          </div>
        </div>

        {error && <p className="registro-error">{error}</p>}

        <button className="registro-boton" onClick={crearCuenta} disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="registro-volver" onClick={irALogin}>
          ¿Ya tenés cuenta? Iniciar sesión
        </p>
      </div>
    </div>
  )
}

export default Registro