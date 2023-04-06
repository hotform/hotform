export type HotFormChangeEventHandler = React.ChangeEventHandler<any>;

export type HotFormEventHandler = React.FormEventHandler<HTMLFormElement>;

export type HotFormFocusEventHandler = React.FocusEventHandler<any>;

export interface HotFormValidityEvent<T>{
  /** HotForm schema field values. */
  fieldValues: T;
  
  /** Function to update `submitting` state. */
  setSubmitting: (value: boolean) => void;
}

export type HotFormInvalidityEventHandler<T> = (e: Pick<HotFormValidityEvent<T>, 'fieldValues'>) => void;

export type HotFormValidityEventHandler<T> = (e: HotFormValidityEvent<T>) => void;

export type HotFormResetEventHandler<T> = (fieldValues: T) => void;