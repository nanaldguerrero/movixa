export const mapaNacionalidad = {
  'Costa Rica': 'Costarricense',
  'Canadá': 'Canadiense',
  'Estados Unidos': 'Estadounidense',
  'México': 'Mexicano',
  'España': 'Español',
  'Panamá': 'Panameño',
}

export function nacionalidadDesde(pasaporte, nacionalidadPerfil) {
  if (pasaporte) {
    const nombrePais = pasaporte.replace(/^\S+\s/, '').trim()
    return mapaNacionalidad[nombrePais] || nombrePais
  }
  return nacionalidadPerfil || 'Costarricense'
}

export function requisitosCambiaron(anterior, actual) {
  if (!anterior || !actual) return false
  return (
    anterior.requiere_visa !== actual.requiere_visa ||
    anterior.vacunas !== actual.vacunas ||
    anterior.notas !== actual.notas ||
    anterior.dias_permitidos !== actual.dias_permitidos
  )
}