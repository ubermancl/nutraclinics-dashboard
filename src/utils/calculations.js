import { parseISO, isValid, differenceInDays, differenceInHours, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths, isWithinInterval } from 'date-fns';
import { FUNNEL_ORDER, CRM_STATES } from './constants';

/**
 * Filtrar leads por rango de fecha
 */
export function filterByDateRange(leads, dateField, startDate, endDate) {
  if (!leads || !Array.isArray(leads)) return [];
  if (!startDate || !endDate) return leads;

  return leads.filter(lead => {
    const dateValue = lead[dateField];
    if (!dateValue) return false;

    try {
      const date = parseISO(dateValue);
      if (!isValid(date)) return false;

      return isWithinInterval(date, { start: startDate, end: endDate });
    } catch {
      return false;
    }
  });
}

/**
 * Obtener rango de fechas según filtro
 */
export function getDateRange(filter, customStart = null, customEnd = null) {
  const now = new Date();

  switch (filter) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'custom':
      return {
        start: customStart ? startOfDay(customStart) : startOfMonth(now),
        end: customEnd ? endOfDay(customEnd) : endOfDay(now)
      };
    default:
      return { start: startOfMonth(now), end: endOfDay(now) };
  }
}

/**
 * Obtener período anterior para comparación
 */
export function getPreviousPeriod(filter, customStart = null, customEnd = null) {
  const now = new Date();

  switch (filter) {
    case 'today':
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    case 'week':
      const lastWeekStart = subWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1);
      return { start: lastWeekStart, end: endOfWeek(lastWeekStart, { weekStartsOn: 1 }) };
    case 'month':
      const lastMonthStart = subMonths(startOfMonth(now), 1);
      return { start: lastMonthStart, end: endOfMonth(lastMonthStart) };
    case 'custom':
      if (customStart && customEnd) {
        const days = differenceInDays(customEnd, customStart);
        return {
          start: subDays(customStart, days + 1),
          end: subDays(customStart, 1)
        };
      }
      return getPreviousPeriod('month');
    default:
      return getPreviousPeriod('month');
  }
}

/**
 * Calcular métricas principales
 */
export function calculateMetrics(leads, dateFilter = 'month', customStart = null, customEnd = null) {
  if (!leads || !Array.isArray(leads)) {
    return {
      totalLeads: 0,
      newLeads: 0,
      inConversacion: 0,
      scheduled: 0,
      conversionRate: 0,
      revenue: 0,
      requiresAttention: 0,
      changes: {}
    };
  }

  const { start, end } = getDateRange(dateFilter, customStart, customEnd);
  const { start: prevStart, end: prevEnd } = getPreviousPeriod(dateFilter, customStart, customEnd);

  // Leads del período actual
  const currentLeads = filterByDateRange(leads, 'CreatedAt', start, end);
  const previousLeads = filterByDateRange(leads, 'CreatedAt', prevStart, prevEnd);

  // Métricas actuales
  const totalLeads = leads.length;
  const newLeads = currentLeads.length;
  const inConversacion = leads.filter(l => l['Estado CRM'] === 'En Conversación').length;
  const scheduled = currentLeads.filter(l => l['Estado CRM'] === 'Agendado' || l['Fecha de agendamiento']).length;
  const purchased = currentLeads.filter(l => l['Estado CRM'] === 'Compró').length;
  const conversionRate = newLeads > 0 ? purchased / newLeads : 0;
  const revenue = currentLeads.reduce((sum, l) => sum + (parseFloat(l['Monto Venta Cerrada (PEN)']) || 0), 0);
  const requiresAttention = leads.filter(l => l['Estado CRM'] === 'Requiere Humano' || l['Requiere revisión manual']).length;

  // Métricas anteriores para comparación
  const prevNewLeads = previousLeads.length;
  const prevScheduled = previousLeads.filter(l => l['Estado CRM'] === 'Agendado' || l['Fecha de agendamiento']).length;
  const prevPurchased = previousLeads.filter(l => l['Estado CRM'] === 'Compró').length;
  const prevConversionRate = prevNewLeads > 0 ? prevPurchased / prevNewLeads : 0;
  const prevRevenue = previousLeads.reduce((sum, l) => sum + (parseFloat(l['Monto Venta Cerrada (PEN)']) || 0), 0);

  // Calcular cambios
  const changes = {
    newLeads: prevNewLeads > 0 ? (newLeads - prevNewLeads) / prevNewLeads : null,
    scheduled: prevScheduled > 0 ? (scheduled - prevScheduled) / prevScheduled : null,
    conversionRate: prevConversionRate > 0 ? (conversionRate - prevConversionRate) / prevConversionRate : null,
    revenue: prevRevenue > 0 ? (revenue - prevRevenue) / prevRevenue : null,
  };

  return {
    totalLeads,
    newLeads,
    inConversacion,
    scheduled,
    conversionRate,
    revenue,
    requiresAttention,
    changes
  };
}

