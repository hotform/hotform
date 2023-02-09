import * as Utils from './utils';

export type HotFormChangeEventHandler = React.ChangeEventHandler<any>;

export type HotFormFocusEventHandler = React.FocusEventHandler<any>;

export interface HotFormFormValidityEvent<T>{
  /** Hot form schema field values. */
  fieldValues: T;
  
  /** Function to update `submitting` state. */
  setSubmitting: Utils.SetStateWithCallback<boolean>;
}

export type HotFormFormValidityEventHandler<T> = (e: HotFormFormValidityEvent<T>) => void;

export type HotFormResetEventHandler<T> = (fieldValues: T) => void;