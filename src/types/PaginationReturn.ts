export interface PaginationReturn{
    data: Array<Object>;
    next_page: number|null;
    previous_page: number|null;
    current_page: number;
    total_count: number
}