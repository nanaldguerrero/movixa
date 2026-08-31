import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Tienda.css'

const categorias = [
  {
    nombre: 'Seguros de viaje',
    icono: '🛡️',
    desc: 'Cobertura médica y de equipaje para tu viaje',
    busqueda: 'seguro de viaje para',
  },
  {
    nombre: 'SIM / Datos móviles',
    icono: '📶',
    desc: 'Conectate apenas llegues a tu destino',
    busqueda: 'eSIM datos móviles para turistas en',
  },
  {
    nombre: 'Hoteles',
    icono: '🏨',
    desc: 'Reservas con descuento para usuarios MOVIXA',
    busqueda: 'mejores hoteles en',
  },
  {
    nombre: 'Vuelos',
    icono: '✈️',
    desc: 'Comparación de aerolíneas y precios',
    busqueda: 'vuelos baratos a',
  },
  {
    nombre: 'Tours y actividades',
    icono: '🗺️',
    desc: 'Experiencias guiadas en tu destino',
    busqueda: 'tours y actividades en',
  },
  {
    nombre: 'Universidades',
    icono: '🎓',
    desc: 'Programas de intercambio y estudios',
    busqueda: 'programas de intercambio universitario en',
  },
]

function Tienda({ irADashboard }) {
  const [destino, setDestino] = useState('')

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: viajes } = await supabase
        .from('viajes')
        .select('destino')
        .eq('user_id', user.id)
        .order('creado_en', { ascending: false })
        .limit(1)
      if (viajes && viajes.length > 0) setDestino(viajes[0].destino)
    }
    cargar()
  }, [])

  const abrirBusqueda = (terminos) => {
    const consulta = destino ? `${terminos} ${destino}` : terminos
    window.open(`https://www.google.com/search?q=${encodeURIComponent(consulta)}`, '_blank')
  }

  return (
    <div className="tienda">
      <div className="tie-header">
        <button className="tie-volver" onClick={irADashboard}>← Volver</button>
        <div className="tie-logo">MOVIXA</div>
      </div>

      <h2 className="tie-titulo">🛍️ Tienda</h2>
      <p className="tie-subtitulo">
        {destino ? `Servicios recomendados para tu viaje a ${destino}` : 'Servicios recomendados para tu viaje'}
      </p>

      <div className="tie-grid">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="tie-tarjeta">
            <div className="tie-icono">{cat.icono}</div>
            <div className="tie-nombre">{cat.nombre}</div>
            <div className="tie-desc">{cat.desc}</div>
            <button className="tie-boton" onClick={() => abrirBusqueda(cat.busqueda)}>Ver opciones</button>
          </div>
        ))}
      </div>

      <p className="tie-aviso">MOVIXA todavía no tiene alianzas propias con estos servicios. Por ahora te ayudamos a buscar opciones confiables en la web.</p>
    </div>
  )
}

export default Tienda