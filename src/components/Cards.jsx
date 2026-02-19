import { Users, UserPlus, CalendarCheck, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { Card } from './ui';
import { formatNumber, formatCurrency, formatPercent, formatChange } from '../utils/formatters';

const MetricCard = ({ title, value, change, icon: Icon, format = 'number', danger = false }) => {
  const formattedValue = format === 'currency'
    ? formatCurrency(value)
    : format === 'percent'
      ? formatPercent(value)
      : formatNumber(value);

  const changeData = formatChange(change);

  return (
    <Card
      className={`${danger && value > 0 ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
      padding="md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className={`text-2xl font-bold font-mono mt-1 ${danger && value > 0 ? 'text-red-600' : 'text-text-primary'}`}>
            {formattedValue}
          </p>
          {changeData && (
            <p className={`text-xs mt-1 ${changeData.positive ? 'text-green-600' : changeData.positive === false ? 'text-red-600' : 'text-gray-500'}`}>
              {changeData.text} vs período anterior
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${danger && value > 0 ? 'bg-red-100' : 'bg-primary-50'}`}>
          <Icon className={`w-5 h-5 ${danger && value > 0 ? 'text-red-600' : 'text-primary-600'}`} />
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
      />
      <MetricCard
        title="Leads Nuevos"
        value={newLeads}
        change={changes.newLeads}
        icon={UserPlus}
      />
      <MetricCard
        title="Citas Programadas"
        value={scheduled}
        change={changes.scheduled}
        icon={CalendarCheck}
      />
      <MetricCard
        title="Tasa Conversión"
        value={conversionRate}
        change={changes.conversionRate}
        icon={TrendingUp}
        format="percent"
      />
      <MetricCard
        title="Ingresos"
        value={revenue}
        change={changes.revenue}
        icon={DollarSign}
        format="currency"
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
