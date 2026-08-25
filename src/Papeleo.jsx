import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './Papeleo.css'

const documentosIniciales = [
  { id: 1, texto: 'Pasaporte vigente', hecho: false },
  { id: 2, texto: 'Visa (si aplica)', hecho: false },
  { id: 3, texto: 'Vacunas requeridas', hecho: false },
  { id: 4, texto: 'Seguro de viaje', hecho: false },
  { id: 5, texto: 'Reserva de hotel', hecho: false },
  { id: 6, texto: 'Pasaje de regreso', hecho: false },
]

function Papeleo({ irADashboard }) {
  const [documentos, setDocumentos] = useState(documentosIniciales)
  const [userId, setUserId] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }
      setUserId(user.id)

      const { data } = await supabase.from('perfiles').select('papeleo').eq('id', user.id).single()

      if (data && data.papeleo) {
        setDocumentos(data.papeleo)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const guardar = async (nuevosDocumentos) => {
    if (!userId) return
    await supabase.from('perfiles').upsert({ id: userId, papeleo: nuevosDocumentos })
  }

  const toggleDocumento = (id) => {
    const nuevo = documentos.map((doc) =>
      doc.id === id ? { ...doc, hecho: !doc.hecho } : doc
    )
    setDocumentos(nuevo)
    guardar(nuevo)
  }

  const completados = documentos.filter((d) => d.hecho).length

  if (cargando) {
    return <div className="papeleo"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando papeleo...</p></div>
  }

  return (
    <div className="papeleo">
      <div className="pap-header">
        <button className="pap-volver" onClick={irADashboard}>← Volver</button>
        <div className="pap-logo">MOVIXA</div>
      </div>

      <h2 className="pap-titulo">📋 Papeleo</h2>
      <p className="pap-progreso">{completados} de {documentos.length} completados</p>

      <div className="pap-info-destino">
        <div className="pap-info-item">
          <span className="pap-info-icono">🌤️</span>
          <span>Clima: templado</span>
        </div>
        <div className="pap-info-item">
          <span className="pap-info-icono">💱</span>
          <span>Moneda: local</span>
        </div>
        <div className="pap-info-item">
          <span className="pap-info-icono">🗣️</span>
          <span>Idioma: local</span>
        </div>
      </div>

      <div className="pap-lista">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className={`pap-item ${doc.hecho ? 'pap-item-hecho' : ''}`}
            onClick={() => toggleDocumento(doc.id)}
          >
            <div className={`pap-checkbox ${doc.hecho ? 'pap-checkbox-marcado' : ''}`}>
              {doc.hecho && '✓'}
            </div>
            <span>{doc.texto}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Papeleo