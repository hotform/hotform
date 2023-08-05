import type * as Events from './events'
import type * as Schema from './schema'
import type * as Utils from './utils'

export interface UseHotFormReturnType<T>
  extends Pick<Utils.HotFormValues<T>, 'currentSchema' | 'submitting'> {
  /** HotForm focus event handler. */
  handleBlur: Events.HotFormFocusEventHandler

  /** HotForm change event handler. */
  handleChange: Events.HotFormChangeEventHandler

  /** Form reset event handler. */
  handleReset: Events.HotFormEventHandler

  /** Form submit event handler. */
  handleSubmit: Events.HotFormEventHandler

  /** Function to reset HotForm schema. */
  resetSchema: Schema.ResetHotFormSchema

  /** Function to set HotForm field value. */
  setSchemaFieldValue: Schema.SetHotFormSchemaFieldValue<T>
}
