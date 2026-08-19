import { useState } from 'react'
import Login from './Login'
import Registro from './Registro'
import Dashboard from './Dashboard'
import CrearViaje from './CrearViaje'
import DetalleViaje from './DetalleViaje'
import Papeleo from './Papeleo'
import Maleta from './Maleta'
import Wishlist from './Wishlist'
import Diario from './Diario'
import Tienda from './Tienda'
import Configuracion from './Configuracion'
import Perfil from './Perfil'
import './App.css'

const textos = {
  es: { tagline: 'TU MUNDO. TU CAMINO.', boton: 'Comenzar' },
  en: { tagline: 'YOUR WORLD. YOUR PATH.', boton: 'Get Started' },
}

function App() {
  const [idioma, setIdioma] = useState('es')
  const [pantalla, setPantalla] = useState('splash')
  const [viajeActual, setViajeActual] = useState({ destino: 'Japón', motivo: 'Turismo' })
  const t = textos[idioma]

  if (pantalla === 'login') {
    return <Login irARegistro={() => setPantalla('registro')} />
  }

  if (pantalla === 'registro') {
    return <Registro irALogin={() => setPantalla('login')} irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'dashboard') {
    return (
      <Dashboard
        irACrearViaje={() => setPantalla('crearviaje')}
        irAPapeleo={() => setPantalla('papeleo')}
        irAMaleta={() => setPantalla('maleta')}
        irAWishlist={() => setPantalla('wishlist')}
        irADiario={() => setPantalla('diario')}
        irATienda={() => setPantalla('tienda')}
        irAConfiguracion={() => setPantalla('configuracion')}
        irAPerfil={() => setPantalla('perfil')}
      />
    )
  }

  if (pantalla === 'crearviaje') {
    return (
      <CrearViaje
        irADashboard={() => setPantalla('dashboard')}
        irADetalle={(destino, motivo) => {
          setViajeActual({ destino: destino || 'Mi viaje', motivo: motivo || 'Turismo' })
          setPantalla('detalleviaje')
        }}
      />
    )
  }
    if (pantalla === 'detalleviaje') {
    return (
      <DetalleViaje
        irADashboard={() => setPantalla('dashboard')}
        destino={viajeActual.destino}
        motivo={viajeActual.motivo}
      />
    )
  }

  if (pantalla === 'papeleo') {
    return <Papeleo irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'maleta') {
    return <Maleta irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'wishlist') {
    return <Wishlist irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'diario') {
    return <Diario irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'tienda') {
    return <Tienda irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'configuracion') {
    return <Configuracion irADashboard={() => setPantalla('dashboard')} />
  }

  if (pantalla === 'perfil') {
    return <Perfil irADashboard={() => setPantalla('dashboard')} irAConfiguracion={() => setPantalla('configuracion')} />
  }

  return (
    <div className="splash">
      <div className="selector-idioma">
        <button className={idioma === 'es' ? 'activo' : ''} onClick={() => setIdioma('es')}>Español</button>
        <button className={idioma === 'en' ? 'activo' : ''} onClick={() => setIdioma('en')}>English</button>
      </div>
      <div className="logo">MOVIXA</div>
      <p className="tagline">{t.tagline}</p>
      <button className="boton-comenzar" onClick={() => setPantalla('login')}>{t.boton}</button>
    </div>
  )
}

export default App