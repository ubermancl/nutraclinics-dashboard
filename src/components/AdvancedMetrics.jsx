import { Clock, UserX, CheckCircle, Receipt, MapPin, Calendar, Clock3, Lock, RefreshCw } from 'lucide-react';
import { Card } from './ui';
import { formatPercent, formatCurrency } from '../utils/formatters';

const MiniCard = ({ title, value, icon: Icon, color = 'cyan', tooltip, locked = false }) => {
  const colors = {
    cyan: 'text-accent-cyan bg-accent-cyan/10',
    magenta: 'text-accent-magenta bg-accent-magenta/10',
    green: 'text-accent-green bg-accent-green/10',
    yellow: 'text-accent-yellow bg-accent-yellow/10',
    purple: 'text-accent-purple bg-accent-purple/10',
    red: 'text-accent-red bg-accent-red/10',
    orange: 'text-accent-orange bg-accent-orange/10',
  };

  if (locked) {
    return (
      <Card padding="sm" className="flex items-center gap-3 relative overflow-hidden">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1 blur-sm select-none" aria-hidden="true">
          <p className="text-xs text-gray-500 truncate">{title}</p>
          <p className="text-sm font-semibold font-mono text-gray-100 truncate">--.--%</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-dark-800/50 backdrop-blur-[1px]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-accent-magenta/70" />
            <span className="text-xs font-semibold text-accent-magenta/80">PRO</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="sm" className="flex items-center gap-3 relative group" title={tooltip}>
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 truncate">{title}</p>
        <p className="text-sm font-semibold font-mono text-gray-100 truncate">
          {value !== null && value !== undefined ? value : '-'}
        </p>
      </div>
      {tooltip && (
        <div className="absolute left-0 bottom-full mb-2 z-20 w-64 p-3 rounded-lg bg-dark-900 border border-dark-500 shadow-xl text-xs text-gray-300 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <p className="font-semibold text-gray-100 mb-1">📊 ¿Cómo se calcula?</p>
          <p>{tooltip}</p>
        </div>
      )}
    </Card>
  );
};

export default function AdvancedMetrics({ metrics }) {
  const {
    avgTimeToSchedule,
    noShowRate,
    closeRate,
    avgTicket,
    bestDistrict,
    bestDay,
    peakHour,
  } = metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
      <MiniCard
        title="Tiempo → Cita"
        value={avgTimeToSchedule !== null ? `${avgTimeToSchedule.toFixed(1)} días` : null}
        icon={Clock}
        color="cyan"
        tooltip="Promedio de días entre la creación del lead y su fecha de agendamiento. Solo se cuentan leads que tienen ambas fechas registradas."
      />
      <MiniCard
        title="Tasa No-Show"
        value={formatPercent(noShowRate)}
        icon={UserX}
        color="red"
        tooltip="No Asistió ÷ (Asistió + No Asistió). De cada cita efectivamente agendada, qué porcentaje no se presentó. No incluye citas canceladas."
      />
      <MiniCard
        title="Tasa Cierre"
        value={formatPercent(closeRate)}
        icon={CheckCircle}
        color="green"
        tooltip="Compró ÷ Asistió. De los leads que asistieron a consulta, qué porcentaje adquirió un plan. 'Asistió' incluye también: Compró, No Compró, Cliente Activo, Plan Terminado y Recompró."
      />
      <MiniCard
        title="Ticket Promedio"
        value={formatCurrency(avgTicket)}
        icon={Receipt}
        color="yellow"
        tooltip="Suma total de ventas cerradas ÷ número de ventas. Solo se consideran leads con monto de venta mayor a 0 en el campo 'Monto Venta Cerrada (PEN)'."
      />
      <MiniCard
        title="Mejor Distrito"
        value={bestDistrict}
        icon={MapPin}
        color="purple"
        tooltip="Distrito con más conversiones (leads en estado 'Compró'). Se usa el campo 'Distrito Usado Para Calificar' o 'Distrito Residencia' como fallback."
      />
      <MiniCard
        title="Mejor Día"
        value={bestDay}
        icon={Calendar}
        color="magenta"
        tooltip="Día de la semana con mayor volumen de leads nuevos (según fecha de creación 'CreatedAt'). Útil para concentrar presupuesto de ads."
      />
      <MiniCard
        title="Hora Pico"
        value={peakHour}
        icon={Clock3}
        color="orange"
        tooltip="Hora del día con mayor volumen de leads entrantes. Basado en la hora de 'CreatedAt'. Útil para tener al equipo disponible en ese horario."
      />
      <MiniCard
        title="Tasa Recuperación"
        icon={RefreshCw}
        color="cyan"
        locked
      />
    </div>
  );
}
