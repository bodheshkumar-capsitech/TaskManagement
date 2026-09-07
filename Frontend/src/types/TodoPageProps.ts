export interface TodoPageProps
{
    page: number;
    total: number;
    pageSize: number;
    onPage : (page:number,pagesize:number) => void;
    month: number;
    year: number;
    date: Date | null;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    onDateChange: (date: Date | null) => void;
}