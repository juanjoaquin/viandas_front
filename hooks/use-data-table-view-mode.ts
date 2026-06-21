"use client";

import { useCallback, useEffect, useState } from "react";

export type DataTableViewMode = "table" | "cards";

const STORAGE_KEY = "data-table-view-mode";

export function useDataTableViewMode() {
  const [viewMode, setViewModeState] = useState<DataTableViewMode>("table");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "table" || stored === "cards") {
      setViewModeState(stored);
    }
  }, []);

  const setViewMode = useCallback((mode: DataTableViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  return { viewMode, setViewMode };
}
