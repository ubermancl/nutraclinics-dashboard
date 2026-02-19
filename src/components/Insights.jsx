import { Card } from './ui';

const insightStyles = {
  action: 'bg-blue-50 border-blue-200',
  insight: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
};

export default function Insights({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-lg border
              ${insightStyles[insight.type] || 'bg-gray-50 border-gray-200'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{insight.icon}</span>
              <p className="text-sm text-text-primary">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