/**
 * Calcular datos del funnel (acumulativo - cuenta los que llegaron a cada etapa o la pasaron)
 */
export function calculateFunnel(leads) {
  if (!leads || !Array.isArray(leads)) return [];

  // Estados que indican que el lead llegó a cada etapa del funnel
  const stageReached = {
    'En Conversación': ['En Conversación', 'Precalificado', 'Descalificado', 'Link Enviado', 'Agendado', 'Asistió', 'No Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró', 'Canceló Cita', 'Requiere Humano'],
    'Precalificado': ['Precalificado', 'Link Enviado', 'Agendado', 'Asistió', 'No Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró', 'Canceló Cita'],
    'Link Enviado': ['Link Enviado', 'Agendado', 'Asistió', 'No Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró', 'Canceló Cita'],
    'Agendado': ['Agendado', 'Asistió', 'No Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró', 'Canceló Cita'],
    'Asistió': ['Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró'],
    'Compró': ['Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró'],
  };

  // Contar leads que llegaron a cada etapa
  const counts = {};
  FUNNEL_ORDER.forEach(stage => {
    const validStates = stageReached[stage] || [stage];
    counts[stage] = leads.filter(lead => validStates.includes(lead['Estado CRM'])).length;
  });

  const totalLeads = leads.length;

  // Etiquetas para indicadores de fuga entre etapas
  const leakedLabels = {
    'Total Leads':     'sin conversación',
    'En Conversación': 'sin calificar',
    'Precalificado':   'sin link enviado',
    'Link Enviado':    'sin agendar',
    'Agendado':        'no asistieron',
    'Asistió':         'no compraron',
  };

  const funnelSteps = FUNNEL_ORDER.map((state, index) => {
    const count = counts[state];
    const percentOfTotal = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    const previousCount = index > 0 ? counts[FUNNEL_ORDER[index - 1]] : totalLeads;
    const conversionFromPrevious = previousCount > 0
      ? (count / previousCount) * 100
      : 100;

    // Cuántos no avanzaron a la siguiente etapa
    const nextCount = index < FUNNEL_ORDER.length - 1 ? counts[FUNNEL_ORDER[index + 1]] : count;
    const leaked = Math.max(0, count - nextCount);

    return {
      state,
      count,
      percentOfTotal,
      conversionFromPrevious,
      leaked,
      leakedLabel: leakedLabels[state] || '',
    };
  });

  const totalLeaked = Math.max(0, totalLeads - (counts[FUNNEL_ORDER[0]] || 0));

  return [
    {
      state: 'Total Leads',
      count: totalLeads,
      percentOfTotal: 100,
      conversionFromPrevious: 100,
      leaked: totalLeaked,
      leakedLabel: leakedLabels['Total Leads'],
    },
    ...funnelSteps,
  ];
}

/**
 * Calcular distribución por campo
 */
