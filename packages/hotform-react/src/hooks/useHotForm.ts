import React from 'react'

/* Types */
import { HotFormActionType } from '@hotform/types'
import type {
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormValidityEvent,
  HotFormSchema,
  HotFormConfig,
  UseHotFormReturnType,
} from '@hotform/types'

/* Utils */
import {
  getHotFormSchemaFieldValues,
  useEventHandler,
  useHotFormValues,
} from '@hotform/utils'

const useHotForm = <T>({
  hotField = true,
  initialSchema,
  onInvalid,
  onReset,
  onValid,
}: HotFormConfig<T>): UseHotFormReturnType<T> => {
  const [state, dispatch] = useHotFormValues({
    hotField,
    initialSchema,
    onInvalid,
    onValid,
  })

  const resetSchema: UseHotFormReturnType<T>['resetSchema'] =
    React.useCallback(() => {
      onReset?.(getHotFormSchemaFieldValues(state.currentSchema))
      dispatch({
        type: HotFormActionType.RESET_SCHEMA,
      })
    }, [state.currentSchema])

  const setSchemaFieldValue: UseHotFormReturnType<T>['setSchemaFieldValue'] =
    React.useCallback((fieldName, newFieldValue) => {
      dispatch({
        payload: {
          fieldName,
          newFieldValue,
        },
        type: HotFormActionType.SET_SCHEMA_FIELD_VALUE,
      })
    }, [])

  const handleBlur: UseHotFormReturnType<T>['handleBlur'] = useEventHandler(
    e => {
      dispatch({
        payload: [e.target.name as keyof HotFormSchema<T>],
        type: HotFormActionType.VALIDATE_SCHEMA_FIELDS,
      })
    },
  )

  const handleChange: UseHotFormReturnType<T>['handleChange'] = useEventHandler(
    e => {
      const fieldName = e.target.name as keyof HotFormSchema<T>
      const currentSchemaField = { ...state.currentSchema[fieldName] }
      if (currentSchemaField) {
        switch (e.target.type) {
          case 'checkbox': {
            if (Array.isArray(currentSchemaField.value)) {
              const item = currentSchemaField.parseValue
                ? currentSchemaField.parseValue(e.target.value)
                : e.target.value
              if (e.target.checked) {
                currentSchemaField.value.push(item)
              } else {
                const index = currentSchemaField.value.indexOf(item)
                if (index > -1) currentSchemaField.value.splice(index, 1)
              }
            } else {
              currentSchemaField.value = e.target.checked
            }
            break
          }
          case 'file': {
            currentSchemaField.value = e.target.files[0] || null
            break
          }
          case 'number':
          case 'range': {
            currentSchemaField.value = currentSchemaField.parseValue
              ? currentSchemaField.parseValue(e.target.value)
              : (Number(e.target.value) as any)
            break
          }
          case 'select-multiple': {
            const selectedOptions: HTMLCollectionOf<HTMLOptionElement> =
              e.target.selectedOptions
            currentSchemaField.value = Array.from(selectedOptions).map(
              (option: HTMLOptionElement) =>
                currentSchemaField.parseValue
                  ? currentSchemaField.parseValue(option.value)
                  : option.value,
            ) as any
            break
          }
          default: {
            currentSchemaField.value = currentSchemaField.parseValue
              ? currentSchemaField.parseValue(e.target.value)
              : e.target.value
            break
          }
        }
        setSchemaFieldValue(fieldName, currentSchemaField.value)
      }
    },
  )

  const handleReset: UseHotFormReturnType<T>['handleReset'] = useEventHandler(
    e => {
      e.preventDefault()
      resetSchema()
    },
  )

  const handleSubmit: UseHotFormReturnType<T>['handleSubmit'] = useEventHandler(
    e => {
      e.preventDefault()
      dispatch({
        type: HotFormActionType.SUBMITTING,
      })
      dispatch({
        payload: Object.keys(state.currentSchema) as Array<
          keyof HotFormSchema<T>
        >,
        type: HotFormActionType.VALIDATE_SCHEMA_FIELDS,
      })
      dispatch({
        payload: true,
        type: HotFormActionType.RUN_VALIDITY_EVENTS,
      })
    },
  )

  return {
    currentSchema: state.currentSchema,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    resetSchema,
    setSchemaFieldValue,
    submitting: state.submitting,
  }
}

export type {
  HotFormChangeEventHandler,
  HotFormEventHandler,
  HotFormFocusEventHandler,
  HotFormValidityEvent,
  HotFormSchema,
  HotFormConfig,
  UseHotFormReturnType,
}

export default useHotForm
