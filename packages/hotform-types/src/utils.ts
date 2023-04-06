import * as Schema from './schema';

export interface HotFormValues<T>{
  /** Current HotForm schema. */
  currentSchema: Schema.HotFormSchema<T>;
  
  /** `runValidityEvents` state. */
  runValidityEvents: boolean;
  
  /** `submitting` state. */
  submitting: boolean;
}

export const enum HotFormActionType{
  RESET_SCHEMA = 'RESET_SCHEMA',
  RUN_VALIDITY_EVENTS = 'RUN_VALIDITY_EVENTS',
  SET_SCHEMA_FIELD_VALUE = 'SET_SCHEMA_FIELD_VALUE',
  SUBMITTED = 'SUBMITTED',
  SUBMITTING = 'SUBMITTING',
  VALIDATE_SCHEMA_FIELDS = 'VALIDATE_SCHEMA_FIELDS'
}

export type HotFormAction<T> =
  | {
      type: HotFormActionType.RESET_SCHEMA;
    }
  | {
      type: HotFormActionType.RUN_VALIDITY_EVENTS;
      payload: boolean;
    }
  | {
      type: HotFormActionType.SET_SCHEMA_FIELD_VALUE;
      payload: {
        fieldName: keyof Schema.HotFormSchema<T>;
        newFieldValue: any;
      };
    }
  | {
      type: HotFormActionType.SUBMITTED;
    }
  | {
      type: HotFormActionType.SUBMITTING;
    }
  | {
      type: HotFormActionType.VALIDATE_SCHEMA_FIELDS;
      payload: Array<keyof Schema.HotFormSchema<T>>;
    };

export type HotFormReducer<T> = (prevState: HotFormValues<T>, action: HotFormAction<T>) => HotFormValues<T>;

export type UseEventHandlerFunction = (...args: any[]) => any;

export type UseHotFormValuesReturnType<T> = [ HotFormValues<T>, React.Dispatch<HotFormAction<T>> ];