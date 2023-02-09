export type HotFormSchemaFieldValidator = (value: any) => boolean;

export type HotFormSchemaFieldParseValue = (value: any) => any;

export interface HotFormSchemaField<T>{
  /** Parses the value provided by `React.ChangeEvent<any>` to use as the current value of the field. In the case of arrays, it parses the value of each element of the array. */
  parseValue?: HotFormSchemaFieldParseValue;

  /** Indicates the current validity of the field. */
  valid?: boolean;

  /**
   * A custom validator function allowing you to apply your own validation rules.
   * 
   * **Note:** The validator will be called when the schema is initialized. This will cause a field to start out as valid or invalid. If you want to handle the initial validity state of a field, you can use the `valid` key.
   */
  validator?: HotFormSchemaFieldValidator;
  
  /** Indicates the current value of the field. */
  value: T;
}

export type HotFormSchema<T> = {
  [K in keyof T]: HotFormSchemaField<T[K]>;
};

export type SetHotFormFieldValue<T> = (key: keyof T, value: any) => void;