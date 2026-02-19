import { Sparkles, Lock } from 'lucide-react';
import { Card } from './ui';

const insightStyles = {
  action: 'border-accent-cyan/30 bg-accent-cyan/5',
  insight: 'border-accent-green/30 bg-accent-green/5',
  warning: 'border-warning/30 bg-warning/5',
};

export default function Insights({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  // Solo mostrar el primer insight visible, los demás difuminados
  const visibleInsight = insights[0];
  const lockedInsights = insights.slice(1, 4);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Insights bloqueados (freemium) */}
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
                <Lock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                <span className="text-xs text-gray-500">PRO</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA para upgrade */}
      {lockedInsights.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border border-accent-cyan/20">
          <p className="text-sm text-gray-300 text-center">
            <span className="text-accent-cyan font-medium">Desbloquea {lockedInsights.length} insights más</span>
            {' '}con el plan Pro
          </p>
        </div>
      )}
    </Card>
  );
}
