// src/hooks/useSort.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { setSort } from "@/features/table/tableSlice";
import type { SortDirection } from "@/features/table/tableSlice";

export function useSort() {
  const dispatch = useAppDispatch();
  const { sortBy, sortDir } = useAppSelector((s) => s.table);

  const setColumnSort = useCallback(
    (column: string) => {
      // cycle: null -> desc -> asc -> null (or choose your cycle)
      let next: SortDirection = "desc";
      if (sortBy === column) {
        if (sortDir === "desc") next = "asc";
        else if (sortDir === "asc") next = null;
        else next = "desc";
      } else {
        next = "desc";
      }
      dispatch(setSort({ sortBy: next ? column : "", sortDir: next }));
    },
    [dispatch, sortBy, sortDir]
  );

  return { sortBy, sortDir, setColumnSort };
}
