import { Text } from "@fluentui/react-components";
import { useMutation } from "@tanstack/react-query";
import { getalltaskcountbyPriority } from "../../api/todoApi";
import { useEffect, useState } from "react";
import type { TaskPriority } from "../../features/Dashboard/TaskPriority";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";


const TaskPriorityCard = () => {

  const [taskcountbypriority, setTaskcountbypriority] = useState<TaskPriority | null>(null)
  const stats = useSelector((state: RootState) => state.dashboard);
  const totalproject = stats.stats.totalProjects;
  const taskcountbypriorityMutation = useMutation(
    {
      mutationFn: async () => {
        return await getalltaskcountbyPriority();
      },

      onSuccess: (data) => {
        if (data === null) {
          console.log("Task count not found");
          return;
        }
        setTaskcountbypriority(data);
      },

      onError: () => {
        console.log("Failed to fount the task count");
      }
    }
  )


  useEffect(() => {
    taskcountbypriorityMutation.mutate();
  }, [])


  const totalTasks = taskcountbypriority
    ? taskcountbypriority.high +
    taskcountbypriority.medium +
    taskcountbypriority.low
    : 0;

  const averageTask =
    totalproject > 0
      ? totalTasks / totalproject
      : 0;

  const getPercent = (count: number) => {
    if (totalTasks === 0) return 0;

    return Math.round((count / totalTasks) * 100);
  };

  const chartData = taskcountbypriority
    ? [
      {
        priority: "High",
        tasks: taskcountbypriority.high,
        percentage: getPercent(taskcountbypriority.high),
      },
      {
        priority: "Medium",
        tasks: taskcountbypriority.medium,
        percentage: getPercent(taskcountbypriority.medium),
      },
      {
        priority: "Low",
        tasks: taskcountbypriority.low,
        percentage: getPercent(taskcountbypriority.low),
      },
    ]
    : [];


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

      <Text weight="semibold" block className="mb-4">
        Task Priority
      </Text>

      {taskcountbypriority ? (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="priority"
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "#F9FAFB" }}
                formatter={(value, name, props) => [
                  `${value} tasks (${props.payload.percentage}%)`,
                  "Tasks",
                ]}
              />

              <Bar
                dataKey="tasks"
                barSize={8}
                radius={[0, 6, 6, 0]}
                animationDuration={1200}
              >
                {chartData.map((item) => (
                  <Cell
                    key={item.priority}
                    fill={
                      item.priority === "High"
                        ? "#EF4444"
                        : item.priority === "Medium"
                          ? "#EAB308"
                          : "#22C55E"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          Loading task statistics...
        </div>
      )}


      <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col gap-2">
        <span className="text-xs font-medium uppercase text-gray-400">
          Task Aggregates
        </span>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Total tasks
          </span>
          <span className="font-semibold">
            {totalTasks}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            High priority tasks
          </span>
          <span className="font-semibold">
            {taskcountbypriority?.high ?? 0}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Medium priority tasks
          </span>
          <span className="font-semibold">
            {taskcountbypriority?.medium ?? 0}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Low priority tasks
          </span>
          <span className="font-semibold">
            {taskcountbypriority?.low ?? 0}
          </span>
        </div>

        {/* <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Min tasks / project
          </span>
          <span className="font-semibold">
            {minTasksPerProject}
          </span>
        </div> */}

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Avg tasks / project
          </span>
          <span className="font-semibold">
            {Math.round(averageTask)}
          </span>
        </div>

      </div>

    </div>
  );
};

export default TaskPriorityCard;