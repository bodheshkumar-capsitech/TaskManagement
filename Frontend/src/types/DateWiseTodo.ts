import type { Todo } from "./Todo";

export interface DateWiseTodo {
    date: string;
    tasks: Todo[];
}