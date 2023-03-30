import * as Config from './config';
import * as Events from './events';
import * as Schema from './schema';

export interface HotFormValues<T>{
  /** Current hot form schema. */
  currentSchema: Schema.HotFormSchema<T>;
  
  /** `submitting` state. */
  submitting: boolean;
}

export enum HotFormActionType{
  RESET_SCHEMA = 'RESET_SCHEMA',
  RUN_VALIDITY_EVENTS = 'RUN_VALIDITY_EVENTS',
  SET_SCHEMA_FIELD_VALUE = 'SET_SCHEMA_FIELD_VALUE',
  SUBMITTED = 'SUBMITTED',
  SUBMITTING = 'SUBMITTING',
  VALIDATE_SCHEMA_FIELD = 'VALIDATE_SCHEMA_FIELD'
}

export type HotFormAction<T> =
  | {
      type: HotFormActionType.RESET_SCHEMA;
    }
  | {
      type: HotFormActionType.RUN_VALIDITY_EVENTS;
      payload: {
        setSubmitting: Events.HotFormValidityEvent<T>['setSubmitting'];
        onFinally: () => void;
        onInvalid?: Config.HotFormConfig<T>['onInvalid'];
        onValid?: Config.HotFormConfig<T>['onValid'];
      }
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
      type: HotFormActionType.VALIDATE_SCHEMA_FIELD;
      payload: {
        fieldName: keyof Schema.HotFormSchema<T>;
      };
    };

export type HotFormReducer<T> = (prevState: HotFormValues<T>, action: HotFormAction<T>) => HotFormValues<T>;

export type UseEventHandlerFunction = (...args: any[]) => any;

export type UseHotFormValuesReturnType<T> = [ HotFormValues<T>, React.Dispatch<HotFormAction<T>> ];