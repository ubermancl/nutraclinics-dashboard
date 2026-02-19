import { Clock, UserX, CheckCircle, Receipt, MapPin, Calendar, Clock3 } from 'lucide-react';
import { Card } from './ui';
import { formatPercent, formatCurrency } from '../utils/formatters';

const MiniCard = ({ title, value, icon: Icon, color = 'cyan', tooltip }) => {
  const colors = {
    cyan: 'text-accent-cyan bg-accent-cyan/10',
    magenta: 'text-accent-magenta bg-accent-magenta/10',
    green: 'text-accent-green bg-accent-green/10',
    yellow: 'text-accent-yellow bg-accent-yellow/10',
    purple: 'text-accent-purple bg-accent-purple/10',
    red: 'text-accent-red bg-accent-red/10',
    orange: 'text-accent-orange bg-accent-orange/10',
  };

  return (
    <Card padding="sm" className="flex items-center gap-3 group relative" title={tooltip}>
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
        <div className="absolute bottom-full left-0 mb-2 z-50 w-64 p-2.5 bg-dark-600 border border-dark-500 rounded-lg shadow-xl text-xs text-gray-300 leading-relaxed hidden group-hover:block">
          {tooltip}
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <MiniCard
        title="Tiempo → Cita"
        value={avgTimeToSchedule !== null ? `${avgTimeToSchedule.toFixed(1)} días` : null}
        icon={Clock}
        color="cyan"
        tooltip="Promedio de días entre la fecha de creación del lead y su fecha de agendamiento."
      />
      <MiniCard
        title="Tasa No-Show"
        value={formatPercent(noShowRate)}
        icon={UserX}
        color="red"
        tooltip="No Asistió ÷ (Asistió + No Asistió). Mide qué porcentaje de los que agendaron no se presentaron a la consulta."
      />
      <MiniCard
        title="Tasa Cierre"
        value={formatPercent(closeRate)}
        icon={CheckCircle}
        color="green"
        tooltip="Compró ÷ Asistió (incluye Cliente Activo, Recompró, Plan Terminado). Mide cuántos de los que llegaron a consulta terminaron comprando."
      />
      <MiniCard
        title="Ticket Promedio"
        value={formatCurrency(avgTicket)}
        icon={Receipt}
        color="yellow"
        tooltip="Suma de Monto Venta Cerrada (PEN) ÷ número de ventas cerradas. Solo considera leads con monto mayor a 0."
      />
      <MiniCard
        title="Mejor Distrito"
        value={bestDistrict}
        icon={MapPin}
        color="purple"
      />
      <MiniCard
        title="Mejor Día"
        value={bestDay}
        icon={Calendar}
        color="magenta"
      />
      <MiniCard
        title="Hora Pico"
        value={peakHour}
        icon={Clock3}
        color="orange"
      />
    </div>
  );
}
