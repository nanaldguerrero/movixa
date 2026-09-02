function PantallaSplash({ idioma, setIdioma, t, onComenzar }) {
  return (
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
      <button className="boton-comenzar" onClick={onComenzar}>{t.boton}</button>
    </div>
  )
}

export default PantallaSplash