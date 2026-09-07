import type { Priority } from "./Priority";
import type { Todo } from "./Todo";

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, title: string,description: string,priority : Priority) => void;
}