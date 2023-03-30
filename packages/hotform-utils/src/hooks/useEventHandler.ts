import React from 'react';

/* Types */
import { UseEventHandlerFunction } from '@hotform/types';

const useEventHandler = <T extends UseEventHandlerFunction>(handler: T): T => {
  const handlerRef = React.useRef<T | null>(null);
  
  React.useLayoutEffect(() => {
    handlerRef.current = handler;
  }, []);
  
  return React.useCallback((...args: any[]) => handlerRef.current?.(...args), []) as T;
}

export {
  UseEventHandlerFunction
};

export default useEventHandler;