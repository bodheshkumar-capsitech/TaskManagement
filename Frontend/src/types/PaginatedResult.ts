export interface PaginatedResult<T>
{
    results: T[];
    total: number;
    pages: number;
    pagesize: number;

}