import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './LibroViaje.css'

const animosInfo = {
  increible: { emoji: '🤩', nombre: 'Increíble' },
  feliz: { emoji: '😄', nombre: 'Feliz' },
  normal: { emoji: '😐', nombre: 'Normal' },
  cansado: { emoji: '😴', nombre: 'Cansado' },
  triste: { emoji: '😢', nombre: 'Triste' },
  estresado: { emoji: '😰', nombre: 'Estresado' },
}

function LibroViaje({ irADiario }) {
  const [viaje, setViaje] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }

      let { data: viajes } = await supabase
        .from('viajes')
        .select('*')
        .eq('user_id', user.id)
        .eq('activo', true)
        .limit(1)

      if (!viajes || viajes.length === 0) {
        const resultado = await supabase
          .from('viajes')
          .select('*')
          .eq('user_id', user.id)
          .order('creado_en', { ascending: false })
          .limit(1)
        viajes = resultado.data
      }

      if (viajes && viajes.length > 0) {
        setViaje(viajes[0])
      }

      setCargando(false)
    }
    cargar()
  }, [])

  const imprimir = () => {
    window.print()
  }

  if (cargando) {
    return <div className="lv"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Preparando tu libro...</p></div>
  }

  if (!viaje) {
    return (
      <div className="lv">
        <div className="lv-header no-print">
          <button className="lv-volver" onClick={irADiario}>← Volver</button>
        </div>
        <p style={{ textAlign: 'center', paddingTop: '40px', color: '#888' }}>No se encontró ningún viaje.</p>
      </div>
    )
  }

  const entradas = [...(viaje.diario || [])].reverse()
  const planes = viaje.itinerario || []
  const planesLogrados = planes.filter((p) => p.hecho)
  const animos = viaje.animos || []
  const fechas = [...new Set(planes.map((p) => p.fecha))].sort()
  const rangoFechas = fechas.length > 0
    ? `${fechas[0]} — ${fechas[fechas.length - 1]}`
    : null

  return (
    <div className="lv">
      <div className="lv-header no-print">
        <button className="lv-volver" onClick={irADiario}>← Volver al Diario</button>
        <button className="lv-boton-imprimir" onClick={imprimir}>🖨️ Imprimir / Guardar como PDF</button>
      </div>

      <div className="lv-pagina lv-portada">
        <div className="lv-portada-marco">
          <div className="lv-portada-avion">✈️</div>
          <h1 className="lv-portada-titulo">Mi viaje a<br />{viaje.destino}</h1>
          <p className="lv-portada-motivo">{viaje.motivo}</p>
          {rangoFechas && <p className="lv-portada-fechas">{rangoFechas}</p>}
          <div className="lv-portada-marca">MOVIXA</div>
        </div>
      </div>

      {entradas.length === 0 ? (
        <div className="lv-pagina lv-vacio">
          <p>Todavía no escribiste ninguna entrada en el Diario de este viaje. Andá al Diario y agregá tus recuerdos para que aparezcan acá.</p>
        </div>
      ) : (
        entradas.map((entrada) => (
          <div key={entrada.id} className="lv-pagina lv-entrada">
            {entrada.foto && (
              <img src={entrada.foto} alt={entrada.titulo} className="lv-entrada-foto" />
            )}
            <div className="lv-entrada-fecha">{entrada.fecha}</div>
            <h2 className="lv-entrada-titulo">{entrada.titulo}</h2>
            <p className="lv-entrada-texto">{entrada.texto}</p>
          </div>
        ))
      )}

      {(planesLogrados.length > 0 || animos.length > 0) && (
        <div className="lv-pagina lv-resumen">
          <h2 className="lv-resumen-titulo">Resumen del viaje</h2>

          {planesLogrados.length > 0 && (
            <div className="lv-resumen-seccion">
              <h3>Lo que logré hacer</h3>
              <ul className="lv-resumen-lista">
                {planesLogrados.map((p) => (
                  <li key={p.id}>✓ {p.titulo}</li>
                ))}
              </ul>
            </div>
          )}

          {animos.length > 0 && (
            <div className="lv-resumen-seccion">
              <h3>Cómo me sentí en el camino</h3>
              <div className="lv-resumen-animos">
                {animos.map((a, i) => (
                  <span key={i} className="lv-resumen-animo-emoji" title={animosInfo[a.animo]?.nombre}>
                    {animosInfo[a.animo]?.emoji}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="lv-resumen-cierre">Gracias por viajar con MOVIXA 🧭</p>
        </div>
      )}
    </div>
  )
}

export default LibroViaje