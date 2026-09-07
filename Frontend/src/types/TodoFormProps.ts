import type { Priority } from "./Priority";

export interface TodoFormProps {
  onAdd: (title: string,description: string, priority: Priority,duedate: Date | null,projectId: string) => void;
}