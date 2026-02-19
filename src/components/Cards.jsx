import { Users, MessageCircle, CalendarCheck, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { Card } from './ui';
import { formatNumber, formatCurrency, formatPercent, formatChange } from '../utils/formatters';

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  format = 'number',
  accentColor = 'cyan',
  danger = false
}) => {
  const formattedValue = format === 'currency'
    ? formatCurrency(value)
    : format === 'percent'
      ? formatPercent(value)
      : formatNumber(value);

  const changeData = formatChange(change);

  const accentColors = {
    cyan: 'from-accent-cyan to-accent-cyan/50',
    magenta: 'from-accent-magenta to-accent-magenta/50',
    green: 'from-accent-green to-accent-green/50',
    yellow: 'from-accent-yellow to-accent-yellow/50',
    purple: 'from-accent-purple to-accent-purple/50',
    red: 'from-accent-red to-accent-red/50',
  };

  const iconBgColors = {
    cyan: 'bg-accent-cyan/10 text-accent-cyan',
    magenta: 'bg-accent-magenta/10 text-accent-magenta',
    green: 'bg-accent-green/10 text-accent-green',
    yellow: 'bg-accent-yellow/10 text-accent-yellow',
    purple: 'bg-accent-purple/10 text-accent-purple',
    red: 'bg-accent-red/10 text-accent-red',
  };

  return (
    <Card
      className={`relative overflow-hidden ${danger && value > 0 ? 'border-error/50' : ''}`}
      padding="md"
      hover
      glow={danger && value > 0 ? null : accentColor}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentColors[danger ? 'red' : accentColor]}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold font-mono mt-1 ${danger && value > 0 ? 'text-error' : 'text-gray-100'}`}>
            {formattedValue}
          </p>
          {changeData && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              changeData.positive ? 'text-accent-green' :
              changeData.positive === false ? 'text-error' : 'text-gray-500'
            }`}>
              {changeData.text}
              <span className="text-gray-500">vs anterior</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColors[danger ? 'red' : accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default function Cards({ metrics }) {
  const {
    totalLeads,
    newLeads,
    scheduled,
    conversionRate,
    revenue,
    requiresAttention,
    changes,
  } = metrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <MetricCard
        title="Total Leads"
        value={totalLeads}
        icon={Users}
        accentColor="cyan"
      />
      <MetricCard
        title="En Conversación"
        value={newLeads}
        change={changes.newLeads}
        icon={MessageCircle}
        accentColor="purple"
      />
      <MetricCard
        title="Citas Agendadas"
        value={scheduled}
        change={changes.scheduled}
        icon={CalendarCheck}
        accentColor="green"
      />
      <MetricCard
        title="Tasa Conversión"
        value={conversionRate}
        change={changes.conversionRate}
        icon={TrendingUp}
        format="percent"
        accentColor="magenta"
      />
      <MetricCard
        title="Ingresos"
        value={revenue}
        change={changes.revenue}
        icon={DollarSign}
        format="currency"
        accentColor="yellow"
      />
      <MetricCard
        title="Requiere Atención"
        value={requiresAttention}
        icon={AlertTriangle}
        danger
      />
    </div>
  );
}
