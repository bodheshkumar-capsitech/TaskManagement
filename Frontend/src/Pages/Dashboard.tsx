import { useState,useEffect } from "react";
import {
  FolderRegular,
  ArrowTrendingRegular,
  CheckmarkCircleRegular,
  ClockRegular,
} from "@fluentui/react-icons";
import DashboardHeader from "../Component/Layout/DashboardHeader";
import StatsRow from "../Component/Dashboard/StatsRow";
import TaskStatusCard from "../Component/Dashboard/TaskStatusCard";
import TasksByProjectCard from "../Component/Dashboard/TasksByProjectCard";
import TaskPriorityCard from "../Component/Dashboard/TaskPriorityCard";
import RecentProjectsCard from "../Component/Dashboard/RecentProjectsCard";
import { getdashboardStats } from "../api/todoApi";
import { useDispatch,useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { setDashboardStats } from "../features/Dashboard/dashboardSlice";



const Dashboard = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  var dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state: RootState) => state.dashboard);


   const stat = [
  { label: "Total Projects", value: stats.totalProjects, sub: null, icon: FolderRegular, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  { label: "Active Projects", value: stats.activeProjects, sub: null, icon: ArrowTrendingRegular, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { label: "Total Tasks", value: stats.totalTasks, sub: null, icon: CheckmarkCircleRegular, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { label: "Completed Tasks", value: stats.completedTasks, sub: null, subColor: "text-green-600", icon: CheckmarkCircleRegular, iconBg: "bg-green-50", iconColor: "text-green-600" },
  { label: "Pending Tasks", value: stats.pendingTasks, sub: null, icon: ClockRegular, iconBg: "bg-orange-50", iconColor: "text-orange-600" },
];

const taskStatus = [
  { label: "Completed", value: stats.completedTasks, color: "#22c55e" },
  // { label: "In Progress", value: stats.totalTasks - (stats.completedTasks+stats.pendingTasks), color: "#4f46e5" },
  { label: "Pending", value: stats.pendingTasks, color: "#9ca3af" },
];


  useEffect(() =>
  {
    getdashboarddata()
  },[])

  const getdashboarddata = async () =>
  {
    try{
      var data = await getdashboardStats();
      if(data == null)
      {
        console.log("dashboard data not found");
        return;
      }

      dispatch(setDashboardStats(data))
    }

    catch
    {
      console.log("Failed to fetch dashboard data")
    }
  }
 

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff] overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="shrink-0">
        {/* <DashboardHeader
          title="Dashboard"
          subtitle="Overview of your projects and tasks"
          // isNavOpen={isNavOpen}
          // onOpenNav={() => setIsNavOpen(true)}
          /> */}
          </div>

        <div className="flex-1 bg-gradient-to-br from-slate-50 via-[#f5f6fa] to-[#eef2ff] overflow-y-auto overflow-x-hidden p-6 flex flex-col gap-6 hide-scrollbar">
          <StatsRow stats={stat} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskStatusCard data={taskStatus} />
            <TasksByProjectCard maxValue={20} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskPriorityCard />
            <RecentProjectsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;