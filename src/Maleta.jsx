import { useState } from 'react'
import './Maleta.css'

const categorias = [
  {
    nombre: 'Ropa',
    icono: '👕',
    items: [
      { id: 1, texto: 'Camisetas', hecho: false },
      { id: 2, texto: 'Pantalones', hecho: false },
      { id: 3, texto: 'Ropa interior', hecho: false },
      { id: 4, texto: 'Zapatos cómodos', hecho: false },
    ],
  },
  {
    nombre: 'Higiene',
    icono: '🧴',
    items: [
      { id: 5, texto: 'Cepillo de dientes', hecho: false },
      { id: 6, texto: 'Shampoo', hecho: false },
      { id: 7, texto: 'Protector solar', hecho: false },
    ],
  },
  {
    nombre: 'Electrónica',
    icono: '🔌',
    items: [
      { id: 8, texto: 'Cargador', hecho: false },
      { id: 9, texto: 'Adaptador de enchufe', hecho: false },
      { id: 10, texto: 'Power bank', hecho: false },
    ],
  },
]

function Maleta({ irADashboard }) {
  const [datos, setDatos] = useState(categorias)

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
                onClick={() => toggleItem(catIndex, item.id)}
              >
                <div className={`mal-checkbox ${item.hecho ? 'mal-checkbox-marcado' : ''}`}>
                  {item.hecho && '✓'}
                </div>
                <span>{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Maleta