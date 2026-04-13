"use client";

// Purpose: This module handles reports logic and UI.

import { useEffect, useState } from "react";
import { getReportSummary } from "../services/reportsService";

// Expose reusable reports logic for other modules.
export function useReportSummary() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getReportSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message || "Failed to load report summary.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return {
    summary,
    isLoading,
    error,
    refresh: loadSummary,
  };
}

