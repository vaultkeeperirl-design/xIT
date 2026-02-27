import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Standard update: pushes current to past, updates present, clears future
  const set = useCallback((newPresent: T | ((curr: T) => T)) => {
    setState((prevState) => {
      const resolvedPresent =
        typeof newPresent === 'function'
          ? (newPresent as (curr: T) => T)(prevState.present)
          : newPresent;

      if (resolvedPresent === prevState.present) {
        return prevState;
      }

      return {
        past: [...prevState.past, prevState.present],
        present: resolvedPresent,
        future: [],
      };
    });
  }, []);

  // Temporary update: updates present ONLY (no history recorded)
  // Useful for high-frequency updates like dragging
  const setTemp = useCallback((newPresent: T | ((curr: T) => T)) => {
    setState((prevState) => {
      const resolvedPresent =
        typeof newPresent === 'function'
          ? (newPresent as (curr: T) => T)(prevState.present)
          : newPresent;

      if (resolvedPresent === prevState.present) {
        return prevState;
      }

      return {
        ...prevState,
        present: resolvedPresent,
      };
    });
  }, []);

  // Snapshot: Manually push current state to history without changing it
  // Useful to call BEFORE starting a drag operation
  const snapshot = useCallback(() => {
    setState((prevState) => ({
      past: [...prevState.past, prevState.present],
      present: prevState.present,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.past.length === 0) return prevState;

      const previous = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prevState.present, ...prevState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.future.length === 0) return prevState;

      const next = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    state: state.present,
    set,
    setTemp,
    snapshot,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    historyState: state // Expose full state if needed for debugging
  };
}
