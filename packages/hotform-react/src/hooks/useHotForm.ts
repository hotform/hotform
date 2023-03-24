import React from 'react';

/* Hooks */
import { useStateWithCallbackLazy } from '@hotform/utils';

/* Types */
import {
  GetHotFormSchemaFieldValues,
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormValidityEvent,
  HotFormSchema,
  ResetHotFormSchema,
  SetHotFormSchemaFieldValue,
  HotFormConfig,
  UseHotFormReturnType,
  ValidateHotFormSchemaField,
  ValidateAllHotFormSchemaFields
} from '@hotform/types';

const parseInitialSchema = <T>(schema: HotFormSchema<T>): HotFormSchema<T> => (
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

const useHotForm = <T>({
  hotField = true,
  initialSchema,
  onInvalid,
  onReset,
  onValid
}: HotFormConfig<T>): UseHotFormReturnType<T> => {
  const [ currentSchema, setCurrentSchema ] = React.useState(parseInitialSchema(initialSchema));
  const [ submitting, setSubmitting ] = useStateWithCallbackLazy(false);
  
  const getSchemaFieldValues: GetHotFormSchemaFieldValues<T> = React.useCallback(() => (
    Object.entries<HotFormSchema<T>[keyof T]>(currentSchema).reduce((previousValue, [ currentKey, currentSchemaField ]) => ({
      ...previousValue,
      [currentKey]: currentSchemaField.value
    }), {}) as T
  ), [ currentSchema ]);
  
  const resetSchema: ResetHotFormSchema = React.useCallback(() => {
    onReset?.(getSchemaFieldValues());
    setCurrentSchema(parseInitialSchema(initialSchema));
  }, [ getSchemaFieldValues, initialSchema, onReset ]);
  
  const validateSchemaField: ValidateHotFormSchemaField<T> = React.useCallback(fieldName => {
    const nextSchema = { ...currentSchema };
    const currentSchemaField = nextSchema[fieldName];
    if(!currentSchemaField) return false;
    if(currentSchemaField.validator){
      currentSchemaField.valid = currentSchemaField.validator(currentSchemaField.value);
      setCurrentSchema(nextSchema);
    }
    return !!currentSchemaField.valid;
  }, [ currentSchema ]);
  
  const setSchemaFieldValue: SetHotFormSchemaFieldValue<T> = React.useCallback((fieldName, newFieldValue) => {
    const nextSchema = { ...currentSchema };
    const currentSchemaField = nextSchema[fieldName];
    if(currentSchemaField){
      currentSchemaField.value = newFieldValue;
      setCurrentSchema(nextSchema);
      if(hotField) validateSchemaField(fieldName);
    }
  }, [ currentSchema, hotField, validateSchemaField ]);
  
  const validateAllSchemaFields: ValidateAllHotFormSchemaFields = React.useCallback(() => {
    let numberOfFields = 0;
    const numberOfValidFields = Object.keys(currentSchema).reduce((previousValue, currentKey) => {
      numberOfFields ++;
      return +validateSchemaField(currentKey as keyof HotFormSchema<T>) + previousValue;
    }, 0);
    return numberOfValidFields === numberOfFields;
  }, [ currentSchema, validateSchemaField ]);
  
  const handleBlur: HotFormFocusEventHandler = React.useCallback(e => {
    const fieldName = e.target.name as keyof HotFormSchema<T>;
    validateSchemaField(fieldName);
  }, [ validateSchemaField ]);
  
  const handleChange: HotFormChangeEventHandler = React.useCallback(e => {
    const nextSchema = { ...currentSchema };
    const fieldName = e.target.name as keyof HotFormSchema<T>;
    const currentSchemaField = nextSchema[fieldName];
    if(currentSchemaField){
      switch(e.target.type){
        case 'checkbox':
          if(Array.isArray(currentSchemaField.value)){
            const item = currentSchemaField.parseValue ? currentSchemaField.parseValue(e.target.value) : e.target.value;
            if(e.target.checked){
              currentSchemaField.value.push(item);
            }else{
              const index = currentSchemaField.value.indexOf(item);
              if(index > -1) currentSchemaField.value.splice(index, 1);
            }
          }else{
            currentSchemaField.value = e.target.checked;
          }
          break;
        case 'file':
          currentSchemaField.value = e.target.files[0] || null;
          break;
        case 'number':
        case 'range':
          currentSchemaField.value = currentSchemaField.parseValue ? currentSchemaField.parseValue(e.target.value) : Number(e.target.value) as any;
          break;
        case 'select-multiple':
          const selectedOptions: HTMLCollectionOf<HTMLOptionElement> = e.target.selectedOptions;
          currentSchemaField.value = Array.from(selectedOptions).map((option: HTMLOptionElement) => (
            currentSchemaField.parseValue ? currentSchemaField.parseValue(option.value) : option.value
          )) as any;
          break;
        default:
          currentSchemaField.value = currentSchemaField.parseValue ? currentSchemaField.parseValue(e.target.value) : e.target.value;
          break;
      }
      setCurrentSchema(nextSchema);
      if(hotField) validateSchemaField(fieldName);
    }
  }, [ currentSchema, hotField, validateSchemaField ]);
  
  const handleReset: HotFormEventHandler = React.useCallback(e => {
    e.preventDefault();
    resetSchema();
  }, [ resetSchema ]);
  
  const handleSubmit: HotFormEventHandler = React.useCallback(e => {
    e.preventDefault();
    const validityEvent: HotFormValidityEvent<T> = {
      fieldValues: getSchemaFieldValues(),
      setSubmitting
    };
    validateAllSchemaFields()
      ? setSubmitting(true, () => onValid?.(validityEvent))
      : onInvalid?.(validityEvent);
  }, [ getSchemaFieldValues, onInvalid, onValid, setSubmitting, validateAllSchemaFields ]);
  
  return {
    currentSchema,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    resetSchema,
    setSchemaFieldValue,
    submitting
  };
}

export {
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormValidityEvent,
  HotFormSchema,
  ResetHotFormSchema,
  SetHotFormSchemaFieldValue,
  HotFormConfig,
  UseHotFormReturnType
};

export default useHotForm;