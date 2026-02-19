// Estados CRM con colores
export const CRM_STATES = {
  'Nuevo Lead': { color: 'bg-blue-100 text-blue-800', priority: 1 },
  'En Conversación': { color: 'bg-indigo-100 text-indigo-800', priority: 2 },
  'Precalificado': { color: 'bg-purple-100 text-purple-800', priority: 3 },
  'Descalificado': { color: 'bg-gray-100 text-gray-800', priority: 99 },
  'Link Enviado': { color: 'bg-cyan-100 text-cyan-800', priority: 4 },
  'Agendado': { color: 'bg-teal-100 text-teal-800', priority: 5 },
  'Asistió': { color: 'bg-green-100 text-green-800', priority: 6 },
  'No Asistió': { color: 'bg-orange-100 text-orange-800', priority: 98 },
  'Compró': { color: 'bg-emerald-100 text-emerald-800', priority: 7 },
  'No Compró': { color: 'bg-red-100 text-red-800', priority: 97 },
  'Cliente Activo': { color: 'bg-green-200 text-green-900', priority: 8 },
  'Plan Terminado': { color: 'bg-slate-100 text-slate-800', priority: 9 },
  'Recompró': { color: 'bg-emerald-200 text-emerald-900', priority: 10 },
  'Canceló Cita': { color: 'bg-amber-100 text-amber-800', priority: 96 },
  'Requiere Humano': { color: 'bg-red-200 text-red-900', priority: 0 },
};

// Estados de agendamiento
export const SCHEDULING_STATES = {
  'Pendiente': { color: 'bg-yellow-100 text-yellow-800' },
  'Agendado': { color: 'bg-blue-100 text-blue-800' },
  'Reprogramado': { color: 'bg-orange-100 text-orange-800' },
  'Confirmado': { color: 'bg-green-100 text-green-800' },
  'Cancelado': { color: 'bg-red-100 text-red-800' },
};

// Orden del funnel de conversión (sin "Nuevo Lead" porque pasan inmediatamente a "En Conversación")
export const FUNNEL_ORDER = [
  'En Conversación',
  'Precalificado',
  'Link Enviado',
  'Agendado',
  'Asistió',
  'Compró',
];

// Colores del tema
export const COLORS = {
  primary: '#2E7D32',
  secondary: '#1565C0',
  success: '#4CAF50',
  warning: '#F57C00',
  error: '#D32F2F',
  background: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
};

// Colores para gráficos
export const CHART_COLORS = [
  '#2E7D32', // primary green
  '#1565C0', // secondary blue
  '#7B1FA2', // purple
  '#C62828', // red
  '#EF6C00', // orange
  '#00838F', // cyan
  '#558B2F', // light green
  '#4527A0', // deep purple
  '#AD1457', // pink
  '#00695C', // teal
];

// Opciones de filtro de fecha
export const DATE_FILTERS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'custom', label: 'Personalizado' },
];

// Opciones de paginación
export const PAGE_SIZES = [10, 25, 50];

// Zona horaria
export const TIMEZONE = 'America/Lima';

// Campos de la API
export const LEAD_FIELDS = {
  // Identificación
  id: 'Id',
  createdAt: 'CreatedAt',
  nombre: 'Nombre',
  phone: 'Phone',
  email: 'Email',
  contactId: 'Contact ID',

  // Estados
  estadoCRM: 'Estado CRM',
  estadoAgendamiento: 'Estado Agendamiento',
  calificado: '¿Calificado?',

  // Ubicación
  distritoResidencia: 'Distrito Residencia',
  distritoTrabajo: 'Distrito Trabajo',
  distritoCalificar: 'Distrito Usado Para Calificar',

  // Citas
  fechaAgendamiento: 'Fecha de agendamiento',
  horaCita: 'Hora Cita',
  confirmoCita: 'Confirmo Cita',
  recordatorio24h: 'Recordatorio 24h Enviado',
  recordatorio4h: 'Recordatorio 4h Enviado',

  // Historial
  noShows: 'N° No-Shows',
  cancelaciones: 'N° Cancelaciones',
  reprogramaciones: 'N° Reprogramaciones',
  usoDiagnosticoGratis: 'Ya Usó Diagnóstico Gratis',
  requiereRevision: 'Requiere revisión manual',

  // Ventas
  montoVenta: 'Monto Venta Cerrada',
  planAdquirido: 'Plan Adquirido',

  // Seguimiento
  intentosSeguimiento: 'Intentos seguimiento',
  fechaRetargeting: 'Fecha de último retargeting',
  origenLead: 'Origen del Lead',

  // Razones
  razonCalificacion: 'Razón Calificación',
  razonDescalificacion: 'Razón Descalificación',

  // Fechas
  fechaCreacionLead: 'Fecha de creacion del lead',
  ultimaModificacion: 'Última Modificación',
};
