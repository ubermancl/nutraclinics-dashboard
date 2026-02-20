import { useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Lock, MessageCircle } from 'lucide-react';
import { Card } from './ui';
import { formatNumber, formatCurrency } from '../utils/formatters';

const UPGRADE_URL = 'https://wa.link/su2ie7';

const tabs = [
  { id: 'conversion',   label: 'Conversión' },
  { id: 'pipeline',     label: 'Pipeline activo', locked: true },
  { id: 'trends',       label: 'Tendencias' },
  { id: 'distribution', label: 'Distribución' },
];

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

// ─── Tooltip recharts ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-semibold">
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

// ─── Componente reutilizable: barra de funnel ─────────────────────────────────
function FunnelBar({ item, index, totalCount, colorOffset = 0, badgeValue, badgeTitle, descriptions }) {
  const [hovered, setHovered] = useState(false);
  const widthPercent = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
  const color = CHART_COLORS[(index + colorOffset) % CHART_COLORS.length];
  const description = descriptions?.[item.state];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 font-medium">{item.state}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-gray-100">{formatNumber(item.count)}</span>
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span className="text-xs px-2 py-0.5 rounded bg-dark-600 text-gray-400 hover:bg-dark-500 hover:text-gray-200 cursor-help select-none transition-colors">
              {badgeValue}
            </span>
            {hovered && description && (
              <div className="absolute right-0 bottom-full mb-2 z-20 w-72 p-3 rounded-lg bg-dark-900 border border-dark-500 shadow-xl text-xs text-gray-300 leading-relaxed pointer-events-none">
                <p className="font-semibold text-gray-100 mb-1">{badgeTitle || '📊 ¿Cómo se calcula?'}</p>
                <p>{description}</p>
              </div>
            )}
          </div>
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
      {item.leaked > 0 && item.leakedLabel && (
        <div className="flex items-center gap-1.5 mt-1 pl-1">
          <span className="text-accent-red/50 text-[10px]">↳</span>
          <span className="text-xs text-dark-400">{item.leaked} {item.leakedLabel}</span>
        </div>
      )}
    </div>
  );
}

// ─── Funnel de Conversión (acumulativo) ──────────────────────────────────────
const CONVERSION_DESCRIPTIONS = {
  'Precalificado': 'De los leads que iniciaron conversación, este % superó la calificación inicial. Acumulativo: incluye todos los que avanzaron más (Link Enviado, Agendado, Compró...).',
  'Link Enviado':  'De los Precalificados, este % recibió el link de agendamiento. Acumulativo: incluye los que ya agendaron o compraron.',
  'Agendado':      'De los que recibieron link, este % efectivamente agendó su cita. Acumulativo: incluye los que asistieron y compraron.',
  'Asistió':       'De los Agendados, este % asistió a la consulta. Acumulativo: incluye quienes compraron en esa visita.',
  'Compró':        'De los que asistieron, este % adquirió un plan. Esta es tu tasa de cierre real.',
};

