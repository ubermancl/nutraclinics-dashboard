import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Card } from './ui';

export default function Alerts({ alerts }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const errorAlerts = alerts.filter(a => a.type === 'error');
  const warningAlerts = alerts.filter(a => a.type === 'warning');

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning" />
          <span className="font-semibold text-text-primary">
            Alertas ({alerts.length})
          </span>
          {errorAlerts.length > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
              {errorAlerts.length} urgente{errorAlerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="border-t divide-y">
          {/* Alertas de error (urgentes) */}
          {errorAlerts.map((alert, index) => (
            <div
              key={`error-${index}`}
              className="p-4 bg-red-50 flex items-center gap-3"
            >
              <span className="text-lg">{alert.icon}</span>
              <span className="text-sm text-red-800 font-medium">
                {alert.message}
              </span>
            </div>
          ))}

          {/* Alertas de advertencia */}
          {warningAlerts.map((alert, index) => (
            <div
              key={`warning-${index}`}
              className="p-4 bg-amber-50 flex items-center gap-3"
            >
              <span className="text-lg">{alert.icon}</span>
              <span className="text-sm text-amber-800">
                {alert.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
