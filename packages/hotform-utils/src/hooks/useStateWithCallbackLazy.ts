import React from 'react';

/* Types */
import {
  UseStateWithCallbackLazyCallback,
  SetStateWithCallback,
  UseStateWithCallbackLazyReturnType
} from '@hotform/types';

/** Returns a stateful value, and a function to update it. This function can receive a callback that will be called when the status is updated. */
const useStateWithCallbackLazy = <T>(initialState: T): UseStateWithCallbackLazyReturnType<T> => {
  const callbackRef = React.useRef<UseStateWithCallbackLazyCallback<T> | undefined>(undefined);
  
  const [ state, setState ] = React.useState(initialState);
  
  const setStateWithCallback: SetStateWithCallback<T> = React.useCallback((value, callback) => {
    callbackRef.current = callback;
    setState(value);
  }, []);
  
  React.useEffect(() => {
    if(callbackRef.current){
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [ state ]);
  
  return [ state, setStateWithCallback ];
}

export {
  UseStateWithCallbackLazyCallback,
  SetStateWithCallback,
  UseStateWithCallbackLazyReturnType
};

export default useStateWithCallbackLazy;