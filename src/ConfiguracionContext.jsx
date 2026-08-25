import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const ConfiguracionContext = createContext(null)

export function ConfiguracionProvider({ children }) {
  const [tema, setTemaState] = useState('claro')
  const [tamañoLetra, setTamañoLetraState] = useState('normal')
  const [tipoLetra, setTipoLetraState] = useState('normal')
  const [idioma, setIdiomaState] = useState('es')
  const [companero, setCompaneroState] = useState('perro')

  const [userId, setUserId] = useState(null)
  const [cargado, setCargado] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCargado(true)
        return
      }
      setUserId(user.id)

      const { data } = await supabase
        .from('perfiles')
        .select('tema, tamano_letra, tipo_letra, idioma_app, companero')
        .eq('id', user.id)
        .single()

      if (data) {
        if (data.tema) setTemaState(data.tema)
        if (data.tamano_letra) setTamañoLetraState(data.tamano_letra)
        if (data.tipo_letra) setTipoLetraState(data.tipo_letra)
        if (data.idioma_app) setIdiomaState(data.idioma_app)
        if (data.companero) setCompaneroState(data.companero)
      }
      setCargado(true)
    }
    cargar()
  }, [])

  const guardarCampo = async (campo, valor) => {
    if (!userId) return
    await supabase.from('perfiles').upsert({ id: userId, [campo]: valor })
  }

  const setTema = (valor) => {
    setTemaState(valor)
    guardarCampo('tema', valor)
  }

  const setTamañoLetra = (valor) => {
    setTamañoLetraState(valor)
    guardarCampo('tamano_letra', valor)
  }

  const setTipoLetra = (valor) => {
    setTipoLetraState(valor)
    guardarCampo('tipo_letra', valor)
  }

  const setIdioma = (valor) => {
    setIdiomaState(valor)
    guardarCampo('idioma_app', valor)
  }

  const setCompanero = (valor) => {
    setCompaneroState(valor)
    guardarCampo('companero', valor)
  }

  const valor = {
    tema, setTema,
    tamañoLetra, setTamañoLetra,
    tipoLetra, setTipoLetra,
    idioma, setIdioma,
    companero, setCompanero,
  }

  if (!cargado) return null

  return (
    <ConfiguracionContext.Provider value={valor}>
      {children}
    </ConfiguracionContext.Provider>
  )
}

export function useConfiguracion() {
  return useContext(ConfiguracionContext)
}