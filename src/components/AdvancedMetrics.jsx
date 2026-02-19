import { Clock, UserX, CheckCircle, Receipt, MapPin, Calendar, Clock3 } from 'lucide-react';
import { Card } from './ui';
import { formatPercent, formatCurrency } from '../utils/formatters';

const MiniCard = ({ title, value, icon: Icon, suffix = '' }) => (
  <Card padding="sm" className="flex items-center gap-3">
    <div className="p-2 bg-gray-100 rounded-lg">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div>
      <p className="text-xs text-text-secondary">{title}</p>
      <p className="text-sm font-semibold font-mono text-text-primary">
        {value !== null && value !== undefined ? `${value}${suffix}` : '-'}
      </p>
    </div>
  </Card>
);

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
        title="Tiempo Lead → Cita"
        value={avgTimeToSchedule !== null ? avgTimeToSchedule.toFixed(1) : null}
        suffix=" días"
        icon={Clock}
      />
      <MiniCard
        title="Tasa No-Show"
        value={formatPercent(noShowRate)}
        icon={UserX}
      />
      <MiniCard
        title="Tasa de Cierre"
        value={formatPercent(closeRate)}
        icon={CheckCircle}
      />
      <MiniCard
        title="Ticket Promedio"
        value={formatCurrency(avgTicket)}
        icon={Receipt}
      />
      <MiniCard
        title="Mejor Distrito"
        value={bestDistrict}
        icon={MapPin}
      />
      <MiniCard
        title="Mejor Día"
        value={bestDay}
        icon={Calendar}
      />
      <MiniCard
        title="Hora Pico"
        value={peakHour}
        icon={Clock3}
      />
    </div>
  );
}
