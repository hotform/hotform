import * as Events from './events';
import * as Schema from './schema';
import * as Utils from './utils';

export interface UseHotFormReturnType<T> extends Utils.HotFormValues<T>{
  /** Hot form focus event handler. */
  handleBlur: Events.HotFormFocusEventHandler;
  
  /** Hot form change event handler. */
  handleChange: Events.HotFormChangeEventHandler;
  
  /** Form reset event handler. */
  handleReset: Events.HotFormEventHandler;
  
  /** Form submit event handler. */
  handleSubmit: Events.HotFormEventHandler;
  
  /** Function to reset hot form schema. */
  resetSchema: Schema.ResetHotFormSchema;
  
  /** Function to set hot form field value. */
  setSchemaFieldValue: Schema.SetHotFormSchemaFieldValue<T>;
}