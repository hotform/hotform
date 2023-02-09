import * as Events from './events';
import * as Schema from './schema';

export type ResetHotFormSchema = () => void;

export interface UseHotFormProps<T>{
  /** If set to `true`, the field that changes its value will be validated. By default `true` is used. */
  hotField?: boolean;
  
  /** Initial hot form schema. */
  initialSchema: Schema.HotFormSchema<T>;
  
  /** The `onInvalid` callback is executed when the field values are invalid and the form is submitted. */
  onInvalid?: Events.HotFormFormValidityEventHandler<T>;
  
  /** The `onValid` callback is executed when the form is reset. */
  onReset?: Events.HotFormResetEventHandler<T>;
  
  /** The `onValid` callback is executed when the field values are valid and the form is submitted. */
  onValid?: Events.HotFormFormValidityEventHandler<T>;
}

export interface UseHotFormReturnType<T>{
  /** Current hot form schema. */
  currentSchema: Schema.HotFormSchema<T>;
  
  /** Hot form focus event handler. */
  handleBlur: Events.HotFormFocusEventHandler;
  
  /** Hot form change event handler. */
  handleChange: Events.HotFormChangeEventHandler;
  
  /** Form reset event handler. */
  handleReset: React.FormEventHandler<HTMLFormElement>;
  
  /** Form submit event handler. */
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  
  /** Function to reset hot form schema. */
  resetHotFormSchema: ResetHotFormSchema;
  
  /** Function to set hot form field value. */
  setHotFormFieldValue: Schema.SetHotFormFieldValue<T>;
  
  /** `submitting` state. */
  submitting: boolean;
}