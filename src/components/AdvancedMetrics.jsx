import { useState } from 'react';
import { Clock, UserX, CheckCircle, Receipt, MapPin, Calendar, Clock3, Lock, RefreshCw, ChevronDown, TrendingUp } from 'lucide-react';
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
      <div className="relative group no-print">
        <Card padding="sm" className="flex items-center gap-3 relative overflow-hidden">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 blur-sm select-none no-print" aria-hidden="true">
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
        {tooltip && (
          <div className="absolute left-0 bottom-full mb-2 z-20 w-64 p-3 rounded-lg bg-dark-900 border border-dark-500 shadow-xl text-xs text-gray-300 leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <p className="font-semibold text-gray-100 mb-1">💡 ¿Por qué importa?</p>
            <p>{tooltip}</p>
          </div>
        )}
      </div>
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
  const [expanded, setExpanded] = useState(true);

  const {
    avgTimeToSchedule,
    noShowRate,
    closeRate,
    avgTicket,
    bestDistrict,
    bestDay,
    peakHour,
  } = metrics;

  const collapsedSummary = [
    closeRate > 0 && `Cierre ${formatPercent(closeRate)}`,
    noShowRate > 0 && `No-Show ${formatPercent(noShowRate)}`,
    avgTicket > 0 && `Ticket ${formatCurrency(avgTicket)}`,
    bestDistrict && bestDistrict !== 'Desconocido' && `Top: ${bestDistrict}`,
  ].filter(Boolean).slice(0, 3).join(' · ');

  return (
    <Card>
      {/* Header con botón contraer */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-lg bg-accent-cyan/10 shrink-0">
            <TrendingUp className="w-5 h-5 text-accent-cyan" />
          </div>
          <h3 className="text-lg font-semibold text-gray-100 shrink-0">Métricas Avanzadas</h3>
          {!expanded && collapsedSummary && (
            <span className="text-xs text-gray-500 truncate ml-1 hidden sm:block">
              {collapsedSummary}
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-dark-600 transition-colors text-gray-400 hover:text-gray-200 shrink-0 ml-2"
          title={expanded ? 'Contraer métricas' : 'Expandir métricas'}
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`} />
        </button>
      </div>

      {/* Grid colapsable */}
      {expanded && (
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
            icon={Calendar}
            color="magenta"
            locked
            tooltip="Concentrar el presupuesto de ads en tu día peak puede reducir el costo por lead hasta un 30%. No es solo saber cuándo llegan más leads — es saber cuándo vale invertir más."
          />
          <MiniCard
            title="Hora Pico"
            icon={Clock3}
            color="orange"
            locked
            tooltip="Responder un lead en la primera hora tiene 7× más probabilidad de conversión que responder después de 2h. Saber tu hora pico garantiza que el equipo esté disponible exactamente cuando más importa."
          />
          <MiniCard
            title="Tasa Recuperación"
            icon={RefreshCw}
            color="cyan"
            locked
            tooltip="El 20-30% de los leads que no compraron pueden reactivarse con el enfoque correcto. Esta métrica mide qué retargeting está convirtiendo y cuántos ingresos se recuperaron que de otro modo se perderían."
          />
        </div>
      )}
    </Card>
  );
}
