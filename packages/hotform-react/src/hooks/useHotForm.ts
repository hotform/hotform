import React from 'react';

/* Types */
import {
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormActionType,
  HotFormValidityEvent,
  HotFormSchema,
  HotFormConfig,
  UseHotFormReturnType
} from '@hotform/types';

/* Utils */
import {
  getHotFormSchemaFieldValues,
  useEventHandler,
  useHotFormValues
} from '@hotform/utils';

const useHotForm = <T>({
  hotField = true,
  initialSchema,
  onInvalid,
  onReset,
  onValid
}: HotFormConfig<T>): UseHotFormReturnType<T> => {
  const [ state, dispatch ] = useHotFormValues({
    hotField,
    initialSchema
  });
  
  const resetSchema: UseHotFormReturnType<T>['resetSchema'] = React.useCallback(() => {
    onReset?.(getHotFormSchemaFieldValues(state.currentSchema));
    dispatch({
      type: HotFormActionType.RESET_SCHEMA
    });
  }, [ onReset, state.currentSchema ]);
  
  const setSchemaFieldValue: UseHotFormReturnType<T>['setSchemaFieldValue'] = React.useCallback((fieldName, newFieldValue) => {
    dispatch({
      payload: {
        fieldName,
        newFieldValue
      },
      type: HotFormActionType.SET_SCHEMA_FIELD_VALUE
    });
  }, []);
  
  const handleBlur: UseHotFormReturnType<T>['handleBlur'] = useEventHandler(e => {
    dispatch({
      payload: {
        fieldName: e.target.name as keyof HotFormSchema<T>
      },
      type: HotFormActionType.VALIDATE_SCHEMA_FIELD
    });
  });
  
  const handleChange: UseHotFormReturnType<T>['handleChange'] = useEventHandler(e => {
    const fieldName = e.target.name as keyof HotFormSchema<T>;
    const currentSchemaField = { ...state.currentSchema[fieldName] };
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
      setSchemaFieldValue(fieldName, currentSchemaField.value);
    }
  });
  
  const handleReset: UseHotFormReturnType<T>['handleReset'] = useEventHandler(e => {
    e.preventDefault();
    resetSchema();
  });
  
  const handleSubmit: UseHotFormReturnType<T>['handleSubmit'] = useEventHandler(e => {
    e.preventDefault();
    dispatch({
      type: HotFormActionType.SUBMITTING
    });
    Object.keys(state.currentSchema).forEach(currentKey => {
      const fieldName = currentKey as keyof HotFormSchema<T>;
      dispatch({
        payload: {
          fieldName
        },
        type: HotFormActionType.VALIDATE_SCHEMA_FIELD
      });
    });
    dispatch({
      type: HotFormActionType.RUN_VALIDITY_EVENTS,
      payload: {
        setSubmitting(value){
          dispatch({
            type: value ? HotFormActionType.SUBMITTING : HotFormActionType.SUBMITTED
          });
        },
        onFinally(){
          dispatch({
            type: HotFormActionType.SUBMITTED
          });
        },
        onInvalid,
        onValid
      }
    });
  });
  
  return {
    currentSchema: state.currentSchema,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    resetSchema,
    setSchemaFieldValue,
    submitting: state.submitting
  };
}

export {
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormValidityEvent,
  HotFormSchema,
  HotFormConfig,
  UseHotFormReturnType
};

export default useHotForm;