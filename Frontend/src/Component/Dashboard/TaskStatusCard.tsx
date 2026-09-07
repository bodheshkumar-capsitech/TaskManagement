import { Text } from "@fluentui/react-components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TaskStatusItem {
  label: string;
  value: number;
  color: string;
}

interface TaskStatusCardProps {
  data: TaskStatusItem[];
}

const TaskStatusCard = ({ data }: TaskStatusCardProps) => {
  const total = data.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <Text weight="semibold" block className="mb-4">Task Status</Text>

      <div className="flex items-center gap-8">
        <div className="w-40 h-40 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell
                    key={item.label}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} tasks`,
                  name,
                ]}
                wrapperStyle={{
                  zIndex: 10,
                }}
                contentStyle={{
                  borderRadius: "20px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: "#FFFFFF",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-semibold text-gray-800">
              {total}
            </span>

            <span className="text-xs text-gray-500">
              Total Tasks
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data.map((s) => {
            const percent = Math.round((s.value / total) * 100);
            return (
              <div key={s.label} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-gray-700 w-24">{s.label}</span>
                <span className="text-gray-400">{s.value} ({percent}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusCard;