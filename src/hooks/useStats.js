import { useMemo } from 'react';
import {
  calculateMetrics,
  calculateFunnel,
  calculatePipeline,
  calculateDistribution,
  calculateLeadsByDay,
  calculateAdvancedMetrics,
  generateAlerts,
  generateInsights,
} from '../utils/calculations';

export function useStats(leads, dateFilter = 'month', customStart = null, customEnd = null) {
  // Métricas principales
  const metrics = useMemo(() => {
    return calculateMetrics(leads, dateFilter, customStart, customEnd);
  }, [leads, dateFilter, customStart, customEnd]);

  // Funnel acumulativo (tasas de conversión históricas)
  const funnelData = useMemo(() => {
    return calculateFunnel(leads);
  }, [leads]);

  // Pipeline snapshot (dónde está cada lead hoy)
  const pipelineData = useMemo(() => {
    return calculatePipeline(leads);
  }, [leads]);

  // Distribuciones
  const statusDistribution = useMemo(() => {
    return calculateDistribution(leads, 'Estado CRM');
  }, [leads]);

  const districtDistribution = useMemo(() => {
    return calculateDistribution(leads, 'Distrito Usado Para Calificar');
  }, [leads]);

  const originDistribution = useMemo(() => {
    return calculateDistribution(leads, 'Origen del Lead');
  }, [leads]);

  const disqualificationReasons = useMemo(() => {
    const disqualified = leads.filter(l => l['Estado CRM'] === 'Descalificado');
    return calculateDistribution(disqualified, 'Razón Descalificación');
  }, [leads]);

  // Tendencias
  const leadsByDay = useMemo(() => {
    return calculateLeadsByDay(leads, 30);
  }, [leads]);

  const appointmentsByDay = useMemo(() => {
    // Filtrar leads con citas y calcular por día
    const leadsWithAppointments = leads.filter(l => l['Fecha de agendamiento']);
    return calculateLeadsByDay(leadsWithAppointments, 30);
  }, [leads]);

  // Ingresos por semana
  const revenueByWeek = useMemo(() => {
    const weeks = {};
    leads.forEach(lead => {
      if (lead['Monto Venta Cerrada (PEN)'] && lead['CreatedAt']) {
        try {
          const date = new Date(lead['CreatedAt']);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekKey = weekStart.toISOString().split('T')[0];

          weeks[weekKey] = (weeks[weekKey] || 0) + parseFloat(lead['Monto Venta Cerrada (PEN)']);
        } catch { }
      }
    });

    return Object.entries(weeks)
      .map(([week, revenue]) => ({ week, revenue }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8); // Últimas 8 semanas
  }, [leads]);

  // Métricas avanzadas
  const advancedMetrics = useMemo(() => {
    return calculateAdvancedMetrics(leads);
  }, [leads]);

  // Alertas
  const alerts = useMemo(() => {
    return generateAlerts(leads);
  }, [leads]);

  // Insights
  const insights = useMemo(() => {
    return generateInsights(leads, advancedMetrics);
  }, [leads, advancedMetrics]);

  return {
    metrics,
    funnelData,
    pipelineData,
    statusDistribution,
    districtDistribution,
    originDistribution,
    disqualificationReasons,
    leadsByDay,
    appointmentsByDay,
    revenueByWeek,
    advancedMetrics,
    alerts,
    insights,
  };
}

export default useStats;
