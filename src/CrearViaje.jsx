import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde } from './nacionalidadUtils'
import './CrearViaje.css'

const checklistPorDefecto = [
  { id: 1, categoria: 'Papeleo', texto: 'Pasaporte vigente', hecho: false },
  { id: 2, categoria: 'Papeleo', texto: 'Visa (si aplica)', hecho: false },
  { id: 3, categoria: 'Papeleo', texto: 'Seguro de viaje', hecho: false },
  { id: 4, categoria: 'Papeleo', texto: 'Reserva de hotel', hecho: false },
  { id: 5, categoria: 'Maleta', texto: 'Ropa para el clima', hecho: false },
  { id: 6, categoria: 'Maleta', texto: 'Cargador y adaptador', hecho: false },
  { id: 7, categoria: 'Maleta', texto: 'Artículos de higiene', hecho: false },
  { id: 8, categoria: 'Antes de salir', texto: 'Avisar al banco del viaje', hecho: false },
  { id: 9, categoria: 'Antes de salir', texto: 'Confirmar transporte al aeropuerto', hecho: false },
]

const categoriaDestinos = {
  playa: ['Panamá', 'República Dominicana', 'Cuba', 'Colombia'],
  montaña: ['Perú', 'Chile', 'Argentina'],
  ciudad: ['España', 'Francia', 'Italia', 'Alemania', 'Japón', 'Corea del Sur', 'Reino Unido'],
  aventura: ['Ecuador', 'Perú', 'Chile', 'Argentina'],
  relax: ['Panamá', 'República Dominicana', 'Cuba', 'México'],
}

const mapaRitmoCategoria = { 'Relax': 'relax', 'Aventura': 'aventura' }

