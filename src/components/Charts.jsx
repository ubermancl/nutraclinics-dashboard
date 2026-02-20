import { useState } from 'react';
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card } from './ui';
import { formatNumber, formatCurrency } from '../utils/formatters';

const tabs = [
  { id: 'conversion', label: 'Conversión' },
  { id: 'trends', label: 'Tendencias' },
  { id: 'distribution', label: 'Distribución' },
];

// Colores para gráficos (tema oscuro)
const CHART_COLORS = [
  '#00D9FF', // cyan
  '#B24BF3', // magenta
  '#10B981', // green
  '#F59E0B', // yellow
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // teal
];

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Funnel de conversión
function ConversionFunnel({ data }) {
  const maxCount = data[0]?.count || 1;

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const widthPercent = (item.count / maxCount) * 100;
        const color = CHART_COLORS[index % CHART_COLORS.length];

        return (
          <div key={item.state} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-medium">{item.state}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-gray-100">{formatNumber(item.count)}</span>
                {index > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-400">
                    {item.conversionFromPrevious.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-8 bg-dark-700 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-500"
                style={{
                  width: `${widthPercent}%`,
                  background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Gráficos de tendencias
function TrendsCharts({ leadsByDay, appointmentsByDay, revenueByWeek }) {
  return (
    <div className="space-y-8">
      {/* Leads por día */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-4">Leads por día (últimos 30 días)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={leadsByDay}>
              <defs>
                <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#6E7681' }}
                tickFormatter={(value) => value.slice(5)}
                axisLine={{ stroke: '#30363D' }}
              />
              <YAxis tick={{ fontSize: 10, fill: '#6E7681' }} axisLine={{ stroke: '#30363D' }} />
              <Tooltip content={<CustomTooltip formatter={(v) => `${v} leads`} />} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#00D9FF"
                strokeWidth={2}
                fill="url(#gradientLeads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ingresos por semana */}
      {revenueByWeek.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Ingresos por semana</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByWeek}>
                <defs>
                  <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B24BF3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#B24BF3" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10, fill: '#6E7681' }}
                  tickFormatter={(value) => value.slice(5)}
                  axisLine={{ stroke: '#30363D' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6E7681' }}
                  tickFormatter={(value) => `S/${value}`}
                  axisLine={{ stroke: '#30363D' }}
                />
                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                <Bar dataKey="revenue" fill="url(#gradientRevenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Gráficos de distribución
function DistributionCharts({ statusDistribution, districtDistribution, originDistribution }) {
  const renderDonut = (data, title) => {
    const top5 = data.slice(0, 5);
    const others = data.slice(5);
    const displayData = others.length > 0
      ? [...top5, { name: 'Otros', value: others.reduce((sum, d) => sum + d.value, 0) }]
      : top5;

    return (
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-4">{title}</h4>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={formatNumber} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {displayData.slice(0, 4).map((item, index) => (
            <div key={item.name} className="flex items-center gap-1 text-xs">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="text-gray-400 truncate max-w-[80px]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusDistribution.length > 0 && renderDonut(statusDistribution, 'Por Estado')}
      {districtDistribution.length > 0 && renderDonut(districtDistribution, 'Por Distrito')}
      {originDistribution.length > 0 && renderDonut(originDistribution, 'Por Origen')}
    </div>
  );
}

export default function Charts({
  funnelData,
  leadsByDay,
  appointmentsByDay,
  revenueByWeek,
  statusDistribution,
  districtDistribution,
  originDistribution,
}) {
  const [activeTab, setActiveTab] = useState('conversion');

  return (
    <Card>
      {/* Tabs */}
      <div className="flex border-b border-dark-600 mb-6 -mx-4 md:-mx-6 px-4 md:px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all
              ${activeTab === tab.id
                ? 'border-accent-cyan text-accent-cyan'
                : 'border-transparent text-gray-400 hover:text-gray-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {activeTab === 'conversion' && (
        <ConversionFunnel data={funnelData} />
      )}

      {activeTab === 'trends' && (
        <TrendsCharts
          leadsByDay={leadsByDay}
          appointmentsByDay={appointmentsByDay}
          revenueByWeek={revenueByWeek}
        />
      )}

      {activeTab === 'distribution' && (
        <DistributionCharts
          statusDistribution={statusDistribution}
          districtDistribution={districtDistribution}
          originDistribution={originDistribution}
        />
      )}
    </Card>
  );
}
