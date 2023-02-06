import * as Utils from './utils';

export type HotFormChangeEventHandler = React.ChangeEventHandler<any>;

export type HotFormFocusEventHandler = React.FocusEventHandler<any>;

export interface HotFormFormValidityEvent<T>{
  fieldValues: T;
  setSubmitting: Utils.SetStateWithCallback<boolean>;
}

export type HotFormFormValidityEventHandler<T> = (e: HotFormFormValidityEvent<T>) => void;

export type HotFormResetEventHandler<T> = (fieldValues: T) => void;