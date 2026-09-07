import type { Priority } from "./Priority";
import type { PriorityInput } from "./PriorityInput";
import type { Todo } from "./Todo";

export interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string, description: string ,priority:Priority) => void;
  onSearch: (title : string) => void;
  onSearchFilter: (
    status: boolean | null,
    priority: Priority | null
  ) => void;
}