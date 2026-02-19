import { useState, useRef } from 'react';
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

// Descripciones para tooltips del funnel
const FUNNEL_DESCRIPTIONS = {
  'Total Leads': 'Base del funnel — 100% de referencia. Todos los leads recibidos hasta hoy sin importar su estado.',
  'En Conversación': '% del total de leads que inició conversación activa. Conteo acumulativo: incluye también a todos los que avanzaron a etapas siguientes (Precalificado, Agendado, Compró, etc.).',
  'Precalificado': '% de los que estuvieron en conversación que respondieron y superaron la calificación inicial. Acumulativo: incluye los que avanzaron más.',
  'Link Enviado': '% de los precalificados que recibieron el link de agendamiento. Acumulativo: incluye los que ya agendaron o compraron.',
  'Agendado': '% de los que recibieron el link que efectivamente agendaron su cita. Acumulativo: incluye los que asistieron y compraron.',
  'Asistió': '% de los agendados que asistieron a la consulta. Acumulativo: incluye también quienes compraron en esa visita.',
  'Compró': '% de los que asistieron a consulta que decidieron adquirir un plan. Este es tu tasa de cierre real.',
};

// Funnel de conversión
function ConversionFunnel({ data }) {
  const [hoveredState, setHoveredState] = useState(null);
  const maxCount = data[0]?.count || 1;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">
        Los porcentajes de cada etapa son respecto al paso anterior.{' '}
        <span className="text-accent-cyan">Pasa el cursor sobre el % para ver la explicación.</span>
      </p>
      <div className="space-y-3">
        {data.map((item, index) => {
          const widthPercent = (item.count / maxCount) * 100;
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const isTotal = item.state === 'Total Leads';
          const description = FUNNEL_DESCRIPTIONS[item.state];

          return (
            <div key={item.state}>
              {/* Separador visual entre Total Leads y el funnel */}
              {index === 1 && (
                <div className="border-t border-dark-600 border-dashed my-3" />
              )}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${isTotal ? 'text-gray-100' : 'text-gray-300'}`}>
                    {item.state}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-100">{formatNumber(item.count)}</span>
                    {/* Badge de porcentaje con tooltip */}
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredState(item.state)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <span className={`text-xs px-2 py-0.5 rounded cursor-help select-none transition-colors ${
                        isTotal
                          ? 'bg-accent-cyan/20 text-accent-cyan font-semibold'
                          : 'bg-dark-600 text-gray-400 hover:bg-dark-500 hover:text-gray-200'
                      }`}>
                        {isTotal ? '100%' : `${item.conversionFromPrevious.toFixed(1)}%`}
                      </span>
                      {hoveredState === item.state && description && (
                        <div className="absolute right-0 top-7 z-50 w-72 p-3 bg-dark-600 border border-dark-500 rounded-lg shadow-2xl">
                          <p className="text-xs text-gray-200 leading-relaxed">{description}</p>
                          {!isTotal && (
                            <p className="text-xs text-accent-cyan mt-2 font-medium border-t border-dark-500 pt-2">
                              % respecto a: <span className="text-gray-300">{data[index - 1]?.state}</span> ({formatNumber(data[index - 1]?.count)})
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`bg-dark-700 rounded-lg overflow-hidden ${isTotal ? 'h-10' : 'h-7'}`}>
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}60 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
