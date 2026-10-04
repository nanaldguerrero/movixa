import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { nacionalidadDesde } from './nacionalidadUtils'
import './Papeleo.css'

const iconoDocumento = (texto = '') => {
  const t = texto.toLowerCase()
  if (t.includes('pasaporte')) return '🛂'
  if (t.includes('visa')) return '🌎'
  if (t.includes('seguro')) return '🛡️'
  if (t.includes('hotel') || t.includes('reserva')) return '🏨'
  if (t.includes('banco') || t.includes('dinero')) return '💳'
  if (t.includes('vacuna') || t.includes('salud')) return '💉'
  if (t.includes('transporte')) return '🚕'
  if (t.includes('boleto') || t.includes('vuelo')) return '✈️'
  return '📄'
}

function Papeleo({ irADashboard, irACrearViaje, irADetalle }) {
  const [viaje, setViaje] = useState(null)
  const [requisito, setRequisito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardandoNota, setGuardandoNota] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setCargando(false)
        return
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('nacionalidad')
        .eq('id', user.id)
        .single()

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
        const viajeReciente = viajes[0]
        setViaje(viajeReciente)

        const nacionalidad = nacionalidadDesde(
          viajeReciente.pasaporte,
          perfil?.nacionalidad
        )

        const { data: req } = await supabase
          .from('requisitos_visa')
          .select('*')
          .eq('nacionalidad', nacionalidad)
          .ilike('destino', `%${viajeReciente.destino}%`)
          .maybeSingle()

        setRequisito(req)
      }

      setCargando(false)
    }

    cargar()
  }, [])

  const toggleItem = async (id) => {
    if (!viaje) return

    const nuevoChecklist = (viaje.checklist || []).map((item) =>
      item.id === id ? { ...item, hecho: !item.hecho } : item
    )

    setViaje({ ...viaje, checklist: nuevoChecklist })

    await supabase
      .from('viajes')
      .update({ checklist: nuevoChecklist })
      .eq('id', viaje.id)
  }

  const actualizarNotaLocal = (id, texto) => {
    if (!viaje) return

    const nuevoChecklist = (viaje.checklist || []).map((item) =>
      item.id === id ? { ...item, nota: texto } : item
    )

    setViaje({ ...viaje, checklist: nuevoChecklist })
  }

  const guardarNota = async () => {
    if (!viaje) return
    setGuardandoNota(true)

    await supabase
      .from('viajes')
      .update({ checklist: viaje.checklist })
      .eq('id', viaje.id)

    setTimeout(() => setGuardandoNota(false), 500)
  }

  if (cargando) {
    return (
      <div className="papeleo pap-cargando">
        <div className="pap-loading-card">
          <div className="pap-loading-passport">🛂</div>
          <div className="pap-loading-spinner" />
          <strong>Preparando tus documentos...</strong>
          <p>MOVIXA está organizando tu viaje.</p>
        </div>
      </div>
    )
  }

  if (!viaje) {
    return (
      <div className="papeleo">
        <header className="pap-header">
          <button className="pap-volver" onClick={irADashboard}>
            <span>←</span> Volver
          </button>
          <div className="pap-logo"><span>✈</span> MOVIXA</div>
        </header>

        <main className="pap-empty">
          <div className="pap-empty-illustration">
            <div className="pap-empty-ring">🛂</div>
            <span>✦</span>
          </div>
          <span className="pap-kicker">CENTRO DE PREPARACIÓN</span>
          <h1>Tu carpeta de viaje<br /><strong>está esperando.</strong></h1>
          <p>
            Creá tu próxima aventura y MOVIXA preparará
            el papeleo que necesitás antes de despegar.
          </p>
          <button className="pap-boton-crear" onClick={irACrearViaje}>
            <span>✈️</span> Crear mi primer viaje
          </button>
        </main>
      </div>
    )
  }

  const itemsPapeleo = (viaje.checklist || []).filter(
    (item) => item.categoria === 'Papeleo'
  )

  const completados = itemsPapeleo.filter((item) => item.hecho).length
  const total = itemsPapeleo.length
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0
  const vacunaObligatoria = requisito?.vacunas?.startsWith('OBLIGATORIA')

  return (
    <div className="papeleo">
      <header className="pap-header">
        <button className="pap-volver" onClick={irADashboard}>
          <span>←</span> Volver
        </button>

        <div className="pap-logo">
          <span>✈</span> MOVIXA
        </div>

        <div className="pap-header-badge">
          <span>●</span> DOCUMENTOS
        </div>
      </header>

      <main className="pap-contenido">
        <section className="pap-hero">
          <div className="pap-hero-cloud cloud-one" />
          <div className="pap-hero-cloud cloud-two" />
          <div className="pap-hero-route" />
          <div className="pap-hero-plane">✈</div>

          <div className="pap-hero-copy">
            <span className="pap-kicker">CENTRO DE PREPARACIÓN</span>
            <h1>
              Tu papeleo para
              <strong>{viaje.destino}</strong>
            </h1>
            <p>
              Una carpeta organizada para que sepas qué está listo
              y qué falta antes de comenzar tu aventura.
            </p>
            <div className="pap-destination-pill">
              <span>📍</span> {viaje.destino}
              <span className="pap-pill-dot">•</span>
              {viaje.motivo || 'Viaje'}
            </div>
          </div>

          <div className="pap-passport-card">
            <div className="pap-passport-top">
              <span>TRAVEL DOCUMENTS</span>
              <span>✦</span>
            </div>
            <div className="pap-passport-symbol">✈</div>
            <strong>MOVIXA</strong>
            <small>TRAVEL PREP</small>
            <div className="pap-passport-lines">
              <i /><i /><i />
            </div>
          </div>
        </section>

        <section className="pap-progress-card">
          <div className="pap-progress-copy">
            <span>PROGRESO DE TU CARPETA</span>
            <strong>{completados} <small>/ {total}</small></strong>
            <p>
              {porcentaje === 100
                ? '🎉 Todo el papeleo de tu checklist está listo.'
                : porcentaje >= 70
                  ? '✨ ¡Ya casi está todo preparado!'
                  : porcentaje >= 30
                    ? '🧳 Vas avanzando con tu preparación.'
                    : '✈️ Empecemos paso a paso.'}
            </p>
          </div>

          <div className="pap-progress-circle" style={{ '--progress': `${porcentaje}%` }}>
            <div><strong>{porcentaje}</strong><span>%</span></div>
          </div>

          <div className="pap-progress-bar">
            <span style={{ width: `${porcentaje}%` }} />
          </div>
        </section>

        {requisito ? (
          <section className="pap-section">
            <div className="pap-section-heading">
              <div className="pap-section-icon">🌎</div>
              <div>
                <span>ANTES DE VIAJAR</span>
                <h2>Información de {viaje.destino}</h2>
              </div>
            </div>

            <div className="pap-info-grid">
              <article className="pap-info-card">
                <div className="pap-info-icon">🌤️</div>
                <div><small>Clima</small><strong>{requisito.clima_general || '—'}</strong></div>
              </article>
              <article className="pap-info-card">
                <div className="pap-info-icon">💱</div>
                <div><small>Moneda</small><strong>{requisito.moneda || '—'}</strong></div>
              </article>
              <article className="pap-info-card">
                <div className="pap-info-icon">🗣️</div>
                <div><small>Idioma</small><strong>{requisito.idioma_principal || '—'}</strong></div>
              </article>
            </div>
          </section>
        ) : (
          <div className="pap-sin-info">
            <span>ℹ️</span>
            <p>Todavía no tenemos información detallada de {viaje.destino}.</p>
          </div>
        )}

        {requisito && (
          <section className="pap-section">
            <div className="pap-section-heading">
              <div className="pap-section-icon">🛂</div>
              <div>
                <span>INFORMACIÓN IMPORTANTE</span>
                <h2>Requisitos para tu viaje</h2>
              </div>
            </div>

            <div className="pap-requisitos-grid">
              <article className={`pap-requisito-card ${requisito.requiere_visa ? 'pap-alerta' : 'pap-ok'}`}>
                <div className="pap-requisito-icon">{requisito.requiere_visa ? '⚠️' : '✓'}</div>
                <div className="pap-requisito-content">
                  <span>MIGRACIÓN</span>
                  <h3>{requisito.requiere_visa ? 'Necesitás visa' : 'No necesitás visa'}</h3>
                  {requisito.nombre_permiso && <strong>{requisito.nombre_permiso}</strong>}
                  {requisito.notas && <p>{requisito.notas}</p>}
                </div>
              </article>

              {requisito.vacunas && (
                <article className={`pap-requisito-card ${vacunaObligatoria ? 'pap-alerta' : 'pap-ok'}`}>
                  <div className="pap-requisito-icon">💉</div>
                  <div className="pap-requisito-content">
                    <span>SALUD</span>
                    <h3>{vacunaObligatoria ? 'Vacuna obligatoria' : 'Vacunas'}</h3>
                    <p>{requisito.vacunas}</p>
                  </div>
                </article>
              )}
            </div>
          </section>
        )}

        <section className="pap-section pap-documentos">
          <div className="pap-documentos-heading">
            <div className="pap-section-heading">
              <div className="pap-section-icon">📋</div>
              <div>
                <span>TU CHECKLIST</span>
                <h2>Documentos y trámites</h2>
              </div>
            </div>
            <div className="pap-count-badge">{completados}/{total}</div>
          </div>

          {itemsPapeleo.length === 0 ? (
            <div className="pap-no-documentos">
              <div>📭</div>
              <h3>No hay papeleo registrado</h3>
              <p>Este viaje todavía no tiene documentos asociados.</p>
            </div>
          ) : (
            <div className="pap-lista">
              {itemsPapeleo.map((doc, index) => (
                <article
                  key={doc.id}
                  className={`pap-documento ${doc.hecho ? 'pap-documento-completo' : ''}`}
                  style={{ '--item-delay': `${index * 0.05}s` }}
                >
                  <button className="pap-documento-main" onClick={() => toggleItem(doc.id)}>
                    <div className={`pap-checkbox ${doc.hecho ? 'marcado' : ''}`}>
                      {doc.hecho ? '✓' : ''}
                    </div>

                    <div className="pap-documento-icon">
                      {iconoDocumento(doc.texto)}
                    </div>

                    <div className="pap-documento-texto">
                      <strong>{doc.texto}</strong>
                      <span>{doc.hecho ? 'Documento listo ✓' : 'Pendiente de completar'}</span>
                    </div>

                    <div className="pap-documento-arrow">{doc.hecho ? '✓' : '›'}</div>
                  </button>

                  <div className="pap-nota">
                    <span>✎</span>
                    <input
                      type="text"
                      placeholder="Agregar número, fecha, reserva o una nota..."
                      value={doc.nota || ''}
                      onChange={(e) => actualizarNotaLocal(doc.id, e.target.value)}
                      onBlur={guardarNota}
                    />
                    {guardandoNota && <small>Guardando</small>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="pap-tip">
          <div className="pap-tip-icon">💡</div>
          <div>
            <span>CONSEJO MOVIXA</span>
            <p>Guardá aquí números de reserva, fechas importantes o cualquier detalle que necesites recordar.</p>
          </div>
        </section>

        <section className="pap-final">
          <div className="pap-final-plane">✈</div>
          <div>
            <span>TU AVENTURA CONTINÚA</span>
            <h2>¿Querés revisar todo tu viaje?</h2>
            <p>Consultá el resto de tu checklist y los detalles de {viaje.destino}.</p>
          </div>
          <button onClick={() => irADetalle(viaje.id)}>
            Ver viaje completo <span>→</span>
          </button>
        </section>
      </main>

      <footer className="pap-footer">
        <span>✦</span>
        Prepará tus documentos. Disfrutá el viaje.
        <span>✦</span>
      </footer>
    </div>
  )
}

export default Papeleo