function CrearViaje({ irADashboard, irADetalle, destinoInicial }) {
  const [sabeDestino, setSabeDestino] = useState(destinoInicial ? true : null)
  const [destino, setDestino] = useState('')
  const [motivo, setMotivo] = useState('')
  const [creando, setCreando] = useState(false)
  const [errorCreacion, setErrorCreacion] = useState('')
  const [pasaportes, setPasaportes] = useState([])
  const [pasaporteSeleccionado, setPasaporteSeleccionado] = useState('')
  const [nacionalidadPerfil, setNacionalidadPerfil] = useState('')

  const [destinosDisponibles, setDestinosDisponibles] = useState([])
  const [destinoManual, setDestinoManual] = useState('')

  const [preferencia, setPreferencia] = useState('')
  const [sugerencias, setSugerencias] = useState([])

  const [climasPerfil, setClimasPerfil] = useState([])
  const [tiposDestinoPerfil, setTiposDestinoPerfil] = useState([])
  const [ritmoPerfil, setRitmoPerfil] = useState('')
  const [usarPreferenciasGuardadas, setUsarPreferenciasGuardadas] = useState(null)

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('perfiles')
        .select('pasaportes, nacionalidad, climas, tipos_destino, ritmo')
        .eq('id', user.id)
        .single()

      const lista = data?.pasaportes || []
      setPasaportes(lista)
      setNacionalidadPerfil(data?.nacionalidad || '')
      if (lista.length > 0) setPasaporteSeleccionado(lista[0])

      setClimasPerfil(data?.climas || [])
      setTiposDestinoPerfil(data?.tipos_destino || [])
      setRitmoPerfil(data?.ritmo || '')

      const { data: destinos } = await supabase.from('requisitos_visa').select('destino')
      if (destinos) {
        const unicos = [...new Set(destinos.map((d) => d.destino))].sort((a, b) => a.localeCompare(b))
        setDestinosDisponibles(unicos)

        if (destinoInicial) {
          if (unicos.includes(destinoInicial)) {
            setDestino(destinoInicial)
          } else {
            setDestino('__otro__')
            setDestinoManual(destinoInicial)
          }
        }
      }
    }
    cargarDatos()
  }, [])

  const tienePreferenciasGuardadas = tiposDestinoPerfil.length > 0 || !!ritmoPerfil

  const obtenerSugerenciasDePerfil = (destinosDisp) => {
    let clavesValidas = Object.keys(categoriaDestinos)
    let candidatas = tiposDestinoPerfil.map((t) => t.toLowerCase()).filter((t) => clavesValidas.includes(t))

    if (candidatas.length === 0 && ritmoPerfil) {
      const clave = mapaRitmoCategoria[ritmoPerfil]
      if (clave) candidatas = [clave]
    }
    if (candidatas.length === 0) candidatas = ['ciudad']

    const todos = candidatas.flatMap((c) => categoriaDestinos[c] || [])
    const unicos = [...new Set(todos)]
    return unicos.filter((c) => destinosDisp.includes(c)).slice(0, 3)
  }

  const elegirUsarPreferencias = () => {
    setUsarPreferenciasGuardadas(true)
    setSugerencias(obtenerSugerenciasDePerfil(destinosDisponibles))
  }

  const elegirPreferencia = (valor) => {
    setPreferencia(valor)
    const candidatos = categoriaDestinos[valor] || []
    const disponibles = candidatos.filter((c) => destinosDisponibles.includes(c))
    setSugerencias(disponibles.slice(0, 3))
  }

  const crearViaje = async (destinoFinal, motivoFinal) => {
    setErrorCreacion('')

    if (!destinoFinal || destinoFinal.trim() === '') {
      setErrorCreacion('Necesitás elegir un destino antes de continuar.')
      return
    }

    setCreando(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setCreando(false)
      setErrorCreacion('No pudimos confirmar tu sesión. Intentá iniciar sesión de nuevo.')
      return
    }

    const nacionalidad = nacionalidadDesde(pasaporteSeleccionado, nacionalidadPerfil)

    await supabase.from('viajes').update({ activo: false }).eq('user_id', user.id)

    const { data: requisito, error: errorRequisito } = await supabase
      .from('requisitos_visa')
      .select('*')
      .eq('nacionalidad', nacionalidad)
      .ilike('destino', `%${destinoFinal}%`)
      .maybeSingle()

    if (errorRequisito) {
      console.warn('No se pudo consultar requisitos:', errorRequisito.message)
    }

    const { data, error } = await supabase
      .from('viajes')
      .insert({
        user_id: user.id,
        destino: destinoFinal || 'Mi viaje',
        motivo: motivoFinal || 'Turismo',
        pasaporte: pasaporteSeleccionado || null,
        checklist: checklistPorDefecto,
        requisitos_snapshot: requisito || null,
        activo: true,
      })
      .select()
      .single()

    setCreando(false)

    if (error || !data) {
      setErrorCreacion('Hubo un problema creando el viaje: ' + (error?.message || 'no se recibió confirmación del servidor.'))
      return
    }

    irADetalle(data.id)
  }

  return (
    <div className="crear-viaje">
      <div className="cv-header">
        <button className="cv-volver" onClick={irADashboard}>← Volver</button>
        <div className="cv-logo">MOVIXA</div>
      </div>

      <div className="cv-card">
        <h2>Crear viaje</h2>

        {sabeDestino === null && (
          <>
            <p className="cv-pregunta">¿Ya sabés a dónde querés viajar?</p>
            <button className="cv-opcion" onClick={() => setSabeDestino(true)}>
              Sí, ya sé mi destino
            </button>
            <button className="cv-opcion cv-opcion-secundaria" onClick={() => setSabeDestino(false)}>
              No, ayudame a elegir
            </button>
          </>
        )}

        {sabeDestino === true && (
          <>
            {pasaportes.length > 1 && (
              <>
                <label className="cv-label">¿Con qué pasaporte vas a viajar?</label>
                <select className="cv-input" value={pasaporteSeleccionado} onChange={(e) => setPasaporteSeleccionado(e.target.value)}>
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}

            <label className="cv-label">¿A dónde querés ir?</label>
            <select className="cv-input" value={destino} onChange={(e) => setDestino(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              {destinosDisponibles.map((pais) => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
              <option value="__otro__">Otro (escribir destino)</option>
            </select>

            {destino === '__otro__' && (
              <input
                type="text"
                placeholder="Escribí tu destino"
                className="cv-input"
                style={{ marginTop: '8px' }}
                value={destinoManual}
                onChange={(e) => setDestinoManual(e.target.value)}
              />
            )}

            <label className="cv-label">Motivo del viaje</label>
            <select className="cv-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              <option value="turismo">Turismo</option>
              <option value="educacion">Educación</option>
              <option value="negocios">Negocios</option>
              <option value="reubicacion">Reubicación</option>
              <option value="otro">Otro</option>
            </select>

            {errorCreacion && <p className="cv-error">{errorCreacion}</p>}
            <button className="cv-boton" onClick={() => crearViaje(destino === '__otro__' ? destinoManual : destino, motivo)} disabled={creando}>
              {creando ? 'Creando...' : 'Continuar'}
            </button>
            <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
          </>
        )}

        {sabeDestino === false && (
          <>
            {pasaportes.length > 1 && (
              <>
                <label className="cv-label">¿Con qué pasaporte vas a viajar?</label>
                <select className="cv-input" value={pasaporteSeleccionado} onChange={(e) => setPasaporteSeleccionado(e.target.value)}>
                  {pasaportes.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </>
            )}

            {usarPreferenciasGuardadas === null && tienePreferenciasGuardadas && (
              <>
                <p className="cv-pregunta">Según tu Perfil, normalmente te gusta:</p>
                <div className="cv-chips-perfil">
                  {tiposDestinoPerfil.map((t) => <span key={t} className="cv-chip">{t}</span>)}
                  {ritmoPerfil && <span className="cv-chip">{ritmoPerfil}</span>}
                </div>
                <button className="cv-opcion" onClick={elegirUsarPreferencias}>
                  Sí, recomendame con esto
                </button>
                <button className="cv-opcion cv-opcion-secundaria" onClick={() => setUsarPreferenciasGuardadas(false)}>
                  Quiero algo distinto para este viaje
                </button>
                <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
              </>
            )}

            {(usarPreferenciasGuardadas === false || (usarPreferenciasGuardadas === null && !tienePreferenciasGuardadas)) && sugerencias.length === 0 && (
              <>
                <p className="cv-pregunta">Contame qué te gusta y te voy a recomendar destinos reales</p>
                <label className="cv-label">¿Qué buscás en este viaje?</label>
                <select className="cv-input" value={preferencia} onChange={(e) => elegirPreferencia(e.target.value)}>
                  <option value="">Seleccioná una opción</option>
                  <option value="playa">Playa</option>
                  <option value="montaña">Montaña</option>
                  <option value="ciudad">Ciudad / cultura</option>
                  <option value="aventura">Aventura</option>
                  <option value="relax">Relax</option>
                </select>
                <p className="cv-atras" onClick={() => setSabeDestino(null)}>← Volver atrás</p>
              </>
            )}

            {sugerencias.length > 0 && (
              <>
                <p className="cv-pregunta">
                  {usarPreferenciasGuardadas ? 'Según tu perfil, te recomiendo:' : 'Según lo que buscás, te recomiendo:'}
                </p>
                {errorCreacion && <p className="cv-error">{errorCreacion}</p>}
                {sugerencias.map((pais) => (
                  <button key={pais} className="cv-opcion" onClick={() => crearViaje(pais, 'Turismo')} disabled={creando}>
                    ✈️ {pais}
                  </button>
                ))}
                <p className="cv-atras" onClick={() => { setSugerencias([]); setPreferencia(''); setUsarPreferenciasGuardadas(null) }}>
                  ← Elegir de otra forma
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CrearViaje