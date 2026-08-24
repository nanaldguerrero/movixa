import { useState, useEffect } from 'react'
import { useConfiguracion } from './ConfiguracionContext'
import { supabase } from './supabaseClient'
import './Perfil.css'

const climasDisponibles = ['Cálido', 'Frío', 'Templado', 'Nevado', 'Cualquiera']
const tiposDestinoDisponibles = ['Playa', 'Ciudad', 'Naturaleza', 'Montaña', 'Isla']
const interesesCatalogo = ['Gastronomía', 'Fotografía', 'Historia', 'Deportes', 'Compras', 'Vida nocturna', 'Música', 'Arte', 'Animales', 'Bienestar', 'Senderismo', 'Buceo']
const companeros = [
  { id: 'perro', emoji: '🐶' },
  { id: 'gato', emoji: '🐱' },
  { id: 'tortuga', emoji: '🐢' },
  { id: 'ninguno', emoji: '🚫' },
]
const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No sé']

function Perfil({ irADashboard, irAConfiguracion }) {
  const { companero, setCompanero } = useConfiguracion()
  const [editando, setEditando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [userId, setUserId] = useState(null)

  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [nacimiento, setNacimiento] = useState('')
  const [nacionalidad, setNacionalidad] = useState('')

  const [pasaportes, setPasaportes] = useState([])
  const [nuevoPasaporte, setNuevoPasaporte] = useState('')

  const [idiomas, setIdiomas] = useState([])
  const [nuevoIdioma, setNuevoIdioma] = useState('')

  const [climas, setClimas] = useState([])
  const [tiposDestino, setTiposDestino] = useState([])
  const [intereses, setIntereses] = useState([])

  const [viajesRealizados, setViajesRealizados] = useState(0)

  const [contactos, setContactos] = useState([])
  const [nuevoContactoNombre, setNuevoContactoNombre] = useState('')
  const [nuevoContactoTelefono, setNuevoContactoTelefono] = useState('')

  const [moneda, setMoneda] = useState('CRC')
  const [unidadDistancia, setUnidadDistancia] = useState('km')
  const [unidadTemp, setUnidadTemp] = useState('C')

  const [tipoSangre, setTipoSangre] = useState('')
  const [alergias, setAlergias] = useState('')
  const [condicionesMedicas, setCondicionesMedicas] = useState('')
  const [medicamentos, setMedicamentos] = useState('')

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargando(false)
        return
      }
      setUserId(user.id)
      setCorreo(user.email)

      const { data } = await supabase.from('perfiles').select('*').eq('id', user.id).single()

      if (data) {
        setNombre(data.nombre_completo || '')
        setUsuario(data.nombre_usuario || '')
        setCelular(data.celular || '')
        setNacimiento(data.fecha_nacimiento || '')
        setNacionalidad(data.nacionalidad || '')
        setPasaportes(data.pasaportes || [])
        setIdiomas(data.idiomas || [])
        setClimas(data.climas || [])
        setTiposDestino(data.tipos_destino || [])
        setIntereses(data.intereses || [])
        setViajesRealizados(data.viajes_realizados || 0)
        setContactos(data.contactos_emergencia || [])
        setMoneda(data.moneda || 'CRC')
        setUnidadDistancia(data.unidad_distancia || 'km')
        setUnidadTemp(data.unidad_temp || 'C')
        setTipoSangre(data.tipo_sangre || '')
        setAlergias(data.alergias || '')
        setCondicionesMedicas(data.condiciones_medicas || '')
        setMedicamentos(data.medicamentos || '')
        if (data.companero) setCompanero(data.companero)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const guardarEnSupabase = async () => {
    if (!userId) return
    setGuardando(true)

    await supabase.from('perfiles').upsert({
      id: userId,
      nombre_completo: nombre,
      nombre_usuario: usuario,
      correo: correo,
      celular: celular,
      fecha_nacimiento: nacimiento,
      nacionalidad: nacionalidad,
      companero: companero,
      pasaportes: pasaportes,
      idiomas: idiomas,
      climas: climas,
      tipos_destino: tiposDestino,
      intereses: intereses,
      viajes_realizados: viajesRealizados,
      contactos_emergencia: contactos,
      moneda: moneda,
      unidad_distancia: unidadDistancia,
      unidad_temp: unidadTemp,
      tipo_sangre: tipoSangre,
      alergias: alergias,
      condiciones_medicas: condicionesMedicas,
      medicamentos: medicamentos,
    })

    setGuardando(false)
  }

  const toggleEditar = () => {
    if (editando) {
      guardarEnSupabase()
    }
    setEditando(!editando)
  }

  const agregarPasaporte = () => {
    if (nuevoPasaporte.trim() === '') return
    setPasaportes([...pasaportes, nuevoPasaporte])
    setNuevoPasaporte('')
  }

  const agregarIdioma = () => {
    if (nuevoIdioma.trim() === '') return
    setIdiomas([...idiomas, nuevoIdioma])
    setNuevoIdioma('')
  }

  const toggleEnLista = (valor, lista, setLista) => {
    setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor])
  }

  const agregarContacto = () => {
    if (nuevoContactoNombre.trim() === '' || nuevoContactoTelefono.trim() === '') return
    setContactos([...contactos, { id: Date.now(), nombre: nuevoContactoNombre, telefono: nuevoContactoTelefono }])
    setNuevoContactoNombre('')
    setNuevoContactoTelefono('')
  }

  if (cargando) {
    return <div className="perfil"><p style={{ textAlign: 'center', paddingTop: '60px', color: '#888' }}>Cargando perfil...</p></div>
  }

  return (
    <div className="perfil">
      <div className="perfil-header">
        <button className="perfil-volver" onClick={irADashboard}>← Volver</button>
        <div className="perfil-logo">MOVIXA</div>
      </div>

      <div className="perfil-portada">
        <div className="perfil-avatar">{companeros.find((c) => c.id === companero)?.emoji || '🐶'}</div>

        {editando && (
          <div className="perfil-companero-selector">
            {companeros.map((c) => (
              <button
                key={c.id}
                className={`perfil-companero-btn ${companero === c.id ? 'perfil-companero-activo' : ''}`}
                onClick={() => setCompanero(c.id)}
              >
                {c.emoji}
              </button>
            ))}
          </div>
        )}

        {editando ? (
          <input className="perfil-input-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        ) : (
          <h2 className="perfil-nombre">{nombre || 'Sin nombre'}</h2>
        )}
        <p className="perfil-usuario">@{usuario || 'usuario'}</p>
        <button className="perfil-boton-editar" onClick={toggleEditar} disabled={guardando}>
          {guardando ? 'Guardando...' : editando ? '✓ Guardar cambios' : '✏️ Editar perfil'}
        </button>
      </div>

      <div className="perfil-stats">
        <div className="perfil-stat">
          {editando ? (
            <input
              type="number"
              min="0"
              className="perfil-stat-input"
              value={viajesRealizados}
              onChange={(e) => setViajesRealizados(Number(e.target.value))}
            />
          ) : (
            <div className="perfil-stat-num">{viajesRealizados}</div>
          )}
          <div className="perfil-stat-label">Viajes</div>
        </div>
        <div className="perfil-stat">
          <div className="perfil-stat-num">{pasaportes.length}</div>
          <div className="perfil-stat-label">Pasaportes</div>
        </div>
        <div className="perfil-stat">
          <div className="perfil-stat-num">{idiomas.length}</div>
          <div className="perfil-stat-label">Idiomas</div>
        </div>
      </div>

      <div className="perfil-seccion perfil-seccion-morada">
        <h3>Información personal</h3>
        {editando ? (
          <>
            <label className="perfil-campo-label">Nombre de usuario</label>
            <input className="perfil-campo-input" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            <label className="perfil-campo-label">Correo</label>
            <input className="perfil-campo-input" value={correo} disabled />
            <label className="perfil-campo-label">Número de celular</label>
            <input className="perfil-campo-input" value={celular} onChange={(e) => setCelular(e.target.value)} />
            <label className="perfil-campo-label">Fecha de nacimiento</label>
            <input className="perfil-campo-input" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)} />
            <label className="perfil-campo-label">Nacionalidad</label>
            <input className="perfil-campo-input" value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
          </>
        ) : (
          <>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nombre completo</span>
              <span className="perfil-dato-valor">{nombre || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Usuario</span>
              <span className="perfil-dato-valor">@{usuario || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Correo</span>
              <span className="perfil-dato-valor">{correo || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Celular</span>
              <span className="perfil-dato-valor">{celular || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Fecha de nacimiento</span>
              <span className="perfil-dato-valor">{nacimiento || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Nacionalidad</span>
              <span className="perfil-dato-valor">{nacionalidad || '—'}</span>
            </div>
          </>
        )}
      </div>

      <div className="perfil-seccion perfil-seccion-crema">
        <h3>Pasaportes</h3>
        <div className="perfil-chip-lista">
          {pasaportes.length === 0 && !editando && <span className="perfil-vacio">Todavía no agregaste pasaportes</span>}
          {pasaportes.map((p) => (
            <span key={p} className="perfil-chip perfil-chip-crema">
              {p}
              {editando && <span className="perfil-chip-quitar" onClick={() => setPasaportes(pasaportes.filter((x) => x !== p))}>×</span>}
            </span>
          ))}
        </div>
        {editando && (
          <div className="perfil-agregar">
            <input placeholder="Ej: 🇺🇸 Estados Unidos" value={nuevoPasaporte} onChange={(e) => setNuevoPasaporte(e.target.value)} />
            <button onClick={agregarPasaporte}>+</button>
          </div>
        )}
      </div>

      <div className="perfil-seccion perfil-seccion-azul">
        <h3>Idiomas que hablo</h3>
        <div className="perfil-chip-lista">
          {idiomas.map((i) => (
            <span key={i} className="perfil-chip perfil-chip-azul">
              {i}
              {editando && <span className="perfil-chip-quitar" onClick={() => setIdiomas(idiomas.filter((x) => x !== i))}>×</span>}
            </span>
          ))}
        </div>
        {editando && (
          <div className="perfil-agregar">
            <input placeholder="Ej: Portugués" value={nuevoIdioma} onChange={(e) => setNuevoIdioma(e.target.value)} />
            <button onClick={agregarIdioma}>+</button>
          </div>
        )}
      </div>

      <div className="perfil-seccion perfil-seccion-morada">
        <h3>Mis gustos</h3>

        <p className="perfil-gustos-titulo">Clima favorito</p>
        <div className="perfil-chip-lista">
          {climas.length === 0 && !editando && <span className="perfil-vacio">Sin definir todavía</span>}
          {(editando ? climasDisponibles : climas).map((c) => (
            <span
              key={c}
              className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${climas.includes(c) ? 'perfil-chip-activo' : ''} ${!editando ? 'perfil-chip-solo-lectura' : ''}`}
              onClick={() => editando && toggleEnLista(c, climas, setClimas)}
            >
              {c}
            </span>
          ))}
        </div>

        <p className="perfil-gustos-titulo">Tipo de destino</p>
        <div className="perfil-chip-lista">
          {tiposDestino.length === 0 && !editando && <span className="perfil-vacio">Sin definir todavía</span>}
          {(editando ? tiposDestinoDisponibles : tiposDestino).map((t) => (
            <span
              key={t}
              className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${tiposDestino.includes(t) ? 'perfil-chip-activo' : ''} ${!editando ? 'perfil-chip-solo-lectura' : ''}`}
              onClick={() => editando && toggleEnLista(t, tiposDestino, setTiposDestino)}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="perfil-gustos-titulo">Intereses</p>
        <div className="perfil-chip-lista">
          {intereses.length === 0 && !editando && <span className="perfil-vacio">Sin definir todavía</span>}
          {(editando ? interesesCatalogo : intereses).map((i) => (
            <span
              key={i}
              className={`perfil-chip perfil-chip-morada perfil-chip-seleccionable ${intereses.includes(i) ? 'perfil-chip-activo' : ''} ${!editando ? 'perfil-chip-solo-lectura' : ''}`}
              onClick={() => editando && toggleEnLista(i, intereses, setIntereses)}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="perfil-seccion perfil-seccion-rosa">
        <h3>🚑 Información médica de emergencia</h3>
        <p className="perfil-nota-privacidad">Esta información es privada y solo debe usarse en caso de emergencia.</p>

        {editando ? (
          <>
            <label className="perfil-campo-label">Tipo de sangre</label>
            <select className="perfil-campo-input" value={tipoSangre} onChange={(e) => setTipoSangre(e.target.value)}>
              <option value="">Seleccioná una opción</option>
              {tiposSangre.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className="perfil-campo-label">Alergias</label>
            <input className="perfil-campo-input" placeholder="Ej: Penicilina, maní" value={alergias} onChange={(e) => setAlergias(e.target.value)} />

            <label className="perfil-campo-label">Condiciones médicas</label>
            <input className="perfil-campo-input" placeholder="Ej: Asma, diabetes" value={condicionesMedicas} onChange={(e) => setCondicionesMedicas(e.target.value)} />

            <label className="perfil-campo-label">Medicamentos que tomás</label>
            <input className="perfil-campo-input" placeholder="Ej: Ninguno" value={medicamentos} onChange={(e) => setMedicamentos(e.target.value)} />
          </>
        ) : (
          <>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Tipo de sangre</span>
              <span className="perfil-dato-valor">{tipoSangre || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Alergias</span>
              <span className="perfil-dato-valor">{alergias || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Condiciones médicas</span>
              <span className="perfil-dato-valor">{condicionesMedicas || '—'}</span>
            </div>
            <div className="perfil-dato">
              <span className="perfil-dato-label">Medicamentos</span>
              <span className="perfil-dato-valor">{medicamentos || '—'}</span>
            </div>
          </>
        )}
      </div>

      <div className="perfil-seccion perfil-seccion-rosa">
        <h3>Contactos de emergencia</h3>
        {contactos.length === 0 && <p className="perfil-vacio">Todavía no agregaste contactos de emergencia</p>}
        {contactos.map((c) => (
          <div key={c.id} className="perfil-contacto">
            <div>
              <div className="perfil-contacto-nombre">{c.nombre}</div>
              <div className="perfil-contacto-telefono">{c.telefono}</div>
            </div>
            {editando && (
              <span className="perfil-chip-quitar" onClick={() => setContactos(contactos.filter((x) => x.id !== c.id))}>×</span>
            )}
          </div>
        ))}
        {editando && (
          <div className="perfil-agregar-contacto">
            <input placeholder="Nombre" value={nuevoContactoNombre} onChange={(e) => setNuevoContactoNombre(e.target.value)} />
            <input placeholder="Teléfono" value={nuevoContactoTelefono} onChange={(e) => setNuevoContactoTelefono(e.target.value)} />
            <button onClick={agregarContacto}>Agregar contacto</button>
          </div>
        )}
      </div>

      <div className="perfil-seccion perfil-seccion-azul">
        <h3>Preferencias de viaje</h3>
        <label className="perfil-campo-label">Moneda preferida</label>
        <select className="perfil-campo-input" value={moneda} onChange={(e) => setMoneda(e.target.value)}>
          <option value="CRC">₡ Colón costarricense</option>
          <option value="USD">$ Dólar estadounidense</option>
          <option value="EUR">€ Euro</option>
          <option value="MXN">$ Peso mexicano</option>
        </select>

        <label className="perfil-campo-label">Unidad de distancia</label>
        <div className="perfil-toggle-grupo">
          <button className={unidadDistancia === 'km' ? 'perfil-toggle-activo' : ''} onClick={() => setUnidadDistancia('km')}>Kilómetros</button>
          <button className={unidadDistancia === 'mi' ? 'perfil-toggle-activo' : ''} onClick={() => setUnidadDistancia('mi')}>Millas</button>
        </div>

        <label className="perfil-campo-label">Unidad de temperatura</label>
        <div className="perfil-toggle-grupo">
          <button className={unidadTemp === 'C' ? 'perfil-toggle-activo' : ''} onClick={() => setUnidadTemp('C')}>°C</button>
          <button className={unidadTemp === 'F' ? 'perfil-toggle-activo' : ''} onClick={() => setUnidadTemp('F')}>°F</button>
        </div>
      </div>

      <button className="perfil-boton-config" onClick={irAConfiguracion}>
        ⚙️ Ir a Configuración
      </button>
    </div>
  )
}

export default Perfil