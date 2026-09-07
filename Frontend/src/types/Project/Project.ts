import type { Priority } from "../Priority";
import type { Taskvalues } from "./Taskvalues";

export interface Project {
    id: string;
    userid: string;
    name: string;
    description: string;
    priority: Priority;
    status: Taskvalues;
    createdAt: string;
    UpdatedAt: string;
}