interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-3xl opacity-75">{icon}</span>
      </div>
    </div>
  );
}
