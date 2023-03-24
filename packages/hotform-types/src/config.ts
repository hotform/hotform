import * as Events from './events';
import * as Schema from './schema';

export interface HotFormConfig<T>{
  /** If set to `true`, the field that changes its value will be validated. By default `true` is used. */
  hotField?: boolean;
  
  /**
   * Initial hot form schema.
   * 
   * Simple examples:
   * 
   * JavaScript
   * 
   * ```js
   * const userSchema = {
   *   password: {
   *     valid: true,
   *     validator: value => value.length,
   *     value: ''
   *   },
   *   username: {
   *     valid: true,
   *     validator: value => value.length,
   *     value: ''
   *   }
   * };
   * 
   * console.log(JSON.stringify(userSchema, null, 2));
   * ```
   * 
   * TypeScript
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
   *     validator: (value: string) => !!value.length,
   *     value: ''
   *   },
   *   username: {
   *     valid: true,
   *     validator: (value: string) => !!value.length,
   *     value: ''
   *   }
   * };
   * 
   * console.log(JSON.stringify(userSchema, null, 2));
   * ```
   * */
  initialSchema: Schema.HotFormSchema<T>;
  
  /** The `onInvalid` callback is executed when the field values are invalid and the form is submitted. */
  onInvalid?: Events.HotFormValidityEventHandler<T>;
  
  /** The `onReset` callback is executed when the form is reset. */
  onReset?: Events.HotFormResetEventHandler<T>;
  
  /** The `onValid` callback is executed when the field values are valid and the form is submitted. */
  onValid?: Events.HotFormValidityEventHandler<T>;
}