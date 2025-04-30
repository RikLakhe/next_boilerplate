export interface TablePaginationParams {
  pagination: {
    currentPage: number;
    limit?: number;
    total: number;
  };
}

export type NotificationType = "success" | "info" | "warning" | "error";