function ConversionFunnel({ data }) {
  const totalItem   = data.find(d => d.state === 'Total Leads');
  const enConvItem  = data.find(d => d.state === 'En Conversación');
  const funnelItems = data.filter(d => d.state !== 'Total Leads' && d.state !== 'En Conversación');
  const totalCount  = totalItem?.count || 1;

  return (
    <div>
      {/* Referencia: Total Leads */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-100">Total Leads</span>
          <span className="text-xs text-gray-600">base 100%</span>
        </div>
        <span className="font-mono text-xl font-bold text-accent-cyan">{formatNumber(totalCount)}</span>
      </div>

      {/* En Conversación: nota informativa (≈ total, no aporta barra visual) */}
      {enConvItem && (
        <div className="flex items-center justify-between text-xs mb-4 px-3 py-2 rounded-lg bg-dark-700/50 border border-dark-600">
          <span className="text-gray-500">
            En Conversación <span className="text-gray-700">(incluye todos los que iniciaron — casi siempre ≈ total)</span>
          </span>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="font-mono text-gray-400">{formatNumber(enConvItem.count)}</span>
            <span className="text-gray-600">{enConvItem.percentOfTotal.toFixed(0)}%</span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mb-4">
        El % es la tasa de conversión respecto al paso anterior.{' '}
        <span className="text-accent-cyan">Pasa el cursor sobre el % para ver la explicación.</span>
      </p>

      <div className="space-y-3">
        {funnelItems.map((item, index) => (
          <FunnelBar
            key={item.state}
            item={item}
            index={index}
            totalCount={totalCount}
            colorOffset={2}
            badgeValue={`${item.conversionFromPrevious.toFixed(1)}%`}
            descriptions={CONVERSION_DESCRIPTIONS}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Pipeline Activo (snapshot) ───────────────────────────────────────────────
const PIPELINE_DESCRIPTIONS = {
  'En Conversación': 'Leads AHORA en conversación activa (estado "En Conversación" o "Requiere Humano"). Los que avanzaron a otras etapas no se cuentan aquí.',
  'Precalificado':   'Leads AHORA precalificados, esperando recibir el link de agendamiento.',
  'Link Enviado':    'Leads que tienen el link enviado y están AHORA pendientes de agendar su cita.',
  'Agendado':        'Leads con cita programada próxima. Acción: confirmar asistencia.',
  'Asistió':         'Leads que asistieron y están pendientes de decisión. Generalmente transitorio — pasan rápido a Compró o No Compró.',
  'Compró':          'Conversiones exitosas: Compró + Cliente Activo + Plan Terminado + Recompró.',
};

function PipelineView({ data }) {
  const totalItem     = data.find(d => d.state === 'Total Leads');
  const pipelineItems = data.filter(d => d.state !== 'Total Leads');
  const totalCount    = totalItem?.count || 1;

  const activeCount   = pipelineItems.reduce((s, i) => s + i.count, 0);
  const negativeCount = pipelineItems.reduce((s, i) => s + (i.leaked || 0), 0);
  const unaccounted   = Math.max(0, totalCount - activeCount - negativeCount);

  return (
    <div>
      {/* Referencia: Total Leads */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-100">Total Leads</span>
          <span className="text-xs text-gray-600">snapshot hoy</span>
        </div>
        <span className="font-mono text-xl font-bold text-accent-cyan">{formatNumber(totalCount)}</span>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Dónde está cada lead <span className="font-medium text-gray-400">ahora mismo</span>. El % es sobre el total.{' '}
        <span className="text-accent-cyan">Pasa el cursor sobre el % para ver la explicación.</span>
      </p>

      <div className="space-y-3">
        {pipelineItems.map((item, index) => (
          <FunnelBar
            key={item.state}
            item={item}
            index={index}
            totalCount={totalCount}
            colorOffset={1}
            badgeValue={`${item.percentOfTotal.toFixed(1)}%`}
            badgeTitle="📍 ¿Qué muestra?"
            descriptions={PIPELINE_DESCRIPTIONS}
          />
        ))}
      </div>

      {/* Resumen de distribución */}
      <div className="mt-4 pt-3 border-t border-dark-600 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        <span><span className="text-gray-400 font-mono">{activeCount}</span> en pipeline activo</span>
        {negativeCount > 0 && <span><span className="text-accent-red/70 font-mono">{negativeCount}</span> salidas negativas</span>}
        {unaccounted > 0 && <span><span className="text-gray-500 font-mono">{unaccounted}</span> sin estado definido</span>}
        <span className="ml-auto text-gray-700">= {totalCount} total</span>
      </div>
    </div>
  );
}

// ─── Tendencias ───────────────────────────────────────────────────────────────
function TrendsCharts({ leadsByDay, revenueByWeek }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-4">Leads por día (últimos 30 días)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={leadsByDay}>
              <defs>
                <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00D9FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6E7681' }} tickFormatter={v => v.slice(5)} axisLine={{ stroke: '#30363D' }} />
              <YAxis tick={{ fontSize: 10, fill: '#6E7681' }} axisLine={{ stroke: '#30363D' }} />
              <Tooltip content={<CustomTooltip formatter={v => `${v} leads`} />} />
              <Area type="monotone" dataKey="leads" stroke="#00D9FF" strokeWidth={2} fill="url(#gradientLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {revenueByWeek.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-4">Ingresos por semana</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByWeek}>
                <defs>
                  <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#B24BF3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#B24BF3" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#6E7681' }} tickFormatter={v => v.slice(5)} axisLine={{ stroke: '#30363D' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6E7681' }} tickFormatter={v => `S/${v}`} axisLine={{ stroke: '#30363D' }} />
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

// ─── Distribución ─────────────────────────────────────────────────────────────
function DistributionCharts({ statusDistribution, districtDistribution, originDistribution }) {
  const renderDonut = (data, title) => {
    const top5 = data.slice(0, 5);
    const others = data.slice(5);
    const displayData = others.length > 0
      ? [...top5, { name: 'Otros', value: others.reduce((s, d) => s + d.value, 0) }]
      : top5;

    return (
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-4">{title}</h4>
        <div className="h-48 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={displayData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2}>
                {displayData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={formatNumber} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {displayData.slice(0, 4).map((item, i) => (
            <div key={item.name} className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="text-gray-400 truncate max-w-[80px]">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusDistribution.length > 0   && renderDonut(statusDistribution,  'Por Estado')}
      {districtDistribution.length > 0  && renderDonut(districtDistribution, 'Por Distrito')}
      {originDistribution.length > 0    && renderDonut(originDistribution,   'Por Origen')}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Charts({
  funnelData,
  pipelineData,
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
      <div className="flex border-b border-dark-600 mb-6 -mx-4 md:-mx-6 px-4 md:px-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap
              ${activeTab === tab.id
                ? tab.locked
                  ? 'border-accent-magenta text-accent-magenta'
                  : 'border-accent-cyan text-accent-cyan'
                : 'border-transparent text-gray-400 hover:text-gray-200'
              }
            `}
          >
            {tab.label}
            {tab.locked && <Lock className="w-3 h-3 opacity-60" />}
          </button>
        ))}
      </div>

      {activeTab === 'conversion' && <ConversionFunnel data={funnelData} />}
      {activeTab === 'pipeline' && (
        <div className="relative">
          <div className="blur-sm pointer-events-none select-none opacity-50">
            <PipelineView data={pipelineData} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 rounded-xl bg-dark-800/95 border border-accent-magenta/30 shadow-2xl max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-accent-magenta/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-accent-magenta" />
              </div>
              <h4 className="text-base font-semibold text-gray-100 mb-2">Pipeline Activo — PRO</h4>
              <p className="text-sm text-gray-400 mb-5">
                Ve exactamente dónde está cada lead ahora mismo y qué acción tomar para cerrar más ventas hoy.
              </p>
              <a
                href={UPGRADE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-magenta text-white text-sm font-semibold hover:bg-accent-magenta/80 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Solicitar acceso PRO
              </a>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'trends'     && <TrendsCharts leadsByDay={leadsByDay} revenueByWeek={revenueByWeek} />}
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
