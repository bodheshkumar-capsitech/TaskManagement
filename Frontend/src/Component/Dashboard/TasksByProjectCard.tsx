import { Body1, Text } from "@fluentui/react-components";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Taskbyprojectstats } from "../../types/Dashboard/TaskbyProjectstats";
import { gettaskbyProjectStats } from "../../api/todoApi";
import { setTaskStats } from "../../features/Dashboard/taskbyprojectstatSlice";
import { useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


interface TasksByProjectCardProps {
  maxValue?: number;
}

const TasksByProjectCard = ({ maxValue }: TasksByProjectCardProps) => {
  const [taskstats, setTaskstat] = useState<Taskbyprojectstats[]>([]);
  const dispatch = useDispatch();

  const taskbyprojectMutation = useMutation({
    mutationFn: async () => {
      return await gettaskbyProjectStats();
    },

    onSuccess: (data) => {
      setTaskstat(data);
      dispatch(setTaskStats(data))
    },

    onError: (error) => {
      console.error("Failed to get project task statistics", error);
      setTaskstat([]);
    },
  });

  useEffect(() => {
    taskbyprojectMutation.mutate();
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <Text weight="semibold" block className="mb-4">Tasks by Project</Text>
      {taskstats.length > 0 ? (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskstats}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#9CA3AF",
                }}
                tickFormatter={(value) =>
                  value.length > 10
                    ? `${value.substring(0, 10)}...`
                    : value
                }
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#9CA3AF",
                }}
              />

              <Tooltip
                cursor={{ fill: "#F9FAFB" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{
                  fontWeight: 600,
                  color: "#111827",
                  marginBottom: "4px",
                }}
                formatter={(value, name) => [
                  `${value} tasks`,
                  name,
                ]}
              />

              <Bar
                dataKey="totaltasks"
                name="Total"
                fill="#A5B4FC"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
              <Bar
                dataKey="completedtasks"
                name="Completed"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>
      ) :

        (
          <div className="flex h-full items-center justify-center">
            <Body1 className="text-gray-800">
              No tasks found
            </Body1>
          </div>
        )
      }
      {taskstats.length > 0 &&
        <div className="flex items-center gap-4 justify-end mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-300" /> Total</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Completed</span>
        </div>
      }
    </div>
  );
};

export default TasksByProjectCard;