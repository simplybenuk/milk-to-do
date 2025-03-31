
interface MetricCardProps {
  label: string;
  value: number;
  className: string;
  textClassName: string;
}

function MetricCard({ label, value, className, textClassName }: MetricCardProps) {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <p className={`text-sm font-medium ${textClassName}`}>{label}</p>
      <p className={`mt-2 text-3xl font-bold ${textClassName}`}>{value}</p>
    </div>
  );
}

interface StatsMetricCardsProps {
  stats: {
    newTasksCount: number;
    completedCount: number;
    expiredCount: number;
    activeTasksCount: number;
  };
}

export function StatsMetricCards({ stats }: StatsMetricCardsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <MetricCard
        label="New Last Week"
        value={stats.newTasksCount}
        className="bg-blue-50"
        textClassName="text-blue-600"
      />
      <MetricCard
        label="Completed Last Week"
        value={stats.completedCount}
        className="bg-green-50"
        textClassName="text-green-600"
      />
      <MetricCard
        label="Expired Last Week"
        value={stats.expiredCount}
        className="bg-red-50"
        textClassName="text-red-600"
      />
      <MetricCard
        label="Total Active Tasks"
        value={stats.activeTasksCount}
        className="bg-gray-50"
        textClassName="text-gray-600"
      />
    </div>
  );
}
