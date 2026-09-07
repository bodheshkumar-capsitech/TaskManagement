export interface TodoStatusProps
{
    status:boolean | null;
    setStatus: (status:boolean | null) => void;
}