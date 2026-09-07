import { Body1, Button, Text } from "@fluentui/react-components";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RecentProjectsCard = () => {

  const taskstats = useSelector((state: RootState) => state.taskbyproject.taskstats)
  const navigate = useNavigate();

  const gotoProjectPage = () => {
    navigate("/ProjectPage");
  }

  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <Text weight="semibold">Recent Projects</Text>
        <Button appearance="transparent" size="small" onClick={gotoProjectPage}>
          View all →
        </Button>
      </div>

      {taskstats.length > 0 ? (
      <div className="flex flex-col gap-5">
          {taskstats.map((p) => {
            const total = Number(p.totaltasks);
            const completed = Number(p.completedtasks);
            
            const progress =
            total > 0
            ? (completed / total) * 100
            : 0;
            
            return (
              <div key={p.name}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${completed < total
                    ? "bg-indigo-600"
                    : "bg-gray-300"
                    }`}
                    />

                <Text weight="semibold" size={300}>
                  {p.name}
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-1000 ease-out"
                    style={{
                      width: animate
                      ? `${progress}%`
                      : "0%",
                    }}
                    />
                </div>
                <span className="text-xs text-gray-400 w-14 text-right">
                  {completed}/{total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      ): 
      (
        <div className="flex h-full items-center justify-center">
                <Body1 className="text-gray-800">
                    No projects found
                </Body1>
            </div>
      )}
    </div>
  );
};

export default RecentProjectsCard;