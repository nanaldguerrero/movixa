import { createContext, useContext, useEffect, useState } from 'react'

const ConfiguracionContext = createContext(null)

export function ConfiguracionProvider({ children }) {
  const [tema, setTema] = useState(
    localStorage.getItem('movixa-tema') || 'claro'
  )

  const [tamañoLetra, setTamañoLetra] = useState(
    localStorage.getItem('movixa-tamaño') || 'normal'
  )

  const [tipoLetra, setTipoLetra] = useState(
    localStorage.getItem('movixa-tipo-letra') || 'normal'
  )

  const [idioma, setIdioma] = useState(
    localStorage.getItem('movixa-idioma') || 'es'
  )

  const [companero, setCompanero] = useState(
    localStorage.getItem('movixa-companero') || 'ninguno'
  )

  // Guardar tema
  useEffect(() => {
    localStorage.setItem('movixa-tema', tema)
  }, [tema])

  // Guardar tamaño de letra
  useEffect(() => {
    localStorage.setItem('movixa-tamaño', tamañoLetra)
  }, [tamañoLetra])

  // Guardar tipo de letra
  useEffect(() => {
    localStorage.setItem('movixa-tipo-letra', tipoLetra)
  }, [tipoLetra])

  // Guardar idioma
  useEffect(() => {
    localStorage.setItem('movixa-idioma', idioma)
  }, [idioma])

  // Guardar compañero
  useEffect(() => {
    localStorage.setItem('movixa-companero', companero)
  }, [companero])

  // Aplicar configuraciones a toda la aplicación
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.setAttribute('data-tema', tema)
    body.setAttribute('data-tema', tema)

    html.setAttribute('data-tamaño', tamañoLetra)
    body.setAttribute('data-tamaño', tamañoLetra)

    html.setAttribute('data-tipo-letra', tipoLetra)
    body.setAttribute('data-tipo-letra', tipoLetra)
  }, [tema, tamañoLetra, tipoLetra])

  return (
    <ConfiguracionContext.Provider
      value={{
        tema,
        setTema,

        tamañoLetra,
        setTamañoLetra,

        tipoLetra,
        setTipoLetra,

        idioma,
        setIdioma,

        companero,
        setCompanero,
      }}
    >
      {children}
    </ConfiguracionContext.Provider>
  )
}

export function useConfiguracion() {
  const context = useContext(ConfiguracionContext)

  if (!context) {
    throw new Error(
      'useConfiguracion debe utilizarse dentro de ConfiguracionProvider'
    )
  }

  return context
}