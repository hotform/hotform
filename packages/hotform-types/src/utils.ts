export type UseStateWithCallbackLazyCallback<T> = (value: T) => void;

export type SetStateWithCallback<T> = (value: T, callback?: UseStateWithCallbackLazyCallback<T>) => void;