import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde, requisitosCambiaron } from './nacionalidadUtils'
import './DetalleViaje.css'

function DetalleViaje({ irADashboard, viajeId, irAPapeleo, irAMaleta, irADiario, irABitacora }) {
  const [viaje, setViaje] = useState(null)
  const [requisito, setRequisito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState(false)

  const [editando, setEditando] = useState(false)
  const [destinosDisponibles, setDestinosDisponibles] = useState([])
  const [destinoEdit, setDestinoEdit] = useState('')
  const [destinoEditManual, setDestinoEditManual] = useState('')
  const [motivoEdit, setMotivoEdit] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  const [acompanantes, setAcompanantes] = useState([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoPasaporte, setNuevoPasaporte] = useState('')
  const [agregandoAcompanante, setAgregandoAcompanante] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      if (!viajeId) {
        setCargando(false)
        return
      }
      const { data } = await supabase.from('viajes').select('*').eq('id', viajeId).single()
      setViaje(data)
      setAcompanantes(data?.acompanantes || [])

      const { data: destinos } = await supabase.from('requisitos_visa').select('destino')
      if (destinos) {
        setDestinosDisponibles([...new Set(destinos.map((d) => d.destino))].sort((a, b) => a.localeCompare(b)))
      }

      if (data) {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: perfil } = await supabase.from('perfiles').select('nacionalidad').eq('id', user.id).single()
        const nacionalidad = nacionalidadDesde(data.pasaporte, perfil?.nacionalidad)

        const { data: req } = await supabase
          .from('requisitos_visa')
          .select('*')
          .eq('nacionalidad', nacionalidad)
          .ilike('destino', `%${data.destino}%`)
          .maybeSingle()

        setRequisito(req)

        if (data.acompanantes && data.acompanantes.length > 0) {
          const acompanantesConRequisito = await Promise.all(
            data.acompanantes.map(async (a) => {
              const nacionalidadAcomp = nacionalidadDesde(a.pasaporte, null)
              const { data: reqAcomp } = await supabase
                .from('requisitos_visa')
                .select('*')
                .eq('nacionalidad', nacionalidadAcomp)
                .ilike('destino', `%${data.destino}%`)
                .maybeSingle()
              return { ...a, requisito: reqAcomp }
            })
          )
          setAcompanantes(acompanantesConRequisito)
        }
      }

      setCargando(false)
    }
    cargar()
  }, [viajeId])

  const toggleItem = async (id) => {
    const nuevoChecklist = viaje.checklist.map((item) =>
      item.id === id ? { ...item, hecho: !item.hecho } : item
    )
    setViaje({ ...viaje, checklist: nuevoChecklist })
    await supabase.from('viajes').update({ checklist: nuevoChecklist }).eq('id', viajeId)
  }

  const actualizarNotaLocal = (id, texto) => {
    const nuevoChecklist = viaje.checklist.map((item) =>
      item.id === id ? { ...item, nota: texto } : item
    )
    setViaje({ ...viaje, checklist: nuevoChecklist })
  }

  const guardarNota = async () => {
    await supabase.from('viajes').update({ checklist: viaje.checklist }).eq('id', viajeId)
  }

  const actualizarSnapshot = async () => {
    setActualizando(true)
    await supabase.from('viajes').update({ requisitos_snapshot: requisito }).eq('id', viajeId)
    setViaje({ ...viaje, requisitos_snapshot: requisito })
    setActualizando(false)
  }

  const empezarEdicion = () => {
    setDestinoEdit(destinosDisponibles.includes(viaje.destino) ? viaje.destino : '__otro__')
    setDestinoEditManual(destinosDisponibles.includes(viaje.destino) ? '' : viaje.destino)
    setMotivoEdit(viaje.motivo)
    setEditando(true)
  }

  const guardarEdicion = async () => {
    const destinoFinal = destinoEdit === '__otro__' ? destinoEditManual : destinoEdit
    if (!destinoFinal || destinoFinal.trim() === '') return

    setGuardandoEdicion(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: perfil } = await supabase.from('perfiles').select('nacionalidad').eq('id', user.id).single()
    const nacionalidad = nacionalidadDesde(viaje.pasaporte, perfil?.nacionalidad)

    const { data: nuevoRequisito } = await supabase
      .from('requisitos_visa')
      .select('*')
      .eq('nacionalidad', nacionalidad)
      .ilike('destino', `%${destinoFinal}%`)
      .maybeSingle()

    await supabase
      .from('viajes')
      .update({
        destino: destinoFinal,
        motivo: motivoEdit,
        requisitos_snapshot: nuevoRequisito || null,
      })
      .eq('id', viajeId)

    setViaje({ ...viaje, destino: destinoFinal, motivo: motivoEdit, requisitos_snapshot: nuevoRequisito || null })
    setRequisito(nuevoRequisito)
    setGuardandoEdicion(false)
    setEditando(false)
  }

  const agregarAcompanante = async () => {
    if (nuevoNombre.trim() === '' || nuevoPasaporte.trim() === '') return
    setAgregandoAcompanante(true)

    const nacionalidadAcomp = nacionalidadDesde(nuevoPasaporte, null)
    const { data: reqAcomp } = await supabase
      .from('requisitos_visa')
      .select('*')
      .eq('nacionalidad', nacionalidadAcomp)
      .ilike('destino', `%${viaje.destino}%`)
      .maybeSingle()

    const nuevo = [...acompanantes, { id: Date.now(), nombre: nuevoNombre, pasaporte: nuevoPasaporte, requisito: reqAcomp }]
    setAcompanantes(nuevo)

    const paraGuardar = nuevo.map(({ id, nombre, pasaporte }) => ({ id, nombre, pasaporte }))
    await supabase.from('viajes').update({ acompanantes: paraGuardar }).eq('id', viajeId)

    setNuevoNombre('')
    setNuevoPasaporte('')
    setAgregandoAcompanante(false)
  }

  const eliminarAcompanante = async (id) => {
    const nuevo = acompanantes.filter((a) => a.id !== id)
    setAcompanantes(nuevo)
    const paraGuardar = nuevo.map(({ id, nombre, pasaporte }) => ({ id, nombre, pasaporte }))
    await supabase.from('viajes').update({ acompanantes: paraGuardar }).eq('id', viajeId)
  }

  const eliminarViaje = async () => {
    const confirmar = window.confirm('¿Seguro que querés eliminar este viaje? Esta acción no se puede deshacer.')
    if (!confirmar) return

    await supabase.from('viajes').delete().eq('id', viajeId)
    irADashboard()
  }

  const compartirViaje = () => {
    const checklist = viaje.checklist || []
    const hechos = checklist.filter((i) => i.hecho).length

    let mensaje = `✈️ Mi viaje a ${viaje.destino}\n`
    mensaje += `Motivo: ${viaje.motivo}\n\n`

    if (requisito) {
      mensaje += requisito.requiere_visa
        ? `⚠️ Necesito visa (${requisito.nombre_permiso || 'trámite requerido'})\n`
        : `✅ No necesito visa\n`
      if (requisito.vacunas && requisito.vacunas.startsWith('OBLIGATORIA')) {
        mensaje += `💉 Vacuna obligatoria: ver detalles en MOVIXA\n`
      }
      mensaje += `\n`
    }

    if (acompanantes.length > 0) {
      mensaje += `👥 Compañeros de viaje:\n`
      acompanantes.forEach((a) => {
        const estado = a.requisito ? (a.requisito.requiere_visa ? '⚠️ necesita visa' : '✅ no necesita visa') : 'sin info'
        mensaje += `• ${a.nombre} (${a.pasaporte}): ${estado}\n`
      })
      mensaje += `\n`
    }

    mensaje += `📋 Checklist: ${hechos} de ${checklist.length} completado\n\n`

    const pendientes = checklist.filter((i) => !i.hecho)
    if (pendientes.length > 0) {
      mensaje += `Pendiente:\n`
      pendientes.forEach((item) => {
        mensaje += `• ${item.texto}\n`
      })
      mensaje += `\n`
    }

    const planes = viaje.itinerario || []
    if (planes.length > 0) {
      const planesOrdenados = [...planes].sort((a, b) => {
        if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
        return (a.hora || '').localeCompare(b.hora || '')
      })
      const logrados = planesOrdenados.filter((p) => p.hecho).length

      mensaje += `🗓️ Bitácora: ${logrados} de ${planesOrdenados.length} planes logrados\n`
      planesOrdenados.forEach((plan) => {
        const marca = plan.hecho ? '✅' : '⬜'
        const horaTexto = plan.hora ? ` (${plan.hora})` : ''
        mensaje += `${marca} ${plan.fecha}${horaTexto} - ${plan.titulo}\n`
      })
      mensaje += `\n`
    }

    mensaje += `Creado con MOVIXA`

    if (navigator.share) {
      navigator.share({ title: `Mi viaje a ${viaje.destino}`, text: mensaje }).catch(() => {})
    } else {
      navigator.clipboard.writeText(mensaje)
      alert('El resumen del viaje se copió al portapapeles. Ya podés pegarlo donde quieras (WhatsApp, notas, etc.)')
    }
  }

  if (cargando) {
    return <div className="dv"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando viaje...</p></div>
  }

  if (!viaje) {
    return (
      <div className="dv">
        <div className="dv-header">
          <button className="dv-volver" onClick={irADashboard}>← Volver</button>
          <div className="dv-logo">MOVIXA</div>
        </div>
        <p style={{ textAlign: 'center', paddingTop: '40px', color: '#888' }}>No se encontró este viaje.</p>
      </div>
    )
  }

  const checklist = viaje.checklist || []
  const categorias = [...new Set(checklist.map((i) => i.categoria))]
  const hechos = checklist.filter((i) => i.hecho).length
  const porcentaje = checklist.length > 0 ? Math.round((hechos / checklist.length) * 100) : 0
  const vacunaObligatoria = requisito?.vacunas?.startsWith('OBLIGATORIA')
  const cambio = requisitosCambiaron(viaje.requisitos_snapshot, requisito)

  return (
    <div className="dv">
      <div className="dv-header">
        <button className="dv-volver" onClick={irADashboard}>← Volver</button>
        <div className="dv-logo">MOVIXA</div>
      </div>

      {!editando ? (
        <div className="dv-portada">
          <div className="dv-destino">✈️ {viaje.destino}</div>
          <div className="dv-motivo">{viaje.motivo}</div>
          <button className="dv-boton-editar-viaje" onClick={empezarEdicion}>✏️ Editar destino / motivo</button>
        </div>
      ) : (
        <div className="dv-edicion-card">
          <label className="dv-edicion-label">Destino</label>
          <select className="dv-edicion-input" value={destinoEdit} onChange={(e) => setDestinoEdit(e.target.value)}>
            {destinosDisponibles.map((pais) => (
              <option key={pais} value={pais}>{pais}</option>
            ))}
            <option value="__otro__">Otro (escribir destino)</option>
          </select>
          {destinoEdit === '__otro__' && (
            <input
              type="text"
              placeholder="Escribí tu destino"
              className="dv-edicion-input"
              value={destinoEditManual}
              onChange={(e) => setDestinoEditManual(e.target.value)}
            />
          )}

          <label className="dv-edicion-label">Motivo</label>
          <select className="dv-edicion-input" value={motivoEdit} onChange={(e) => setMotivoEdit(e.target.value)}>
            <option value="turismo">Turismo</option>
            <option value="educacion">Educación</option>
            <option value="negocios">Negocios</option>
            <option value="reubicacion">Reubicación</option>
            <option value="otro">Otro</option>
          </select>

          <div className="dv-edicion-botones">
            <button className="dv-edicion-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
            <button className="dv-edicion-guardar" onClick={guardarEdicion} disabled={guardandoEdicion}>
              {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      <div className="dv-accesos">
        <button className="dv-acceso" onClick={irAPapeleo}>
          <span className="dv-acceso-icono">📋</span>
          <span>Papeleo</span>
        </button>
        <button className="dv-acceso" onClick={irAMaleta}>
          <span className="dv-acceso-icono">🧳</span>
          <span>Maleta</span>
        </button>
        <button className="dv-acceso" onClick={irABitacora}>
          <span className="dv-acceso-icono">🗓️</span>
          <span>Bitácora</span>
        </button>
        <button className="dv-acceso" onClick={irADiario}>
          <span className="dv-acceso-icono">📔</span>
          <span>Diario</span>
        </button>
      </div>

      {cambio && (
        <div className="dv-alerta-cambio">
          <div className="dv-alerta-titulo">⚠️ Los requisitos de este viaje cambiaron</div>
          <p className="dv-alerta-texto">Desde que creaste este viaje, actualizamos la información de requisitos para este destino. Revisá los detalles abajo.</p>
          <button className="dv-alerta-boton" onClick={actualizarSnapshot} disabled={actualizando}>
            {actualizando ? 'Actualizando...' : 'Ya lo revisé, actualizar'}
          </button>
        </div>
      )}

      {requisito ? (
        <>
          <div className={`dv-visa-card ${requisito.requiere_visa ? 'dv-visa-si' : 'dv-visa-no'}`}>
            <div className="dv-visa-titulo">
              {requisito.requiere_visa ? '⚠️ Necesitás visa' : '✅ No necesitás visa'}
            </div>
            {requisito.nombre_permiso && <p className="dv-visa-detalle"><strong>{requisito.nombre_permiso}</strong></p>}
            <p className="dv-visa-detalle">Estadía máxima: {requisito.dias_permitidos} días</p>
            <p className="dv-visa-detalle">Pasaporte con al menos {requisito.vigencia_pasaporte_meses} meses de vigencia</p>
            {requisito.notas && <p className="dv-visa-notas">{requisito.notas}</p>}
          </div>

          {requisito.vacunas && (
            <div className={`dv-visa-card ${vacunaObligatoria ? 'dv-visa-si' : 'dv-visa-no'}`}>
              <div className="dv-visa-titulo">
                {vacunaObligatoria ? '💉 Vacuna obligatoria' : '💉 Vacunas'}
              </div>
              <p className="dv-visa-detalle">{requisito.vacunas}</p>
            </div>
          )}
        </>
      ) : (
        <div className="dv-visa-card dv-visa-desconocido">
          <p className="dv-visa-detalle">Todavía no tenemos información verificada de requisitos para este destino. Te recomendamos consultar directamente con la embajada correspondiente antes de viajar.</p>
        </div>
      )}

      <div className="dv-companeros-card">
        <h3 className="dv-companeros-titulo">👥 Compañeros de viaje</h3>

        {acompanantes.length === 0 && <p className="dv-companeros-vacio">Viajás solo/a en este viaje. Agregá a alguien si viajan juntos.</p>}

        {acompanantes.map((a) => (
          <div key={a.id} className="dv-companero-item">
            <div className="dv-companero-info">
              <span className="dv-companero-nombre">{a.nombre}</span>
              <span className="dv-companero-pasaporte">{a.pasaporte}</span>
            </div>
            {a.requisito ? (
              <span className={`dv-companero-badge ${a.requisito.requiere_visa ? 'dv-companero-badge-si' : 'dv-companero-badge-no'}`}>
                {a.requisito.requiere_visa ? '⚠️ Necesita visa' : '✅ No necesita'}
              </span>
            ) : (
              <span className="dv-companero-badge">Sin info</span>
            )}
            <button className="dv-companero-eliminar" onClick={() => eliminarAcompanante(a.id)}>×</button>
          </div>
        ))}

        <div className="dv-companero-form">
          <input
            type="text"
            placeholder="Nombre"
            className="dv-companero-input"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ej: 🇨🇦 Canadá"
            className="dv-companero-input"
            value={nuevoPasaporte}
            onChange={(e) => setNuevoPasaporte(e.target.value)}
          />
          <button className="dv-companero-agregar" onClick={agregarAcompanante} disabled={agregandoAcompanante}>
            {agregandoAcompanante ? 'Agregando...' : '+ Agregar compañero'}
          </button>
        </div>
      </div>

      <div className="dv-progreso-card">
        <div className="dv-progreso-texto">
          <span>{hechos} de {checklist.length} listos</span>
          <span className="dv-progreso-porcentaje">{porcentaje}%</span>
        </div>
        <div className="dv-barra-fondo">
          <div className="dv-barra-relleno" style={{ width: `${porcentaje}%` }}></div>
        </div>
      </div>

      {categorias.map((categoria) => (
        <div key={categoria} className="dv-categoria">
          <h3 className="dv-categoria-titulo">{categoria}</h3>
          <div className="dv-lista">
            {checklist
              .filter((item) => item.categoria === categoria)
              .map((item) => (
                <div key={item.id} className="dv-item-bloque">
                  <div
                    className={`dv-item ${item.hecho ? 'dv-item-hecho' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className={`dv-checkbox ${item.hecho ? 'dv-checkbox-marcado' : ''}`}>
                      {item.hecho && '✓'}
                    </div>
                    <span>{item.texto}</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Agregar detalles..."
                    className="dv-nota-input"
                    value={item.nota || ''}
                    onChange={(e) => actualizarNotaLocal(item.id, e.target.value)}
                    onBlur={guardarNota}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}

      <button className="dv-boton-compartir" onClick={compartirViaje}>📤 Compartir viaje</button>
      <button className="dv-boton-eliminar" onClick={eliminarViaje}>🗑️ Eliminar este viaje</button>
    </div>
  )
}

export default DetalleViaje