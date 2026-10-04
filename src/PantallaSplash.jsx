function PantallaSplash({ idioma, setIdioma, t, onComenzar }) {
  const es = idioma === 'es'

  return (
    <div className="splash">

      {/* =====================================================
          LUZ Y ATMÓSFERA
      ====================================================== */}
      <div className="splash-light light-one" />
      <div className="splash-light light-two" />
      <div className="splash-light light-three" />

      <div className="floating-particle particle-one" />
      <div className="floating-particle particle-two" />
      <div className="floating-particle particle-three" />
      <div className="floating-particle particle-four" />

      {/* =====================================================
          NUBES
      ====================================================== */}
      <div className="cloud cloud-left">
        <svg viewBox="0 0 220 100">
          <path
            d="M18 76
               C10 62 20 46 39 45
               C42 24 61 12 81 20
               C93 3 122 6 131 27
               C153 18 177 31 178 52
               C198 48 211 60 205 76
               Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="cloud cloud-right">
        <svg viewBox="0 0 220 100">
          <path
            d="M18 76
               C10 62 20 46 39 45
               C42 24 61 12 81 20
               C93 3 122 6 131 27
               C153 18 177 31 178 52
               C198 48 211 60 205 76
               Z"
            fill="white"
          />
        </svg>
      </div>

      {/* =====================================================
          SELECTOR IDIOMA
      ====================================================== */}
      <div className="selector-idioma">
        <button
          className={idioma === 'es' ? 'activo' : ''}
          onClick={() => setIdioma('es')}
        >
          ES
        </button>

        <div className="language-divider" />

        <button
          className={idioma === 'en' ? 'activo' : ''}
          onClick={() => setIdioma('en')}
        >
          EN
        </button>
      </div>

      {/* =====================================================
          MAPA DE FONDO
      ====================================================== */}
      <div className="world-map">

        <svg viewBox="0 0 1000 650">

          {/* continentes estilizados */}
          <g className="continent-lines">

            <path d="M90 180 C130 130 190 130 230 165 L215 225 L175 245 L130 220 Z" />
            <path d="M240 280 L275 300 L290 380 L255 450 L225 390 Z" />
            <path d="M400 160 L460 125 L520 155 L545 215 L500 250 L450 230 Z" />
            <path d="M520 270 L575 255 L625 300 L610 390 L555 420 L520 355 Z" />
            <path d="M690 170 L750 150 L820 180 L845 235 L790 260 L720 235 Z" />
            <path d="M790 300 L850 285 L890 335 L855 395 L800 380 Z" />

          </g>

          {/* ruta internacional */}
          <path
            className="map-route"
            d="M195 365
               C290 270 355 300 425 335
               C510 380 570 330 640 260
               C710 190 770 215 825 175"
          />

          {/* puntos */}
          <g className="map-pin start-pin">
            <circle cx="195" cy="365" r="8" />
            <circle cx="195" cy="365" r="17" />
          </g>

          <g className="map-pin destination-pin">
            <circle cx="825" cy="175" r="8" />
            <circle cx="825" cy="175" r="17" />
          </g>

          {/* avión recorriendo el mapa */}
          <g className="map-airplane">

            <path
              d="M-25 0 L18 -5 L30 0 L18 5 Z"
              fill="currentColor"
            />

            <path
              d="M0 -2 L-10 -19 L-4 -20 L10 -3"
              fill="currentColor"
            />

            <path
              d="M0 2 L-10 19 L-4 20 L10 3"
              fill="currentColor"
            />

          </g>

        </svg>

      </div>

      {/* =====================================================
          CONTENIDO
      ====================================================== */}
      <main className="splash-content">

        <div className="brand-small">
          <span />
          TRAVEL • DISCOVER • LIVE
          <span />
        </div>

        <div className="logo-3d">
          MOVIXA
        </div>

        <div className="logo-reflection">
          MOVIXA
        </div>

        <p className="tagline">
          {t.tagline}
        </p>

        <p className="sub-tagline">
          {es
            ? 'Planea · Descubre · Vive'
            : 'Plan · Discover · Live'
          }
        </p>

        {/* =================================================
            COMPOSICIÓN DE VIAJE
        ================================================== */}
        <div className="travel-composition">

          {/* -----------------------------------------------
              PASAPORTE
          ------------------------------------------------ */}
          <div className="passport-object">

            <div className="passport-cover">

              <div className="passport-country">
                REPÚBLICA DE
                <strong>COSTA RICA</strong>
              </div>

              <div className="passport-emblem">

                <svg viewBox="0 0 100 100">

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M20 63
                       C30 45 39 43 50 20
                       C61 43 70 45 80 63"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M25 67 Q50 54 75 67"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <circle
                    cx="50"
                    cy="21"
                    r="3"
                    fill="currentColor"
                  />

                </svg>

              </div>

              <div className="passport-word">
                PASSPORT
              </div>

              <div className="passport-movixa">
                MOVIXA
              </div>

              <div className="passport-globe">

                <svg viewBox="0 0 100 55">

                  <ellipse
                    cx="50"
                    cy="27"
                    rx="38"
                    ry="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  <ellipse
                    cx="50"
                    cy="27"
                    rx="17"
                    ry="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />

                  <path
                    d="M12 27 H88"
                    fill="none"
                    stroke="currentColor"
                  />

                </svg>

              </div>

              <div className="passport-bottom">
                TRAVEL DOCUMENT
              </div>

            </div>

            <div className="passport-pages" />

          </div>


          {/* -----------------------------------------------
              BOARDING PASS
          ------------------------------------------------ */}
          <div className="boarding-ticket">

            <div className="ticket-brand">
              MOVIXA

              <svg viewBox="0 0 60 30">
                <path
                  d="M5 15 H48"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M30 5 L45 15 L30 25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="ticket-route">

              <div>
                <small>FROM</small>
                <strong>CR</strong>
              </div>

              <div className="ticket-plane">
                <svg viewBox="0 0 90 45">

                  <path
                    d="M5 22 H75"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  <path
                    d="M35 20 L22 4"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                  <path
                    d="M35 24 L22 40"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                  <path
                    d="M52 22 L70 12"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                  <path
                    d="M52 22 L70 32"
                    stroke="currentColor"
                    strokeWidth="3"
                  />

                </svg>
              </div>

              <div>
                <small>TO</small>
                <strong>JP</strong>
              </div>

            </div>

            <div className="ticket-details">
              <span>PASSENGER</span>
              <span>FLIGHT</span>
              <span>GATE</span>
            </div>

            <div className="ticket-barcode">
              {Array.from({ length: 24 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>

          </div>


          {/* -----------------------------------------------
              POSTAL MONTAÑA
          ------------------------------------------------ */}
          <div className="mountain-photo">

            <div className="photo-tape" />

            <svg viewBox="0 0 400 280">

              <defs>

                <linearGradient
                  id="mountainSky"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#76c9ff" />
                  <stop offset="50%" stopColor="#bda9ef" />
                  <stop offset="100%" stopColor="#ffd29a" />
                </linearGradient>

                <linearGradient
                  id="mountainLake"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#64b9d3" />
                  <stop offset="100%" stopColor="#416b9b" />
                </linearGradient>

              </defs>

              <rect
                width="400"
                height="280"
                fill="url(#mountainSky)"
              />

              {/* rayos del sol */}
              <g opacity=".25">
                <path d="M200 85 L120 0" stroke="white" strokeWidth="3" />
                <path d="M200 85 L200 0" stroke="white" strokeWidth="3" />
                <path d="M200 85 L290 5" stroke="white" strokeWidth="3" />
              </g>

              {/* sol */}
              <circle
                cx="200"
                cy="105"
                r="31"
                fill="#fff0a9"
              />

              <circle
                cx="200"
                cy="105"
                r="48"
                fill="#fff1b0"
                opacity=".18"
              />

              {/* montañas lejanas */}
              <path
                d="M0 180
                   L60 115
                   L110 160
                   L170 75
                   L225 150
                   L285 90
                   L340 150
                   L400 110
                   V280
                   H0Z"
                fill="#7485b4"
              />

              {/* montañas principales */}
              <path
                d="M0 205
                   L70 115
                   L135 185
                   L200 80
                   L270 185
                   L325 105
                   L400 190
                   V280
                   H0Z"
                fill="#455c82"
              />

              {/* nieve */}
              <path
                d="M200 80
                   L173 122
                   L190 113
                   L200 126
                   L213 109
                   L232 121Z"
                fill="#fff"
                opacity=".85"
              />

              {/* lago */}
              <path
                d="M0 195
                   Q100 175 200 195
                   T400 195
                   V280
                   H0Z"
                fill="url(#mountainLake)"
              />

              {/* reflejo del sol */}
              <path
                d="M180 200
                   Q200 185 220 200
                   L245 280
                   H155Z"
                fill="#ffe7a1"
                opacity=".38"
              />

              {/* árboles */}
              <g fill="#244e4b">

                <path d="M25 220 L47 150 L69 220Z" />
                <path d="M52 220 L76 135 L100 220Z" />
                <path d="M75 220 L96 160 L117 220Z" />

                <path d="M300 220 L325 145 L350 220Z" />
                <path d="M330 220 L355 160 L380 220Z" />

              </g>

              {/* reflejos */}
              <g
                stroke="rgba(255,255,255,.28)"
                strokeWidth="2"
              >
                <path d="M120 220 H175" />
                <path d="M230 230 H300" />
                <path d="M150 242 H250" />
              </g>

            </svg>

            <div className="photo-label">
              COSTA RICA
            </div>

          </div>


          {/* -----------------------------------------------
              POSTAL PLAYA
          ------------------------------------------------ */}
          <div className="beach-photo">

            <svg viewBox="0 0 280 190">

              <defs>
                <linearGradient
                  id="beachSky"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#75d7ff" />
                  <stop offset="100%" stopColor="#ffd8ad" />
                </linearGradient>
              </defs>

              <rect
                width="280"
                height="190"
                fill="url(#beachSky)"
              />

              <circle
                cx="205"
                cy="58"
                r="25"
                fill="#fff1ad"
              />

              <path
                d="M0 105
                   Q55 95 110 105
                   T220 105
                   T280 105
                   V190
                   H0Z"
                fill="#45b8d0"
              />

              <path
                d="M0 145
                   Q70 125 145 145
                   T280 140
                   V190
                   H0Z"
                fill="#e9c58e"
              />

              {/* palmera */}
              <path
                d="M54 145
                   Q67 102 60 62"
                fill="none"
                stroke="#634735"
                strokeWidth="6"
              />

              <path
                d="M61 68
                   Q38 48 28 62
                   Q47 43 60 54
                   Q70 32 83 42
                   Q75 53 66 60
                   Q88 51 97 65
                   Q80 62 66 66"
                fill="#317056"
              />

              {/* olas */}
              <path
                d="M115 128
                   Q138 117 160 128
                   T205 128"
                fill="none"
                stroke="white"
                strokeWidth="3"
              />

              <path
                d="M145 145
                   Q165 137 187 145"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />

            </svg>

            <div className="beach-label">
              WISH YOU WERE HERE
            </div>

          </div>


          {/* -----------------------------------------------
              CÁMARA
          ------------------------------------------------ */}
          <div className="camera-object">

            <div className="camera-body">

              <div className="camera-top">
                <span />
              </div>

              <div className="camera-lens">

                <div className="lens-ring">
                  <div className="lens-glass" />
                </div>

              </div>

              <div className="camera-flash" />

            </div>

            <div className="camera-strap" />

          </div>


          {/* -----------------------------------------------
              BRÚJULA
          ------------------------------------------------ */}
          <div className="compass-object">

            <div className="compass-ring">

              <span className="north">N</span>
              <span className="south">S</span>
              <span className="east">E</span>
              <span className="west">W</span>

              <div className="compass-needle">
                <div />
                <div />
              </div>

              <div className="compass-center" />

            </div>

          </div>


          {/* -----------------------------------------------
              SELLOS
          ------------------------------------------------ */}
          <div className="stamp stamp-adventure">
            <span>A LA</span>
            <strong>AVENTURA</strong>
            <small>TRAVEL</small>
          </div>

          <div className="stamp stamp-story">
            <span>NUEVAS</span>
            <strong>HISTORIAS</strong>
            <small>TE ESPERAN</small>
          </div>

          <div className="stamp stamp-dream">
            <span>A TUS</span>
            <strong>SUEÑOS</strong>
            <small>2026</small>
          </div>


          {/* -----------------------------------------------
              MALETA
          ------------------------------------------------ */}
          <div className="suitcase-object">

            <div className="suitcase-handle" />

            <div className="suitcase-body">

              <div className="suitcase-line line-1" />
              <div className="suitcase-line line-2" />
              <div className="suitcase-line line-3" />

              {/* sticker Costa Rica */}
              <div className="luggage-sticker sticker-cr">
                <span>CR</span>
                <small>COSTA RICA</small>
              </div>

              {/* sticker montaña */}
              <div className="luggage-sticker sticker-mountain">
                <svg viewBox="0 0 50 35">
                  <path
                    d="M3 30 L18 7 L27 19 L34 11 L47 30Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* sticker avión */}
              <div className="luggage-sticker sticker-plane">
                <svg viewBox="0 0 50 35">
                  <path
                    d="M5 18 H40"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M25 17 L15 5"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M25 19 L15 31"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>

              {/* sticker playa */}
              <div className="luggage-sticker sticker-beach">
                <svg viewBox="0 0 50 35">
                  <path
                    d="M5 27 Q25 12 45 27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <circle
                    cx="34"
                    cy="11"
                    r="6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* etiqueta */}
              <div className="luggage-tag">
                MOVIXA
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            CTA
        ================================================== */}
        <button
          className="boton-comenzar"
          onClick={onComenzar}
        >
          <span>{t.boton}</span>

          <svg viewBox="0 0 45 22">

            <path
              d="M2 11 H34"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M27 3 L36 11 L27 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

          </svg>

        </button>

        <div className="splash-footer">
          EVERY JOURNEY STARTS WITH A DREAM
        </div>

      </main>

    </div>
  )
}

export default PantallaSplash