import { createContext, useContext, useState } from 'react'

const ConfiguracionContext = createContext(null)

export function ConfiguracionProvider({ children }) {
  const [tema, setTema] = useState('claro')
  const [tamañoLetra, setTamañoLetra] = useState('normal')
  const [tipoLetra, setTipoLetra] = useState('normal')
  const [idioma, setIdioma] = useState('es')
  const [companero, setCompanero] = useState('perro')

  const valor = {
    tema, setTema,
    tamañoLetra, setTamañoLetra,
    tipoLetra, setTipoLetra,
    idioma, setIdioma,
    companero, setCompanero,
  }

  return (
    <ConfiguracionContext.Provider value={valor}>
      {children}
    </ConfiguracionContext.Provider>
  )
}

export function useConfiguracion() {
  return useContext(ConfiguracionContext)
}