// Trazabilidad: Nielsen H1 (Visibilidad del estado), H6 (Reconocer antes que recordar) · Shneiderman S7
// Ruta de navegación (migas de pan) según la sección donde se encuentra el usuario.
export function obtenerRuta(tab, rol) {
  const inicio = { label: 'Inicio', tab: rol === 'Administrador' ? 'dashboard' : 'reservas' };
  const etiquetaReservas =
    rol === 'Solicitante'
      ? 'Mis Reservas'
      : rol === 'Responsable'
      ? 'Reservas Asignadas'
      : 'Listado de Reservas';

  switch (tab) {
    case 'dashboard':
      return [inicio, { label: 'Panel de Control' }];
    case 'reservas':
      return [inicio, { label: etiquetaReservas }];
    case 'nueva-reserva':
      return [inicio, { label: etiquetaReservas, tab: 'reservas' }, { label: 'Nueva Reserva' }];
    case 'ambientes':
      return [inicio, { label: 'Ambientes' }];
    case 'usuarios':
      return [inicio, { label: 'Usuarios' }];
    default:
      return [inicio];
  }
}
