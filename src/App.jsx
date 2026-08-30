import { useState, useEffect } from 'react'
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
import PantallaInfo from './PantallaInfo'
import MisViajes from './MisViajes'
import { ConfiguracionProvider, useConfiguracion } from './ConfiguracionContext'
import { supabase } from './supabaseClient'
import { nacionalidadDesde, requisitosCambiaron } from './nacionalidadUtils'
import './App.css'

function AppInterno() {
  const { tema, tamañoLetra, tipoLetra, idioma, setIdioma } = useConfiguracion()
  const [pantalla, setPantalla] = useState('splash')
  const [viajeIdActual, setViajeIdActual] = useState(null)
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [viajeActivo, setViajeActivo] = useState(null)
const [alertaViajeActivo, setAlertaViajeActivo] = useState(false)

  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
    setPerfilUsuario(data)

    const { data: viajes } = await supabase
      .from('viajes')
      .select('*')
      .eq('user_id', user.id)
      .order('creado_en', { ascending: false })
      .limit(1)

    const viajeMasReciente = viajes && viajes.length > 0 ? viajes[0] : null
    setViajeActivo(viajeMasReciente)

    if (viajeMasReciente) {
      const nacionalidad = nacionalidadDesde(viajeMasReciente.pasaporte, data?.nacionalidad)
      const { data: requisitoActual } = await supabase
        .from('requisitos_visa')
        .select('*')
        .eq('nacionalidad', nacionalidad)
        .ilike('destino', `%${viajeMasReciente.destino}%`)
        .maybeSingle()

      setAlertaViajeActivo(requisitosCambiaron(viajeMasReciente.requisitos_snapshot, requisitoActual))
    } else {
      setAlertaViajeActivo(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await cargarPerfil()
        setPantalla('dashboard')
      }
    })
  }, [])

  const textos = {
    es: { tagline: 'TU MUNDO. TU CAMINO.', boton: 'Comenzar' },
    en: { tagline: 'YOUR WORLD. YOUR PATH.', boton: 'Get Started' },
  }
  const t = textos[idioma]

  let contenido

  if (pantalla === 'login') {
    contenido = (
      <Login
        irARegistro={() => setPantalla('registro')}
        irADashboard={async () => {
          await cargarPerfil()
          setPantalla('dashboard')
        }}
      />
    )
  } else if (pantalla === 'registro') {
    contenido = (
      <Registro
        irALogin={() => setPantalla('login')}
        irADashboard={async () => {
          await cargarPerfil()
          setPantalla('onboarding')
        }}
      />
    )
  } else if (pantalla === 'onboarding') {
    contenido = <Onboarding irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'dashboard') {
    contenido = (
      <Dashboard
        perfil={perfilUsuario}
        viajeActivo={viajeActivo}
        alertaViajeActivo={alertaViajeActivo}
        irACrearViaje={() => setPantalla('crearviaje')}
        irAPapeleo={() => setPantalla('papeleo')}
        irAMaleta={() => setPantalla('maleta')}
        irAWishlist={() => setPantalla('wishlist')}
        irADiario={() => setPantalla('diario')}
        irATienda={() => setPantalla('tienda')}
        irAConfiguracion={() => setPantalla('configuracion')}
        irAPerfil={() => setPantalla('perfil')}
        irADetalle={(id) => {
          setViajeIdActual(id)
          setPantalla('detalleviaje')
        }}
        irAMisViajes={() => setPantalla('misviajes')}
      />
    )
  } else if (pantalla === 'misviajes') {
    contenido = (
      <MisViajes
        irADashboard={() => setPantalla('dashboard')}
        irACrearViaje={() => setPantalla('crearviaje')}
        irADetalle={(id) => {
          setViajeIdActual(id)
          setPantalla('detalleviaje')
        }}
      />
    )
  } else if (pantalla === 'crearviaje') {
    contenido = (
      <CrearViaje
        irADashboard={() => setPantalla('dashboard')}
        irADetalle={async (id) => {
          setViajeIdActual(id)
          await cargarPerfil()
          setPantalla('detalleviaje')
        }}
      />
    )
  } else if (pantalla === 'detalleviaje') {
    contenido = <DetalleViaje irADashboard={() => setPantalla('dashboard')} viajeId={viajeIdActual} />
  } else if (pantalla === 'papeleo') {
    contenido = (
      <Papeleo
        irADashboard={() => setPantalla('dashboard')}
        irACrearViaje={() => setPantalla('crearviaje')}
        irADetalle={(id) => {
          setViajeIdActual(id)
          setPantalla('detalleviaje')
        }}
      />
    )
  } else if (pantalla === 'maleta') {
    contenido = <Maleta irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'wishlist') {
    contenido = <Wishlist irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'diario') {
    contenido = <Diario irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'tienda') {
    contenido = <Tienda irADashboard={() => setPantalla('dashboard')} />
  } else if (pantalla === 'configuracion') {
    contenido = (
      <Configuracion
        irADashboard={() => setPantalla('dashboard')}
        irATerminos={() => setPantalla('terminos')}
        irAPrivacidad={() => setPantalla('privacidad')}
        irAAyuda={() => setPantalla('ayuda')}
        onCerrarSesion={async () => {
          await supabase.auth.signOut()
          setPerfilUsuario(null)
          setViajeActivo(null)
          setPantalla('splash')
        }}
      />
    )
  } else if (pantalla === 'terminos') {
    contenido = (
      <PantallaInfo
        irAConfiguracion={() => setPantalla('configuracion')}
        titulo="📄 Términos y condiciones"
        parrafos={[
          'Al usar MOVIXA aceptás que esta es una versión inicial (MVP) de la aplicación, en desarrollo activo.',
          'La información sobre visas, requisitos migratorios y documentos que se muestra en la app tiene fines informativos generales y no reemplaza la consulta oficial con embajadas, consulados o autoridades migratorias.',
          'No garantizamos que la información esté siempre actualizada al 100%. Te recomendamos siempre confirmar los requisitos de tu viaje con fuentes oficiales antes de viajar.',
          'MOVIXA no se hace responsable por decisiones de viaje tomadas exclusivamente en base a la información de la app.',
        ]}
      />
    )
  } else if (pantalla === 'privacidad') {
    contenido = (
      <PantallaInfo
        irAConfiguracion={() => setPantalla('configuracion')}
        titulo="🔒 Política de privacidad"
        parrafos={[
          'Guardamos los datos que nos das al registrarte y usar la app (nombre, correo, preferencias de viaje, pasaportes, información médica de emergencia) para poder ofrecerte una experiencia personalizada.',
          'Tu información se guarda de forma segura y solo vos podés ver y editar tus propios datos.',
          'No compartimos ni vendemos tu información personal a terceros sin tu consentimiento.',
          'La información médica de emergencia que agregás es opcional y pensada únicamente para ayudarte en caso de una emergencia durante tu viaje.',
          'Podés pedir que se elimine tu cuenta y tus datos en cualquier momento contactando a soporte.',
        ]}
      />
    )
  } else if (pantalla === 'ayuda') {
    contenido = (
      <PantallaInfo
        irAConfiguracion={() => setPantalla('configuracion')}
        titulo="💬 Ayuda y soporte"
        parrafos={[
          '¿Tenés dudas o problemas usando MOVIXA? Escribinos a soporte@movixa.com y te vamos a responder lo antes posible.',
          'Preguntas frecuentes:',
          '¿Cómo creo un viaje? Andá al Dashboard y tocá "Crear viaje", elegí tu destino o dejá que MOVIXA te recomiende opciones.',
          '¿Cómo cambio mi contraseña? Andá a Configuración → Seguridad → Cambiar contraseña.',
          '¿Mis datos están seguros? Sí, revisá nuestra Política de privacidad para más detalles.',
        ]}
      />
    )
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