import { useState } from 'react';
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardTitle } from './ui';
import { CHART_COLORS } from '../utils/constants';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';

const tabs = [
  { id: 'conversion', label: 'Conversión' },
  { id: 'trends', label: 'Tendencias' },
  { id: 'distribution', label: 'Distribución' },
];

// Funnel de conversión
function ConversionFunnel({ data }) {
  const funnelData = data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              formatter={(value, name) => [formatNumber(value), name]}
            />
            <Funnel
              dataKey="count"
              data={funnelData}
              isAnimationActive
            >
              <LabelList
                position="right"
                fill="#1A1A1A"
                stroke="none"
                dataKey="state"
                fontSize={12}
              />
              <LabelList
                position="center"
                fill="#fff"
                stroke="none"
                dataKey="count"
                fontSize={14}
                fontWeight="bold"
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de conversión */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium">Estado</th>
              <th className="text-right py-2 px-3 font-medium">Cantidad</th>
              <th className="text-right py-2 px-3 font-medium">% del Total</th>
              <th className="text-right py-2 px-3 font-medium">Conversión</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.state} className="border-b last:border-0">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  {item.state}
                </td>
                <td className="text-right py-2 px-3 font-mono">{formatNumber(item.count)}</td>
                <td className="text-right py-2 px-3 font-mono">{item.percentOfTotal.toFixed(1)}%</td>
                <td className="text-right py-2 px-3 font-mono">
                  {index === 0 ? '-' : `${item.conversionFromPrevious.toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Gráficos de tendencias
function TrendsCharts({ leadsByDay, appointmentsByDay, revenueByWeek }) {
  return (
    <div className="space-y-6">
      {/* Leads por día */}
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-3">Leads por día (últimos 30 días)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={leadsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(label) => `Fecha: ${label}`}
                formatter={(value) => [formatNumber(value), 'Leads']}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Citas por día */}
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-3">Citas por día</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={appointmentsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(label) => `Fecha: ${label}`}
                formatter={(value) => [formatNumber(value), 'Citas']}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke={CHART_COLORS[1]}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ingresos por semana */}
      {revenueByWeek.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Ingresos por semana</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `S/${value}`}
                />
                <Tooltip
                  labelFormatter={(label) => `Semana: ${label}`}
                  formatter={(value) => [formatCurrency(value), 'Ingresos']}
                />
                <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Gráficos de distribución
function DistributionCharts({ statusDistribution, districtDistribution, originDistribution, disqualificationReasons }) {
  const renderDonut = (data, title) => {
    const top5 = data.slice(0, 5);
    const others = data.slice(5);
    const displayData = others.length > 0
      ? [...top5, { name: 'Otros', value: others.reduce((sum, d) => sum + d.value, 0) }]
      : top5;

    return (
      <div>
        <h4 className="text-sm font-medium text-text-secondary mb-3">{title}</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                label={({ name, percent }) => `${name.slice(0, 10)}${name.length > 10 ? '...' : ''} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {statusDistribution.length > 0 && renderDonut(statusDistribution, 'Por Estado CRM')}
      {districtDistribution.length > 0 && renderDonut(districtDistribution, 'Por Distrito')}
      {originDistribution.length > 0 && renderDonut(originDistribution, 'Por Origen')}

      {/* Razones de descalificación */}
      {disqualificationReasons.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Razones de Descalificación</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disqualificationReasons.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  width={100}
                  tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + '...' : value}
                />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Bar dataKey="value" fill={CHART_COLORS[4]} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
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
  disqualificationReasons,
}) {
  const [activeTab, setActiveTab] = useState('conversion');

  return (
    <Card>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
              ${activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-text-secondary hover:text-text-primary'
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
          disqualificationReasons={disqualificationReasons}
        />
      )}
    </Card>
  );
}
