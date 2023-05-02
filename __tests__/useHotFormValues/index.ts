/* HotForm */
import {
  useHotFormValues,
  HotFormActionType,
  HotFormConfig,
  HotFormSchema
} from '@hotform/utils';

/* Testing Library */
import {
  act,
  renderHook,
  waitFor
} from '@testing-library/react';

interface FormData{
  ticketNumber: number;
  username: string;
}

const initialSchema: HotFormSchema<FormData> = {
  ticketNumber: {
    value: 0,
    parseValue: Number
  },
  username: {
    value: '',
    validator: value => !!value
  }
};

const initialSchemaFieldNames = Object.keys(initialSchema) as Array<keyof HotFormSchema<FormData>>;

const renderUseHotFormValues = (initialProps: HotFormConfig<FormData>) => renderHook((config) => {
  const [ state, dispatch ] = useHotFormValues(config);
  return {
    state,
    dispatch
  };
}, {
  initialProps
});

describe('useHotFormValues', () => {
  it('MUST initialize the HotForm schema', () => {
    const { result } = renderUseHotFormValues({ initialSchema });
    
    initialSchemaFieldNames.forEach(fieldName => {
      const currentSchemaField = result.current.state.currentSchema[fieldName];
      const initialSchemaField = initialSchema[fieldName];
      
      expect(currentSchemaField.value).toBe(initialSchemaField.value);
    });
  });
  
  it('SHOULD run validators by default. If they exist', () => {
    const { result } = renderUseHotFormValues({ initialSchema });
    
    initialSchemaFieldNames.forEach(fieldName => {
      const currentSchemaField = result.current.state.currentSchema[fieldName];
      const initialSchemaField = initialSchema[fieldName];
      
      if(initialSchemaField.valid === undefined){
        const expected = initialSchemaField.validator ? initialSchemaField.validator(initialSchemaField.value) : true;
        
        expect(currentSchemaField.valid).toBe(expected);
      }else{
        expect(currentSchemaField.valid).toBe(!!initialSchemaField.valid);
      }
    });
  });
  
  describe('RESET_SCHEMA', () => {
    it('SHOULD reset schema when action is dispatched', () => {
      const nextFieldValues: FormData = {
        ticketNumber: 100,
        username: 'foo'
      };
      const { result } = renderUseHotFormValues({ initialSchema });
      
      Object.entries(nextFieldValues).forEach(([ key, value ]) => {
        act(() => result.current.dispatch({
          payload: {
            fieldName: key as keyof HotFormSchema<FormData>,
            newFieldValue: value
          },
          type: HotFormActionType.SET_SCHEMA_FIELD_VALUE
        }));
      });
      
      act(() => result.current.dispatch({
        type: HotFormActionType.RESET_SCHEMA
      }));
      
      initialSchemaFieldNames.forEach(fieldName => {
        const currentSchemaField = result.current.state.currentSchema[fieldName];
        const initialSchemaField = initialSchema[fieldName];
        
        expect(currentSchemaField.value).toBe(initialSchemaField.value);
        
        if(initialSchemaField.valid === undefined){
          const expected = initialSchemaField.validator ? initialSchemaField.validator(initialSchemaField.value) : true;
          
          expect(currentSchemaField.valid).toBe(expected);
        }else{
          expect(currentSchemaField.valid).toBe(!!initialSchemaField.valid);
        }
      });
    });
  });
  
  describe('RUN_VALIDITY_EVENTS', () => {
    it('SHOULD call `onInvalid` if `onInvalid` callback is set and the field values are invalid and the payload is `true`', async () => {
      const onInvalid = jest.fn();
      const { result } = renderUseHotFormValues({
        initialSchema,
        onInvalid
      });
      
      act(() => result.current.dispatch({
        payload: true,
        type: HotFormActionType.RUN_VALIDITY_EVENTS
      }));
      
      await waitFor(() => expect(onInvalid).toHaveBeenCalledWith({
        fieldValues: {
          ticketNumber: initialSchema.ticketNumber.value,
          username: initialSchema.username.value
        }
      }));
    });
    
    it('SHOULD call `onValid` if `onValid` callback is set and the field values are valid and the payload is `true`', async () => {
      const onValid = jest.fn();
      const { result } = renderUseHotFormValues({
        initialSchema,
        onValid
      });
      const expectedFieldValues: FormData = {
        ticketNumber: 100,
        username: 'foo'
      };
      
      Object.entries(expectedFieldValues).forEach(([ key, value ]) => {
        act(() => result.current.dispatch({
          payload: {
            fieldName: key as keyof HotFormSchema<FormData>,
            newFieldValue: value
          },
          type: HotFormActionType.SET_SCHEMA_FIELD_VALUE
        }));
      });
      
      act(() => result.current.dispatch({
        payload: true,
        type: HotFormActionType.RUN_VALIDITY_EVENTS
      }));
      
      await waitFor(() => expect(onValid).toHaveBeenCalledWith({
        fieldValues: expectedFieldValues,
        setSubmitting: expect.any(Function)
      }));
    });
  });  
});