export function calculateDistribution(leads, field) {
  if (!leads || !Array.isArray(leads)) return [];

  const counts = {};
  leads.forEach(lead => {
    const value = lead[field] || 'Sin especificar';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calcular leads por día para gráfico de tendencias
 */
export function calculateLeadsByDay(leads, days = 30) {
  if (!leads || !Array.isArray(leads)) return [];

  const result = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const start = startOfDay(date);
    const end = endOfDay(date);

    const count = leads.filter(lead => {
      try {
        const createdAt = parseISO(lead['CreatedAt']);
        return isValid(createdAt) && isWithinInterval(createdAt, { start, end });
      } catch {
        return false;
      }
    }).length;

    result.push({
      date: date.toISOString().split('T')[0],
      leads: count
    });
  }

  return result;
}

/**
 * Calcular métricas avanzadas
 */
export function calculateAdvancedMetrics(leads) {
  if (!leads || !Array.isArray(leads)) {
    return {
      avgTimeToSchedule: null,
      noShowRate: 0,
      closeRate: 0,
      avgTicket: 0,
      bestDistrict: null,
      bestDay: null,
      peakHour: null
    };
  }

  // Tiempo promedio Lead -> Agendado
  const scheduledLeads = leads.filter(l => l['Fecha de agendamiento'] && l['CreatedAt']);
  let totalDays = 0;
  scheduledLeads.forEach(lead => {
    try {
      const created = parseISO(lead['CreatedAt']);
      const scheduled = parseISO(lead['Fecha de agendamiento']);
      if (isValid(created) && isValid(scheduled)) {
        totalDays += differenceInDays(scheduled, created);
      }
    } catch { }
  });
  const avgTimeToSchedule = scheduledLeads.length > 0 ? totalDays / scheduledLeads.length : null;

  // Tasa de No-Show (considera que quienes compraron también asistieron)
  const attendedStates = ['Asistió', 'Compró', 'No Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró'];
  const attended = leads.filter(l => attendedStates.includes(l['Estado CRM'])).length;
  const noShow = leads.filter(l => l['Estado CRM'] === 'No Asistió').length;
  const totalAppointments = attended + noShow;
  const noShowRate = totalAppointments > 0 ? noShow / totalAppointments : 0;

  // Tasa de Cierre (Compró / Asistió)
  const purchasedStates = ['Compró', 'Cliente Activo', 'Plan Terminado', 'Recompró'];
  const purchased = leads.filter(l => purchasedStates.includes(l['Estado CRM'])).length;
  const closeRate = attended > 0 ? purchased / attended : 0;

  // Ticket Promedio
  const salesLeads = leads.filter(l => l['Monto Venta Cerrada (PEN)'] && parseFloat(l['Monto Venta Cerrada (PEN)']) > 0);
  const totalSales = salesLeads.reduce((sum, l) => sum + parseFloat(l['Monto Venta Cerrada (PEN)']), 0);
  const avgTicket = salesLeads.length > 0 ? totalSales / salesLeads.length : 0;

  // Mejor distrito (más conversiones)
  const districtConversions = {};
  leads.filter(l => l['Estado CRM'] === 'Compró').forEach(lead => {
    const district = lead['Distrito Usado Para Calificar'] || lead['Distrito Residencia'] || 'Desconocido';
    districtConversions[district] = (districtConversions[district] || 0) + 1;
  });
  const bestDistrict = Object.entries(districtConversions)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Mejor día
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayCounts = {};
  leads.forEach(lead => {
    try {
      const date = parseISO(lead['CreatedAt']);
      if (isValid(date)) {
        const day = dayNames[date.getDay()];
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    } catch { }
  });
  const bestDay = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Hora pico
  const hourCounts = {};
  leads.forEach(lead => {
    try {
      const date = parseISO(lead['CreatedAt']);
      if (isValid(date)) {
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    } catch { }
  });
  const peakHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    avgTimeToSchedule,
    noShowRate,
    closeRate,
    avgTicket,
    bestDistrict,
    bestDay,
    peakHour: peakHour !== null ? `${peakHour}:00` : null
  };
}

/**
 * Generar alertas
 */
export function generateAlerts(leads) {
  if (!leads || !Array.isArray(leads)) return [];

  const alerts = [];
  const now = new Date();

  // Leads en "Requiere Humano"
  const requiresHuman = leads.filter(l => l['Estado CRM'] === 'Requiere Humano');
  if (requiresHuman.length > 0) {
    alerts.push({
      type: 'error',
      icon: '🔴',
      message: `${requiresHuman.length} lead${requiresHuman.length > 1 ? 's' : ''} en "Requiere Humano" - Responder urgente`,
      count: requiresHuman.length
    });
  }

  // Citas hoy sin confirmar
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const unconfirmedToday = leads.filter(lead => {
    try {
      const appointmentDate = lead['Fecha de agendamiento'];
      if (!appointmentDate) return false;
      const date = parseISO(appointmentDate);
      return isValid(date) &&
        isWithinInterval(date, { start: todayStart, end: todayEnd }) &&
        !lead['Confirmo Cita'];
    } catch {
      return false;
    }
  });
  if (unconfirmedToday.length > 0) {
    alerts.push({
      type: 'warning',
      icon: '🟡',
      message: `${unconfirmedToday.length} cita${unconfirmedToday.length > 1 ? 's' : ''} hoy sin confirmar`,
      count: unconfirmedToday.length
    });
  }

  // Links enviados hace >48h sin agendar
  const linkSentNoSchedule = leads.filter(lead => {
    if (lead['Estado CRM'] !== 'Link Enviado') return false;
    try {
      const modified = parseISO(lead['Última Modificación'] || lead['CreatedAt']);
      if (!isValid(modified)) return false;
      return differenceInHours(now, modified) > 48;
    } catch {
      return false;
    }
  });
  if (linkSentNoSchedule.length > 0) {
    alerts.push({
      type: 'warning',
      icon: '🟡',
      message: `${linkSentNoSchedule.length} lead${linkSentNoSchedule.length > 1 ? 's' : ''} con link hace >48h sin agendar`,
      count: linkSentNoSchedule.length
    });
  }

  // En conversación hace >24h
  const staleConversation = leads.filter(lead => {
    if (lead['Estado CRM'] !== 'En Conversación') return false;
    try {
      const modified = parseISO(lead['Última Modificación'] || lead['CreatedAt']);
      if (!isValid(modified)) return false;
      return differenceInHours(now, modified) > 24;
    } catch {
      return false;
    }
  });
  if (staleConversation.length > 0) {
    alerts.push({
      type: 'warning',
      icon: '🟡',
      message: `${staleConversation.length} lead${staleConversation.length > 1 ? 's' : ''} en conversación hace >24h sin respuesta`,
      count: staleConversation.length
    });
  }

  return alerts;
}

/**
 * Generar insights priorizados con datos reales del CRM
 * Orden: urgente > dinero en riesgo > acciones pendientes > patrones
 */
export function generateInsights(leads, metrics) {
  if (!leads || !Array.isArray(leads)) return [];

  const insights = [];

  // --- PRIORIDAD 1: URGENTE (respuesta inmediata requerida) ---
  const requiresHuman = leads.filter(l => l['Estado CRM'] === 'Requiere Humano').length;
  if (requiresHuman > 0) {
    insights.push({
      icon: '🔴',
      message: `${requiresHuman} lead${requiresHuman > 1 ? 's requieren' : ' requiere'} atención humana ahora — cada hora sin respuesta reduce ~40% la probabilidad de cierre.`,
      type: 'warning',
      priority: 1,
    });
  }

  // --- PRIORIDAD 2: DINERO EN RIESGO ---
  const noBuy = leads.filter(l => l['Estado CRM'] === 'No Compró').length;
  if (noBuy > 0) {
    const potential = metrics?.avgTicket > 0
      ? `= S/${Math.round(noBuy * metrics.avgTicket).toLocaleString()} en ingresos potenciales`
      : `= ${noBuy} oportunidades sin cerrar`;
    insights.push({
      icon: '💰',
      message: `${noBuy} leads en "No Compró" ${potential}. El 20-30% puede reactivarse con un seguimiento diferente — ¿cuándo fue el último contacto?`,
      type: 'action',
      priority: 2,
    });
  }

  // --- PRIORIDAD 3: MÉTRICAS CRÍTICAS ---
  if (metrics?.noShowRate > 0.2) {
    const pct = (metrics.noShowRate * 100).toFixed(0);
    insights.push({
      icon: '⚠️',
      message: `No-show en ${pct}% (umbral crítico: 20%). Un recordatorio por WhatsApp 2h antes de la cita puede reducirlo a la mitad sin costo adicional.`,
      type: 'warning',
      priority: 3,
    });
  }

  // --- PRIORIDAD 4: ACCIONES PENDIENTES CON LEADS CALIENTES ---
  const linkSent = leads.filter(l => l['Estado CRM'] === 'Link Enviado').length;
  if (linkSent > 0) {
    insights.push({
      icon: '📅',
      message: `${linkSent} lead${linkSent !== 1 ? 's tienen' : ' tiene'} el link sin usar — un mensaje personalizado en las próximas 24h puede recuperar el 30-40% de ellos.`,
      type: 'action',
      priority: 4,
    });
  }

  const precalified = leads.filter(l => l['Estado CRM'] === 'Precalificado').length;
  if (precalified > 0) {
    insights.push({
      icon: '💡',
      message: `${precalified} lead${precalified !== 1 ? 's están' : ' está'} precalificado${precalified !== 1 ? 's' : ''} y esperan el link — están listos y el momentum se enfría con cada hora.`,
      type: 'action',
      priority: 5,
    });
  }

  // --- PRIORIDAD 5: PERFORMANCE (tasa de cierre) ---
  if (metrics?.closeRate > 0) {
    const pct = (metrics.closeRate * 100).toFixed(0);
    if (metrics.closeRate >= 0.5) {
      insights.push({
        icon: '🏆',
        message: `Tasa de cierre en ${pct}% — por encima del promedio (30-40%). El cuello de botella no está en la consulta sino en traer más leads calificados a ella.`,
        type: 'insight',
        priority: 6,
      });
    } else if (metrics.closeRate < 0.3) {
      insights.push({
        icon: '⚡',
        message: `Tasa de cierre en ${pct}% — por debajo del estándar (30-40%). Los leads que asisten tienen objeciones sin resolver; revisar el script de consulta puede subir esto 10-15%.`,
        type: 'warning',
        priority: 6,
      });
    }
  }

  // --- PRIORIDAD 6: PATRONES (optimización) ---
  if (metrics?.bestDay) {
    insights.push({
      icon: '📈',
      message: `Los ${metrics.bestDay.toLowerCase()} recibes más leads — concentrar el presupuesto de ads ese día reduce el CPL y mejora la velocidad de primera respuesta.`,
      type: 'insight',
      priority: 7,
    });
  }

  if (metrics?.bestDistrict && metrics.bestDistrict !== 'Desconocido') {
    insights.push({
      icon: '🔥',
      message: `Leads de ${metrics.bestDistrict} convierten más que cualquier otro distrito — segmentar campañas hacia esa zona mejora el ROI publicitario.`,
      type: 'insight',
      priority: 8,
    });
  }

  return insights.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}
