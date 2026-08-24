import { useState } from 'react'
import './Maleta.css'

const categoriasIniciales = [
  {
    nombre: 'Ropa',
    icono: '👕',
    items: [
      { id: 1, texto: 'Camisetas', hecho: false, cantidad: 4 },
      { id: 2, texto: 'Pantalones', hecho: false, cantidad: 2 },
      { id: 3, texto: 'Ropa interior', hecho: false, cantidad: 5 },
      { id: 4, texto: 'Medias / calcetines', hecho: false, cantidad: 5 },
      { id: 5, texto: 'Pijama', hecho: false, cantidad: 1 },
      { id: 6, texto: 'Zapatos cómodos', hecho: false, cantidad: 1 },
      { id: 7, texto: 'Chaqueta / abrigo', hecho: false, cantidad: 1 },
      { id: 8, texto: 'Traje de baño', hecho: false, cantidad: 1 },
    ],
  },
  {
    nombre: 'Higiene',
    icono: '🧴',
    items: [
      { id: 9, texto: 'Cepillo de dientes', hecho: false },
      { id: 10, texto: 'Pasta dental', hecho: false },
      { id: 11, texto: 'Shampoo', hecho: false },
      { id: 12, texto: 'Jabón / gel de baño', hecho: false },
      { id: 13, texto: 'Desodorante', hecho: false },
      { id: 14, texto: 'Protector solar', hecho: false },
      { id: 15, texto: 'Cepillo de pelo', hecho: false },
    ],
  },
  {
    nombre: 'Cuidado personal',
    icono: '💇',
    items: [
      { id: 16, texto: 'Secador de pelo', hecho: false },
      { id: 17, texto: 'Plancha o tenazas de pelo', hecho: false },
      { id: 18, texto: 'Maquillaje', hecho: false },
      { id: 19, texto: 'Espejo de bolsillo', hecho: false },
      { id: 20, texto: 'Cortaúñas', hecho: false },
      { id: 21, texto: 'Perfume', hecho: false },
    ],
  },
  {
    nombre: 'Electrónica',
    icono: '🔌',
    items: [
      { id: 22, texto: 'Cargador', hecho: false },
      { id: 23, texto: 'Adaptador de enchufe', hecho: false },
      { id: 24, texto: 'Power bank', hecho: false },
      { id: 25, texto: 'Audífonos', hecho: false },
    ],
  },
]

function Maleta({ irADashboard }) {
  const [datos, setDatos] = useState(categoriasIniciales)

  const toggleItem = (catIndex, id) => {
    const nuevo = [...datos]
    nuevo[catIndex] = {
      ...nuevo[catIndex],
      items: nuevo[catIndex].items.map((item) =>
        item.id === id ? { ...item, hecho: !item.hecho } : item
      ),
    }
    setDatos(nuevo)
  }

  const cambiarCantidad = (catIndex, id, valor) => {
    const nuevo = [...datos]
    nuevo[catIndex] = {
      ...nuevo[catIndex],
      items: nuevo[catIndex].items.map((item) =>
        item.id === id ? { ...item, cantidad: Math.max(0, valor) } : item
      ),
    }
    setDatos(nuevo)
  }

  const totalItems = datos.reduce((acc, cat) => acc + cat.items.length, 0)
  const totalHechos = datos.reduce((acc, cat) => acc + cat.items.filter((i) => i.hecho).length, 0)

  return (
    <div className="maleta">
      <div className="mal-header">
        <button className="mal-volver" onClick={irADashboard}>← Volver</button>
        <div className="mal-logo">MOVIXA</div>
      </div>

      <h2 className="mal-titulo">🧳 Maleta</h2>
      <p className="mal-progreso">{totalHechos} de {totalItems} empacados</p>

      {datos.map((categoria, catIndex) => (
        <div key={categoria.nombre} className="mal-categoria">
          <h3 className="mal-categoria-titulo">{categoria.icono} {categoria.nombre}</h3>
          <div className="mal-lista">
            {categoria.items.map((item) => (
              <div
                key={item.id}
                className={`mal-item ${item.hecho ? 'mal-item-hecho' : ''}`}
              >
                <div className="mal-item-izquierda" onClick={() => toggleItem(catIndex, item.id)}>
                  <div className={`mal-checkbox ${item.hecho ? 'mal-checkbox-marcado' : ''}`}>
                    {item.hecho && '✓'}
                  </div>
                  <span>{item.texto}</span>
                </div>

                {item.cantidad !== undefined && (
                  <div className="mal-cantidad">
                    <button onClick={() => cambiarCantidad(catIndex, item.id, item.cantidad - 1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(catIndex, item.id, item.cantidad + 1)}>+</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Maleta