import { useCallback, useMemo, useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
}

export function usePagination({
  initialPage = 0,
  initialPageSize = 10,
  totalItems,
}: UsePaginationOptions) {
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const pageCount = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize],
  );

  const currentPage = Math.min(pageIndex, Math.max(pageCount - 1, 0));

  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < pageCount - 1;

  const setPage = useCallback(
    (page: number) => {
      setPageIndex(Math.max(0, Math.min(page, Math.max(pageCount - 1, 0))));
    },
    [pageCount],
  );

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const previousPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const setPageSize = useCallback((size: number) => {
    if (size < 1) return;

    setPageSizeState(size);
    setPageIndex(0);
  }, []);

  const resetPagination = useCallback(() => {
    setPageIndex(0);
  }, []);

  const startIndex = totalItems === 0 ? 0 : currentPage * pageSize + 1;

  const endIndex = Math.min((currentPage + 1) * pageSize, totalItems);

  return {
    pageIndex: currentPage,
    pageSize,
    pageCount,
    totalItems,

    startIndex,
    endIndex,

    canPreviousPage,
    canNextPage,

    setPage,
    setPageSize,
    nextPage,
    previousPage,
    resetPagination,
  };
}
