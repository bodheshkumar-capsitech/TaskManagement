import { Text } from "@fluentui/react-components";
import type { FluentIcon } from "@fluentui/react-icons";

export interface StatCardProps {
  label: string;
  value: number;
  sub?: string | null;
  subColor?: string;
  icon: FluentIcon;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({ label, value, sub, subColor, icon: Icon, iconBg, iconColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
        <div className={`${iconBg} rounded-full p-2`}>
          <Icon className={iconColor} fontSize={18} />
        </div>
      </div>
      <Text weight="bold" size={700} block>{value}</Text>
      {sub && <Text size={200} className={subColor ?? "text-gray-400"}>{sub}</Text>}
    </div>
  );
};

export default StatCard;