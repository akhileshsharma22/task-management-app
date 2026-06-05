import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, errorMessage } from "../lib/api";

let cache = null;
let cachedAt = 0;
const cacheTtl = 30_000;

export function useAnalytics(refreshKey = 0) {
  const [analytics, setAnalytics] = useState(cache);
  const [loading, setLoading] = useState(!cache);

  const load = useCallback(async () => {
    if (cache && Date.now() - cachedAt < cacheTtl && !refreshKey) {
      setAnalytics(cache);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get("/analytics");
      cache = response.data.data;
      cachedAt = Date.now();
      setAnalytics(cache);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [refreshKey]);

  useEffect(() => { load(); }, [load]);
  return { analytics, loading };
}
