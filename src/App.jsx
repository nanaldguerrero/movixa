import { useState } from 'react'
import Login from './Login'
import Registro from './Registro'
import Dashboard from './Dashboard'
import CrearViaje from './CrearViaje'
import Papeleo from './Papeleo'
import Maleta from './Maleta'
import Wishlist from './Wishlist'
import Diario from './Diario'
import Tienda from './Tienda'
import Configuracion from './Configuracion'
import Perfil from './Perfil'
import DetalleViaje from './DetalleViaje'
import Onboarding from './Onboarding'
import { ConfiguracionProvider, useConfiguracion } from './ConfiguracionContext'
import './App.css'

function AppInterno() {
  const { tema, tamañoLetra, tipoLetra, idioma, setIdioma } = useConfiguracion()
  const [pantalla, setPantalla] = useState('splash')
  const [viajeActual, setViajeActual] = useState({ destino: 'Japón', motivo: 'Turismo' })

  const textos = {
    es: { tagline: 'TU MUNDO. TU CAMINO.', boton: 'Comenzar' },
    en: { tagline: 'YOUR WORLD. YOUR PATH.', boton: 'Get Started' },
  }
  const t = textos[idioma]

  let contenido

  if (pantalla === 'login') {
    contenido = <Login irARegistro={() => setPantalla('registro')} />
  } else if (pantalla === 'registro') {
    contenido = <Registro irALogin={() => setPantalla('login')} irADashboard={() => setPantalla('onboarding')} />
  } else if (pantalla === 'onboarding') {
    contenido = <Onboarding irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'dashboard') {
    contenido = (
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
  } else if (pantalla === 'crearviaje') {
    contenido = (
      <CrearViaje
        irADashboard={() => setPantalla('dashboard')}
        irADetalle={(destino, motivo) => {
          setViajeActual({ destino: destino || 'Mi viaje', motivo: motivo || 'Turismo' })
          setPantalla('detalleviaje')
        }}
      />
    )
  } else if (pantalla === 'detalleviaje') {
    contenido = (
      <DetalleViaje
        irADashboard={() => setPantalla('dashboard')}
        destino={viajeActual.destino}
        motivo={viajeActual.motivo}
      />
    )
  } else if (pantalla === 'papeleo') {
    contenido = <Papeleo irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'maleta') {
    contenido = <Maleta irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'wishlist') {
    contenido = <Wishlist irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'diario') {
    contenido = <Diario irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'tienda') {
    contenido = <Tienda irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'configuracion') {
    contenido = <Configuracion irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'perfil') {
    contenido = <Perfil irADashboard={() => setPantalla('dashboard')} irAConfiguracion={() => setPantalla('configuracion')} />
  } else {
    contenido = (
      <div className="splash">
      <svg className="ruta-avion" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,400 0,330 60,270 120,320 180,250 240,310 300,260 360,320 400,280 400,400" fill="white" fillOpacity="0.08" />
        <polygon points="0,400 0,360 50,310 100,350 160,290 220,340 280,300 340,350 400,310 400,400" fill="white" fillOpacity="0.15" />
        <path d="M10,280 Q120,220 200,260 T390,190" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />
        <text x="390" y="190" fontSize="28" textAnchor="middle" dominantBaseline="middle" transform="rotate(20 390 190)" opacity="0.8">✈️</text>
      </svg>
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

  const filtros = {
    claro: 'none',
    oscuro: 'invert(1) hue-rotate(180deg)',
  }

  const zooms = {
    pequena: 0.85,
    normal: 1,
    grande: 1.2,
  }

  const fuentes = {
    normal: "system-ui, sans-serif",
    cursiva: "'Segoe Script', 'Comic Sans MS', cursive",
    clasica: "Georgia, 'Times New Roman', serif",
  }

  return (
    <div
      style={{
        filter: filtros[tema],
        zoom: zooms[tamañoLetra],
        minHeight: '100vh',
        '--fuente-app': fuentes[tipoLetra],
      }}
    >
      {contenido}
    </div>
  )
}

function App() {
  return (
    <ConfiguracionProvider>
      <AppInterno />
    </ConfiguracionProvider>
  )
}

export default App