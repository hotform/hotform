import React from 'react'

/* Types */
import { HotFormActionType } from '@hotform/types'
import type {
  HotFormConfig,
  HotFormReducer,
  HotFormSchema,
  UseHotFormValuesReturnType,
} from '@hotform/types'

/* Utils */
import {
  getHotFormSchemaFieldValues,
  parseInitialSchema,
  validateSchemaField,
} from '../utils'

const useHotFormValues = <T>({
  hotField = true,
  initialSchema,
  onInvalid,
  onValid,
}: Pick<
  HotFormConfig<T>,
  'hotField' | 'initialSchema' | 'onInvalid' | 'onValid'
>): UseHotFormValuesReturnType<T> => {
  const [state, dispatch] = React.useReducer<HotFormReducer<T>>(
    (prevState, action) => {
      switch (action.type) {
        case HotFormActionType.RESET_SCHEMA: {
          return {
            ...prevState,
            currentSchema: parseInitialSchema(initialSchema),
          }
        }
        case HotFormActionType.RUN_VALIDITY_EVENTS: {
          return {
            ...prevState,
            runValidityEvents: action.payload,
          }
        }
        case HotFormActionType.SET_SCHEMA_FIELD_VALUE: {
          const nextSchema = { ...prevState.currentSchema }
          const fieldName = action.payload.fieldName
          const currentSchemaField = nextSchema[fieldName]
          if (currentSchemaField) {
            currentSchemaField.value = action.payload.newFieldValue
            if (hotField) validateSchemaField(nextSchema, fieldName)
          }
          return {
            ...prevState,
            currentSchema: nextSchema,
          }
        }
        case HotFormActionType.SUBMITTED: {
          return {
            ...prevState,
            runValidityEvents: false,
            submitting: false,
          }
        }
        case HotFormActionType.SUBMITTING: {
          return {
            ...prevState,
            submitting: true,
          }
        }
        case HotFormActionType.VALIDATE_SCHEMA_FIELDS: {
          const nextSchema = { ...prevState.currentSchema }
          const fieldNames = action.payload
          fieldNames.forEach(fieldName => {
            validateSchemaField(nextSchema, fieldName)
          })
          return {
            ...prevState,
            currentSchema: nextSchema,
          }
        }
        default: {
          throw new Error(`Unknown action: ${(action as any).type}`)
        }
      }
    },
    {
      currentSchema: parseInitialSchema(initialSchema),
      runValidityEvents: false,
      submitting: false,
    },
  )

  React.useEffect(() => {
    if (state.runValidityEvents) {
      const fieldValues = getHotFormSchemaFieldValues(state.currentSchema)
      const currentSchemaKeys = Object.keys(state.currentSchema)
      const numberOfValidFields = currentSchemaKeys.reduce(
        (previousValue, currentKey) => {
          const fieldName = currentKey as keyof HotFormSchema<T>
          return +!!state.currentSchema[fieldName].valid + previousValue
        },
        0,
      )
      if (numberOfValidFields === currentSchemaKeys.length) {
        const callbackResult = onValid?.({
          fieldValues,
          setSubmitting(value) {
            dispatch({
              type: value
                ? HotFormActionType.SUBMITTING
                : HotFormActionType.SUBMITTED,
            })
          },
        })
        Promise.resolve(callbackResult).finally(() => {
          if (callbackResult === undefined) {
            dispatch({
              payload: false,
              type: HotFormActionType.RUN_VALIDITY_EVENTS,
            })
          } else {
            dispatch({
              type: HotFormActionType.SUBMITTED,
            })
          }
        })
      } else {
        onInvalid?.({ fieldValues })
        dispatch({
          type: HotFormActionType.SUBMITTED,
        })
      }
    }
  }, [state.runValidityEvents])

  return [state, dispatch]
}

export { HotFormActionType }

export type {
  HotFormConfig,
  HotFormReducer,
  HotFormSchema,
  UseHotFormValuesReturnType,
}

export default useHotFormValues
