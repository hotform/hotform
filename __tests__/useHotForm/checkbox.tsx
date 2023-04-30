import React from 'react';

/* HotForm */
import {
  useHotForm,
  HotFormConfig,
  HotFormSchema,
  UseHotFormReturnType
} from '@hotform/react';

/* Testing Library */
import {
  fireEvent,
  getAllByRole,
  render,
  waitFor
} from '@testing-library/react';

const letterValues = [
  'A',
  'B',
  'C'
];

interface CheckboxFormData{
  active: boolean;
  letters: Array<string>;
}

const CheckboxForm: React.FC<UseHotFormReturnType<CheckboxFormData>> = ({
  currentSchema,
  handleBlur,
  handleChange,
  handleSubmit,
  submitting
}) => {
  return (
    <form
      data-testid="test-form"
      onSubmit={ handleSubmit }
    >
      <label>
        <input
          checked={ currentSchema.active.value }
          data-testid="active-input"
          name="active"
          onBlur={ handleBlur }
          onChange={ handleChange }
          type="checkbox"
        />
      </label>
      <div data-testid="letters-input-container">
        {
          letterValues.map((letter, index) => (
            <label key={ index }>
              <input
                checked={ !!currentSchema.letters.value.includes(letter) }
                data-value={ letter }
                name="letters"
                onBlur={ handleBlur }
                onChange={ handleChange }
                type="checkbox"
                value={ letter }
              />
            </label>
          ))
        }
      </div>
      <button
        data-testid="submit-button"
        disabled={ submitting }
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

const initialSchema: HotFormSchema<CheckboxFormData> = {
  active: {
    value: false
  },
  letters: {
    value: [],
    validator: (value: Array<string>) => !!value.length && value.every(v => letterValues.includes(v))
  }
};

const initialSchemaFieldNames = Object.keys(initialSchema) as Array<keyof HotFormSchema<CheckboxFormData>>;

const renderCheckboxForm = (config: HotFormConfig<CheckboxFormData>) => {
  const currentValue: Record<string, any> = {};
  
  const Renderer: React.FC = () => {
    const value = useHotForm(config);
    
    currentValue.currentSchema = value.currentSchema;
    currentValue.handleBlur = value.handleBlur;
    currentValue.handleChange = value.handleChange;
    currentValue.handleReset = value.handleReset;
    currentValue.handleSubmit = value.handleSubmit;
    currentValue.resetSchema = value.resetSchema;
    currentValue.setSchemaFieldValue = value.setSchemaFieldValue;
    currentValue.submitting = value.submitting;
    
    return (
      <CheckboxForm { ...value }/>
    );
  }
  
  const renderResult = render(<Renderer/>);
  
  return {
    ...renderResult,
    current: currentValue as UseHotFormReturnType<CheckboxFormData>,
    submitButton: renderResult.getByTestId('submit-button') as HTMLButtonElement,
    testForm: renderResult.getByTestId('test-form') as HTMLFormElement,
    activeInput: renderResult.getByTestId('active-input') as HTMLInputElement,
    lettersInputContainer: renderResult.getByTestId('letters-input-container') as HTMLDivElement
  };
}

describe('CheckboxForm Component', () => {
  describe('Blur Event', () => {
    it('SHOULD validate schema field when it has lost focus if validators exist', async () => {
      const renderResult = renderCheckboxForm({
        hotField: false,
        initialSchema
      });
      
      await Promise.all(initialSchemaFieldNames.map(async fieldName => {
        const input = renderResult[`${fieldName}Input` as keyof typeof renderResult] as HTMLInputElement;
        const inputContainer = renderResult[`${fieldName}InputContainer` as keyof typeof renderResult] as HTMLDivElement;
        const currentSchemaField = renderResult.current.currentSchema[fieldName];
        
        if(currentSchemaField.validator){
          const validator = jest.spyOn(currentSchemaField, 'validator');
          
          if(input){
            fireEvent.blur(input);
            
            await waitFor(() => expect(validator).toHaveBeenCalled());
          }else{
            const checkboxes = getAllByRole(inputContainer, 'checkbox');
            
            await Promise.all(checkboxes.map(async checkbox => {
              fireEvent.blur(checkbox);
              
              await waitFor(() => expect(validator).toHaveBeenCalled());
            }));
          }
        }
      }));
    });
  });
  
  describe('Change Event', () => {
    it('MUST update field values based on name attribute', () => {
      const renderResult = renderCheckboxForm({ initialSchema });
      const expectedFieldValues: CheckboxFormData = {
        active: true,
        letters: [
          'A',
          'C'
        ]
      };
      
      Object.entries(expectedFieldValues).forEach(([ fieldName, value ]) => {
        const input = renderResult[`${fieldName}Input` as keyof typeof renderResult] as HTMLInputElement;
        const inputContainer = renderResult[`${fieldName}InputContainer` as keyof typeof renderResult] as HTMLDivElement;
        
        if(input){
          if(value){
            fireEvent.click(input);
            
            expect(input).toBeChecked();
          }else{
            expect(input).not.toBeChecked();
          }
        }else{
          const checkboxes = getAllByRole(inputContainer, 'checkbox');
          
          checkboxes.forEach(checkbox => {
            if(value.includes(checkbox.dataset.value)){
              fireEvent.click(checkbox);
              
              expect(checkbox).toBeChecked();
            }else{
              expect(checkbox).not.toBeChecked();
            }
          });
        }
      });      
    });
    
    it('SHOULD validate schema field when `hotField` is true (default) if validators exist', async () => {
      const renderResult = renderCheckboxForm({ initialSchema });
      const nextFieldValues: CheckboxFormData = {
        active: true,
        letters: [
          'A',
          'C'
        ]
      };
      
      await Promise.all(Object.entries(nextFieldValues).map(async ([ fieldName, value ]) => {
        const input = renderResult[`${fieldName}Input` as keyof typeof renderResult] as HTMLInputElement;
        const inputContainer = renderResult[`${fieldName}InputContainer` as keyof typeof renderResult] as HTMLDivElement;
        const currentSchemaField = renderResult.current.currentSchema[fieldName as keyof CheckboxFormData];
        
        if(currentSchemaField.validator){
          const validator = jest.spyOn(currentSchemaField, 'validator');
          
          if(input){
            if(value){
              fireEvent.click(input);
              
              await waitFor(() => expect(validator).toHaveBeenCalled());
            }
          }else{
            const checkboxes = getAllByRole(inputContainer, 'checkbox');
            
            await Promise.all(checkboxes.map(async checkbox => {
              if(value.includes(checkbox.dataset.value)){
                fireEvent.click(checkbox);
                
                await waitFor(() => expect(validator).toHaveBeenCalled());
              }
            }));
          }
        }
      }));
    });
    
    it('SHOULD NOT validate schema field when `hotField` is false if validators exist', async () => {
      const renderResult = renderCheckboxForm({
        hotField: false,
        initialSchema
      });
      const nextFieldValues: CheckboxFormData = {
        active: true,
        letters: [
          'A',
          'C'
        ]
      };
      
      await Promise.all(Object.entries(nextFieldValues).map(async ([ fieldName, value ]) => {
        const input = renderResult[`${fieldName}Input` as keyof typeof renderResult] as HTMLInputElement;
        const inputContainer = renderResult[`${fieldName}InputContainer` as keyof typeof renderResult] as HTMLDivElement;
        const currentSchemaField = renderResult.current.currentSchema[fieldName as keyof CheckboxFormData];
        
        if(currentSchemaField.validator){
          const validator = jest.spyOn(currentSchemaField, 'validator');
          
          if(input){
            if(value){
              fireEvent.click(input);
              
              await waitFor(() => expect(validator).not.toHaveBeenCalled());
            }
          }else{
            const checkboxes = getAllByRole(inputContainer, 'checkbox');
            
            await Promise.all(checkboxes.map(async checkbox => {
              if(value.includes(checkbox.dataset.value)){
                fireEvent.click(checkbox);
                
                await waitFor(() => expect(validator).not.toHaveBeenCalled());
              }
            }));
          }
        }
      }));
    });
  });
});