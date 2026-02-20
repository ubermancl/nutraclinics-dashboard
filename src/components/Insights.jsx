import { Sparkles, Lock, Mail } from 'lucide-react';
import { Card } from './ui';

const insightStyles = {
  action: 'border-accent-cyan/30 bg-accent-cyan/5',
  insight: 'border-accent-green/30 bg-accent-green/5',
  warning: 'border-warning/30 bg-warning/5',
};

// Insights premium que siempre aparecen bloqueados
const PREMIUM_INSIGHTS = [
  { icon: '🎯', message: 'Canal con mayor ROI este mes y recomendación de presupuesto' },
  { icon: '⏱️', message: 'Ventana de tiempo óptima para contactar nuevos leads y aumentar respuesta' },
  { icon: '🔄', message: 'Segmento con mayor probabilidad de recompra en los próximos 30 días' },
  { icon: '📊', message: 'Predicción de leads para la próxima semana basada en tendencias históricas' },
];

export default function Insights({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const visibleInsight = insights[0];
  // Combinamos insights reales (bloqueados) con los premium estáticos, hasta 4
  const dynamicLocked = insights.slice(1, 3);
  const premiumSlots = PREMIUM_INSIGHTS.slice(0, 4 - dynamicLocked.length);
  const lockedInsights = [
    ...dynamicLocked.map(i => ({ ...i, isPremium: false })),
    ...premiumSlots.map(i => ({ ...i, isPremium: true })),
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent-magenta/10">
          <Sparkles className="w-5 h-5 text-accent-magenta" />
        </div>
        <h3 className="text-lg font-semibold text-gray-100">
          Insights
        </h3>
        <span className="text-xs px-2 py-0.5 bg-accent-magenta/20 text-accent-magenta rounded-full">
          IA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Insight visible */}
        <div
          className={`
            p-4 rounded-lg border
            ${insightStyles[visibleInsight.type] || 'border-dark-600 bg-dark-700/50'}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{visibleInsight.icon}</span>
            <p className="text-sm text-gray-200">{visibleInsight.message}</p>
          </div>
        </div>

        {/* Insights bloqueados */}
        {lockedInsights.map((insight, index) => (
          <div
            key={index}
            className="relative p-4 rounded-lg border border-dark-600 bg-dark-700/30 overflow-hidden"
          >
            {/* Contenido difuminado */}
            <div className="blurred-content">
              <div className="flex items-start gap-3">
                <span className="text-xl">{insight.icon}</span>
                <p className="text-sm text-gray-400">{insight.message}</p>
              </div>
            </div>

            {/* Overlay con candado */}
            <div className="absolute inset-0 flex items-center justify-center bg-dark-800/60 backdrop-blur-[2px]">
              <div className="text-center">
                <Lock className="w-5 h-5 text-accent-magenta/60 mx-auto mb-1" />
                <span className="text-xs text-gray-500 font-medium">PRO</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA para upgrade */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border border-accent-magenta/20 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-gray-300">
          <span className="text-accent-magenta font-semibold">Desbloquea {lockedInsights.length} insights más</span>
          {' '}— análisis avanzados con IA para optimizar tus ventas
        </p>
        <a
          href="mailto:contacto@innovarketing.com"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-accent-magenta/20 text-accent-magenta hover:bg-accent-magenta/30 transition-colors whitespace-nowrap shrink-0"
        >
          <Mail className="w-3 h-3" />
          contacto@innovarketing.com
        </a>
      </div>
    </Card>
  );
}
