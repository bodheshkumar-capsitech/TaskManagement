import type { Priority } from "../Priority";
import type { Taskvalues } from "./Taskvalues";

export interface ProjectFormProps {
  name: string;
  description: string;
  priority: Priority;
  status: Taskvalues;
  editingId: string | null;
  loading: boolean;
  error: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
  onStatusChange: (value: Taskvalues) => void;
  onSubmit: () => void;
  onCancel: () => void;
}