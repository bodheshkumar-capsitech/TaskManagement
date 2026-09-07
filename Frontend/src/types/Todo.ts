import type { Priority } from "./Priority";

export interface Todo {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    duedate: Date | null;
    completed: boolean;
    projectId: string;
}