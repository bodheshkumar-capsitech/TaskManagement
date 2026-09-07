export interface ProjectPageProps {
  page: number;
  total: number;
  pageSize: number;
  onPage: (page: number, pageSize: number) => void;
  year: number;
  month: number;

  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}