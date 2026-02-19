import { Clock, UserX, CheckCircle, Receipt, MapPin, Calendar, Clock3 } from 'lucide-react';
import { Card } from './ui';
import { formatPercent, formatCurrency } from '../utils/formatters';

const MiniCard = ({ title, value, icon: Icon, color = 'cyan' }) => {
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
    <Card padding="sm" className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 truncate">{title}</p>
        <p className="text-sm font-semibold font-mono text-gray-100 truncate">
          {value !== null && value !== undefined ? value : '-'}
        </p>
      </div>
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
      />
      <MiniCard
        title="Tasa No-Show"
        value={formatPercent(noShowRate)}
        icon={UserX}
        color="red"
      />
      <MiniCard
        title="Tasa Cierre"
        value={formatPercent(closeRate)}
        icon={CheckCircle}
        color="green"
      />
      <MiniCard
        title="Ticket Promedio"
        value={formatCurrency(avgTicket)}
        icon={Receipt}
        color="yellow"
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
