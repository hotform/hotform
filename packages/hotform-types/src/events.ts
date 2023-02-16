import * as Utils from './utils';

export type HotFormChangeEventHandler = React.ChangeEventHandler<any>;

export type HotFormEventHandler = React.FormEventHandler<HTMLFormElement>;

export type HotFormFocusEventHandler = React.FocusEventHandler<any>;

export interface HotFormValidityEvent<T>{
  /** Hot form schema field values. */
  fieldValues: T;
  
  /** Function to update `submitting` state. */
  setSubmitting: Utils.SetStateWithCallback<boolean>;
}

export type HotFormValidityEventHandler<T> = (e: HotFormValidityEvent<T>) => void;

export type HotFormResetEventHandler<T> = (fieldValues: T) => void;