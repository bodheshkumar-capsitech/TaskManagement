export const Task = {
    Pending: 0,
    InProgress: 1,
    Completed: 2,
} as const;

export type Taskvalues = typeof Task[keyof typeof Task];