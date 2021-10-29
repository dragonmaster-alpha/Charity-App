import { ActionCreator, bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Action } from 'deox';

export function useAction<T extends ActionCreator<Action<string>>>(action: T): T {
  const dispatch = useDispatch();
  return useMemo(() => bindActionCreators(action, dispatch), [dispatch]);
}

export function usePrevious<T>(value: T): T | void {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const useInfiniteScroll = (callback: () => void) => {
  const onEndReached = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    window.addEventListener('scroll', onEndReached);
    return () => window.removeEventListener('scroll', onEndReached);
  }, [onEndReached]);
};
