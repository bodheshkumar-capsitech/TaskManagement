import {
    Badge,
    Card,
    Input,
    Body1,
} from "@fluentui/react-components";
import {
    Search20Regular,
    CheckmarkCircle20Filled,
    CircleHalfFill20Filled,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { gettaskswithprojectname } from "../api/todoApi";
import TaskPage from "../Component/TaskPage";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { setTasks, clearTasks } from "../features/Task/taskSlice";
import { useQuery } from "@tanstack/react-query";
import type { ProjectWithTask } from "../types/Task/ProjectWithTask";


const Task = () => {

    const [page, setPage] = useState(1);
    const [pagesize, setPagesize] = useState(30);
    const dispatch = useDispatch();
    const taskdata = useSelector((state: RootState) => state.task.taskData)


    const data = useQuery<ProjectWithTask>(
        {
            queryKey: ["tasks", page, pagesize],
            queryFn: () => gettaskswithprojectname(page, pagesize),
        }
    );

    useEffect(() => {
        if (data.data) {
            dispatch(setTasks(data.data))
        }
    }, [data.data, dispatch]);


    return (
        <div className="flex h-full flex-col gap-6">

            <div className="flex sm:flex-row flex-col items-center justify-between gap-2">
                <Input
                    contentBefore={<Search20Regular />}
                    placeholder="Search tasks by title..."
                />
                <div className="flex flex-row w-full sm:w-1/2 items-center justify-between">
                <TaskPage page={page} pagesize={pagesize} setPage={setPage} total={taskdata.totalcount} />
                <Badge appearance="tint" className="!whitespace-nowrap !w-fit shrink-0">
                    {taskdata.totalcount} Tasks
                </Badge>
                </div>
            </div>

            <Card className="min-h-0 flex-1 overflow-hidden !rounded-2xl !p-0">
                <div className="h-full overflow-hidden hide-scrollbar">
                    <div className="hidden sticky top-0 z-10 sm:grid sm:grid-cols-[2fr_1.3fr_1fr_1fr_1fr] gap-4 border-b bg-white px-6 py-3">

                        <Body1 className="font-semibold">
                            Task
                        </Body1>

                        <Body1 className="font-semibold">
                            Project
                        </Body1>

                        <Body1 className="font-semibold">
                            Due Date
                        </Body1>

                        <Body1 className="font-semibold">
                            Priority
                        </Body1>

                        <Body1 className="font-semibold">
                            Status
                        </Body1>
                    </div>
                    <div className="h-full overflow-y-auto hide-scrollbar">
                        {taskdata.taskList.length > 0 ? (
                            taskdata.taskList.map((item) => (

                                <div key={item.task.id} className="flex flex-col items-start justify-center sm:grid sm:grid-cols-[2fr_1.3fr_1fr_1fr_1fr] sm:items-center gap-4 border-b px-6 py-4 transition hover:bg-gray-50">
                                    <div className="flex min-w-0 items-center gap-3">
                                        {item.task.completed ? <CheckmarkCircle20Filled className="shrink-0 text-green-500" /> : <CircleHalfFill20Filled className="shrink-0 text-yellow-500" />}
                                        <div className="min-w-0">
                                            <Body1 className={item.task.completed ? "line-through block truncate font-semibold" : "block truncate font-semibold"}>
                                                {item.task.title}
                                            </Body1>

                                            <span className={item.task.completed ? " block truncate text-xs  text-gray-500 line-through" : "block truncate text-xs text-gray-500"}>
                                                {item.task.description}
                                            </span>
                                        </div>
                                    </div>
                                    <Body1>{item.name}</Body1>
                                    <Body1>{item.task.duedate ? new Date(item.task.duedate).toISOString().split("T")[0] : ""}</Body1>
                                    <Badge appearance="tint" color={item.task.priority === "Low" ? "success" : item.task.priority === "Medium" ? "warning" : "danger"} className="w-fit">
                                        {item.task.priority}
                                    </Badge>
                                    <Badge appearance="tint" color={item.task.completed ? "success" : "danger"} className="w-fit">
                                        {item.task.completed ? "Completed" : "Pending"}
                                    </Badge>
                                </div>

                            ))) :
                            <div className="flex h-full overflow-hidden items-center justify-center">
                                <Body1 className="text-gray-800">
                                    No tasks found
                                </Body1>
                            </div>

                        }
                    </div>

                </div>
            </Card>
        </div>
    );
};

export default Task;