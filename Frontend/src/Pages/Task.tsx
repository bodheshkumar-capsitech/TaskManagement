import {
    Badge,
    Card,
    Input,
    Body1,
    Spinner,
} from "@fluentui/react-components";
import {
    Search20Regular,
    CheckmarkCircle20Filled,
    CircleHalfFill20Filled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { gettaskswithprojectname } from "../api/todoApi";
import TaskPage from "../Component/TaskPage";
import { useQuery } from "@tanstack/react-query";
import type { ProjectWithTask } from "../types/Task/ProjectWithTask";
import { getTodosbyname } from "../api/todoApi";


const Task = () => {

    const [page, setPage] = useState(1);
    const [pagesize, setPagesize] = useState(30);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);


    const data = useQuery<ProjectWithTask>(
        {
            queryKey: ["tasks", page, pagesize],
            queryFn: () => gettaskswithprojectname(page, pagesize),
        }
    );

    const searchData = useQuery({
        queryKey: ["tasks-search", debouncedSearch],
        queryFn: () => getTodosbyname(debouncedSearch),
        enabled: debouncedSearch.trim().length > 0,
    });

    const isSearching = debouncedSearch.trim().length > 0;
    const displayedData = isSearching ? searchData.data : data.data;
    const displayedTasks = displayedData?.taskList ?? [];
    const loading = isSearching ? searchData.isFetching : data.isFetching;

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex sm:flex-row flex-col items-center justify-between gap-2">
                <Input
                    contentBefore={<Search20Regular />}
                    placeholder="Search tasks by title..."
                    value={search}
                    onChange={(_, data) => {
                        setSearch(data.value)
                    }}
                />
                <div className="flex flex-row w-full sm:w-1/2 items-center justify-between">
                    {!isSearching && (
                        <TaskPage
                            page={page}
                            pagesize={pagesize}
                            setPage={setPage}
                            total={data.data?.totalcount ?? 0}
                        />
                    )}
                    <Badge appearance="tint" className="!whitespace-nowrap !w-fit shrink-0">
                        {displayedData?.totalcount ?? 0} Tasks
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
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <Spinner size="medium" label="Loading tasks..." />
                            </div>
                        ) : (
                            
                                displayedTasks.length > 0 ? (
                                    displayedTasks.map((item) => (
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

                            )}
                    </div>

                </div>
            </Card>
        </div>
    );
};

export default Task;