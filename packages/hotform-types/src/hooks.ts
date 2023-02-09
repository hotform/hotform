import * as Events from './events';
import * as Schema from './schema';

export type ResetHotFormSchema = () => void;

export interface UseHotFormProps<T>{
  /** If set to `true`, the field that changes its value will be validated. By default `true` is used. */
  hotField?: boolean;
  
  /**
   * Initial hot form schema.
   * 
   * Simple example:
   * 
   * ```ts
   * interface UserData{
   *   password: string;
   *   username: string;
   * }
   * 
   * const userSchema: HotFormSchema<UserData> = {
   *   password: {
   *     valid: true,
   *     validator: (value: string): boolean => !!value.length,
   *     value: ''
   *   },
   *   username: {
   *     valid: true,
   *     validator: (value: string): boolean => !!value.length,
   *     value: ''
   *   }
   * };
   * 
   * console.log(JSON.stringify(userSchema, null, 2));
   * ```
   * */
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
  resetSchema: ResetHotFormSchema;
  
  /** Function to set hot form field value. */
  setSchemaFieldValue: Schema.SetHotFormFieldValue<T>;
  
  /** `submitting` state. */
  submitting: boolean;
}