"use client";

import { Pagination as AntPagination } from "antd";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  total,
  pageSize,
  onPageChange,
  loading,
}: PaginationProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
      <AntPagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
        disabled={loading}
        showSizeChanger={false}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} de ${total} itens`
        }
      />
    </div>
  );
}
