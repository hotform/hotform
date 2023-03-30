/* Types */
import { HotFormSchema } from '@hotform/types';

export const getHotFormSchemaFieldValues = <T>(schema: HotFormSchema<T>): T => (
  Object.entries<HotFormSchema<T>[keyof T]>(schema).reduce((previousValue, [ currentKey, schemaField ]) => ({
    ...previousValue,
    [currentKey]: schemaField.value
  }), {}) as T
);

export const parseInitialSchema = <T>(schema: HotFormSchema<T>): HotFormSchema<T> => (
  Object.entries<HotFormSchema<T>[keyof T]>(schema).reduce((previousValue, [ currentKey, currentSchemaField ]) => ({
    ...previousValue,
    [currentKey]: {
      ...currentSchemaField,
      valid: currentSchemaField.valid === undefined ? (
        currentSchemaField.validator ? (
          currentSchemaField.validator(currentSchemaField.value)
        ) : true
      ) : currentSchemaField.valid
    }
  }), {}) as HotFormSchema<T>
);

export const validateSchemaField = <T>(currentSchema: HotFormSchema<T>, fieldName: keyof HotFormSchema<T>) => {
  const currentSchemaField = currentSchema[fieldName];
  if(!currentSchemaField) return false;
  if(currentSchemaField.validator){
    currentSchemaField.valid = currentSchemaField.validator(currentSchemaField.value);
  }
  return !!currentSchemaField.valid;
}