import type { Todo } from "../Todo";

export interface ProjectWithTask
{
    totalcount: number,
    taskList: ProjectTask[]
}


export interface ProjectTask
{
    name: string,
    task: Todo
}