import React from 'react'

/* Types */
import type { UseEventHandlerFunction } from '@hotform/types'

const useEventHandler = <T extends UseEventHandlerFunction>(handler: T): T => {
  const handlerRef = React.useRef<T | null>(null)

  React.useLayoutEffect(() => {
    handlerRef.current = handler
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return React.useCallback(
    (...args: Array<any>) => handlerRef.current?.(...args),
    [],
  ) as T
}

export type { UseEventHandlerFunction }

export default useEventHandler
