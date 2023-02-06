export type HotFormSchemaFieldValidator = (value: any) => boolean;

export type HotFormSchemaFieldParseValue = (value: any) => any;

export interface HotFormSchemaField<T>{
  parseValue?: HotFormSchemaFieldParseValue;
  valid?: boolean;
  validator?: HotFormSchemaFieldValidator;
  value: T;
}

export type HotFormSchema<T> = {
  [K in keyof T]: HotFormSchemaField<T[K]>;
};

export type SetHotFormFieldValue<T> = (key: keyof T, value: any) => void;