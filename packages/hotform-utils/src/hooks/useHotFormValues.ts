import React from 'react';

/* Types */
import {
  HotFormActionType,
  HotFormConfig,
  HotFormReducer,
  HotFormSchema,
  UseHotFormValuesReturnType
} from '@hotform/types';

/* Utils */
import {
  getHotFormSchemaFieldValues,
  parseInitialSchema,
  validateSchemaField
} from '../utils';

const useHotFormValues = <T>({
  hotField = true,
  initialSchema
}: Pick<HotFormConfig<T>, 'hotField' | 'initialSchema'>): UseHotFormValuesReturnType<T> => (
  React.useReducer<HotFormReducer<T>>((prevState, action) => {
    switch(action.type){
      case HotFormActionType.RESET_SCHEMA: {
        return {
          ...prevState,
          currentSchema: parseInitialSchema(initialSchema)
        };
      }
      case HotFormActionType.RUN_VALIDITY_EVENTS: {
        const currentSchemaKeys = Object.keys(prevState.currentSchema);
        
        const numberOfValidFields = currentSchemaKeys.reduce((previousValue, currentKey) => {
          const fieldName = currentKey as keyof HotFormSchema<T>;
          return +!!prevState.currentSchema[fieldName].valid + previousValue;
        }, 0);
        
        const validSchema = numberOfValidFields === currentSchemaKeys.length;
        
        const fieldValues = getHotFormSchemaFieldValues(prevState.currentSchema);
        
        if(validSchema){
          const callbackResult = action.payload.onValid?.({
            fieldValues,
            setSubmitting: action.payload.setSubmitting
          });
          if(callbackResult !== undefined){
            Promise.resolve(callbackResult).finally(action.payload.onFinally);
          }
        }else{
          action.payload.onInvalid?.({ fieldValues });
          action.payload.onFinally();
        }
        
        return { ...prevState };
      }
      case HotFormActionType.SET_SCHEMA_FIELD_VALUE: {
        const fieldName = action.payload.fieldName;
        const currentSchemaField = prevState.currentSchema[fieldName];
        if(currentSchemaField){
          currentSchemaField.value = action.payload.newFieldValue;
          if(hotField) validateSchemaField(prevState.currentSchema, fieldName);
        }
        return { ...prevState };
      }
      case HotFormActionType.SUBMITTED: {
        return {
          ...prevState,
          submitting: false
        };
      }
      case HotFormActionType.SUBMITTING: {
        return {
          ...prevState,
          submitting: true
        };
      }
      case HotFormActionType.VALIDATE_SCHEMA_FIELD: {
        validateSchemaField(prevState.currentSchema, action.payload.fieldName);
        return { ...prevState };
      }
      default: {
        throw new Error(`Unknown action: ${(action as any).type}`);
      }
    }
  }, {
    currentSchema: parseInitialSchema(initialSchema),
    submitting: false
  })
);

export {
  HotFormActionType,
  HotFormConfig,
  HotFormReducer,
  HotFormSchema,
  UseHotFormValuesReturnType
};

export default useHotFormValues;