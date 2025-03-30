import { useEffect, useState } from "react";

export const usePersistentState = <T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // handle storage write failure if needed
    }
  }, [key, state]);

  return [state, setState];
};
