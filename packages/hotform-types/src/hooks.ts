import * as Events from './events';
import * as Schema from './schema';

export type ResetHotFormSchema = () => void;

export interface UseHotFormProps<T>{
  hotField?: boolean;
  initialSchema: Schema.HotFormSchema<T>;
  onInvalid?: Events.HotFormFormValidityEventHandler<T>;
  onReset?: Events.HotFormResetEventHandler<T>;
  onValid?: Events.HotFormFormValidityEventHandler<T>;
};

export interface UseHotFormReturnType<T>{
  currentSchema: Schema.HotFormSchema<T>;
  handleBlur: React.FocusEventHandler;
  handleChange: Events.HotFormChangeEventHandler;
  handleReset: React.FormEventHandler<HTMLFormElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  resetForm: ResetHotFormSchema;
  setFieldValue: Schema.SetHotFormFieldValue<T>;
  submitting: boolean;
}