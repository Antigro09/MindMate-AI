import { useEffect, useRef, useState } from "react";
import { load, save } from "@/lib/storage";

export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const hydrated = useRef(false);

  useEffect(() => {
    let cancelled = false;

    load<T>(key).then((stored) => {
      if (cancelled) return;
      if (stored !== undefined) {
        setState(stored);
      }
      hydrated.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    save(key, state).catch(() => {});
  }, [key, state]);

  return [state, setState] as const;
}