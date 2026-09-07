import StatCard, { type StatCardProps } from "./StatCard";

interface StatsRowProps {
  stats: StatCardProps[];
}

const StatsRow = ({ stats }: StatsRowProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
};

export default StatsRow;