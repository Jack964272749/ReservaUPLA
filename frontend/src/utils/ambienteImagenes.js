// Trazabilidad: Nielsen H2 (Mundo real), H8 (Estética y minimalismo) · Catálogo visual de ambientes UPLA
export const IMAGENES_AMBIENTES = {
  'Auditorio Central Magno': '/ambientes/auditorio_central_magno.jpg',
  'Aula Magna de Medicina': '/ambientes/aula_magna_medicina.jpg',
  'Laboratorio de Computo 101': '/ambientes/lab_computo_101.jpg',
  'Laboratorio de Redes Cisco': '/ambientes/lab_redes_cisco.jpg',
  'Laboratorio de Robotica e IA': '/ambientes/lab_robotica_ia.jpg',
  'Sala de Grados y Titulos': '/ambientes/sala_grados_titulos.jpg',
  'Sala de Reuniones de Facultad': '/ambientes/sala_reuniones_facultad.jpg',
  'Taller de Prototipado y Realidad Virtual': '/ambientes/taller_prototipado_vr.jpg',
};

export const IMAGENES_POR_TIPO = {
  Auditorio: '/ambientes/auditorio_central_magno.jpg',
  LaboratorioComputo: '/ambientes/lab_computo_101.jpg',
  LaboratorioEspecializado: '/ambientes/lab_robotica_ia.jpg',
  SalaReuniones: '/ambientes/sala_reuniones_facultad.jpg',
};

export function obtenerImagenAmbiente(nombre, tipo) {
  if (nombre && IMAGENES_AMBIENTES[nombre]) {
    return IMAGENES_AMBIENTES[nombre];
  }
  if (tipo && IMAGENES_POR_TIPO[tipo]) {
    return IMAGENES_POR_TIPO[tipo];
  }
  return '/backgrounds/bg_ambientes.jpg';
}
