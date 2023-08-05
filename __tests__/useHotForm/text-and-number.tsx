import React from 'react'

/* HotForm */
import { useHotForm } from '@hotform/react'
import type {
  HotFormConfig,
  HotFormSchema,
  UseHotFormReturnType,
} from '@hotform/types'

/* Testing Library */
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'

interface TextAndNumberFormData {
  ticketNumber: number
  username: string
}

const TextAndNumberForm: React.FC<
  UseHotFormReturnType<TextAndNumberFormData>
> = ({
  currentSchema,
  handleBlur,
  handleChange,
  handleReset,
  handleSubmit,
  submitting,
}) => {
  return (
    <form data-testid="test-form" onSubmit={handleSubmit} onReset={handleReset}>
      <input
        data-testid="ticket-number-input"
        name="ticketNumber"
        type="number"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter your ticket number"
        value={currentSchema.ticketNumber.value}
      />
      <input
        data-testid="username-input"
        name="username"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Enter your username"
        value={currentSchema.username.value}
      />
      <button data-testid="reset-button" type="reset">
        Reset
      </button>
      <button data-testid="submit-button" disabled={submitting} type="submit">
        Submit
      </button>
    </form>
  )
}

const initialSchema: HotFormSchema<TextAndNumberFormData> = {
  ticketNumber: {
    value: 0,
  },
  username: {
    value: '',
    validator: value => !!value,
  },
}

const initialSchemaFieldNames = Object.keys(initialSchema) as Array<
  keyof HotFormSchema<TextAndNumberFormData>
>

interface RenderTextAndNumberFormResult extends RenderResult {
  current: UseHotFormReturnType<TextAndNumberFormData>
  resetButton: HTMLButtonElement
  submitButton: HTMLButtonElement
  testForm: HTMLFormElement
  ticketNumberInput: HTMLInputElement
  usernameInput: HTMLInputElement
}

const renderTextAndNumberForm = (
  config: HotFormConfig<TextAndNumberFormData>,
): RenderTextAndNumberFormResult => {
  const currentValue: Record<string, any> = {}

  const Renderer: React.FC = () => {
    const value = useHotForm(config)

    currentValue.currentSchema = value.currentSchema
    currentValue.handleBlur = value.handleBlur
    currentValue.handleChange = value.handleChange
    currentValue.handleReset = value.handleReset
    currentValue.handleSubmit = value.handleSubmit
    currentValue.resetSchema = value.resetSchema
    currentValue.setSchemaFieldValue = value.setSchemaFieldValue
    currentValue.submitting = value.submitting

    return <TextAndNumberForm {...value} />
  }

  const renderResult = render(<Renderer />)

  return {
    ...renderResult,
    current: currentValue as UseHotFormReturnType<TextAndNumberFormData>,
    resetButton: renderResult.getByTestId('reset-button') as HTMLButtonElement,
    submitButton: renderResult.getByTestId(
      'submit-button',
    ) as HTMLButtonElement,
    testForm: renderResult.getByTestId('test-form') as HTMLFormElement,
    ticketNumberInput: renderResult.getByTestId(
      'ticket-number-input',
    ) as HTMLInputElement,
    usernameInput: renderResult.getByTestId(
      'username-input',
    ) as HTMLInputElement,
  }
}

describe('TextAndNumberForm Component', () => {
  it('MUST initialize the field values', () => {
    const renderResult = renderTextAndNumberForm({ initialSchema })

    initialSchemaFieldNames.forEach(fieldName => {
      const currentSchemaField = renderResult.current.currentSchema[fieldName]
      const initialSchemaField = initialSchema[fieldName]

      expect(currentSchemaField.value).toBe(initialSchemaField.value)
    })
  })

  it('SHOULD run validators by default if they exist', () => {
    const renderResult = renderTextAndNumberForm({ initialSchema })

    initialSchemaFieldNames.forEach(fieldName => {
      const currentSchemaField = renderResult.current.currentSchema[fieldName]
      const initialSchemaField = initialSchema[fieldName]

      if (initialSchemaField.valid === undefined) {
        const expected = initialSchemaField.validator
          ? initialSchemaField.validator(initialSchemaField.value)
          : true

        expect(currentSchemaField.valid).toBe(expected)
      } else {
        expect(currentSchemaField.valid).toBe(!!initialSchemaField.valid)
      }
    })
  })

  describe('Blur Event', () => {
    it('SHOULD validate schema field when it has lost focus if validators exist', async () => {
      const renderResult = renderTextAndNumberForm({
        hotField: false,
        initialSchema,
      })

      await Promise.all(
        initialSchemaFieldNames.map(async fieldName => {
          const input = renderResult[
            `${fieldName}Input` as keyof RenderTextAndNumberFormResult
          ] as HTMLInputElement

          const currentSchemaField =
            renderResult.current.currentSchema[fieldName]

          if (currentSchemaField.validator) {
            const validator = jest.spyOn(currentSchemaField, 'validator')

            fireEvent.blur(input)

            await waitFor(() => {
              expect(validator).toHaveBeenCalled()
            })
          }
        }),
      )
    })
  })

  describe('Change Event', () => {
    it('MUST update field values based on name attribute', () => {
      const renderResult = renderTextAndNumberForm({ initialSchema })
      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })

        expect(input).toHaveValue(value)
      })
    })

    it('SHOULD validate schema field when `hotField` is true (default) if validators exist', async () => {
      const renderResult = renderTextAndNumberForm({ initialSchema })
      const nextFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      await Promise.all(
        Object.entries(nextFieldValues).map(async ([fieldName, value]) => {
          const input = renderResult[
            `${fieldName}Input` as keyof RenderTextAndNumberFormResult
          ] as HTMLInputElement

          const currentSchemaField =
            renderResult.current.currentSchema[
              fieldName as keyof TextAndNumberFormData
            ]

          if (currentSchemaField.validator) {
            const validator = jest.spyOn(currentSchemaField, 'validator')

            fireEvent.change(input, {
              target: {
                value,
              },
            })

            await waitFor(() => {
              expect(validator).toHaveBeenCalled()
            })
          }
        }),
      )
    })

    it('SHOULD NOT validate schema field when `hotField` is false if validators exist', async () => {
      const renderResult = renderTextAndNumberForm({
        hotField: false,
        initialSchema,
      })
      const nextFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      await Promise.all(
        Object.entries(nextFieldValues).map(async ([fieldName, value]) => {
          const input = renderResult[
            `${fieldName}Input` as keyof RenderTextAndNumberFormResult
          ] as HTMLInputElement

          const currentSchemaField =
            renderResult.current.currentSchema[
              fieldName as keyof TextAndNumberFormData
            ]

          if (currentSchemaField.validator) {
            const validator = jest.spyOn(currentSchemaField, 'validator')

            fireEvent.change(input, {
              target: {
                value,
              },
            })

            await waitFor(() => {
              expect(validator).not.toHaveBeenCalled()
            })
          }
        }),
      )
    })
  })

  describe('Reset Event', () => {
    it('MUST call event.preventDefault() method', () => {
      const renderResult = renderTextAndNumberForm({ initialSchema })

      expect(fireEvent.reset(renderResult.testForm)).toBe(false)
    })

    it('SHOULD reset schema when the form is reset', () => {
      const renderResult = renderTextAndNumberForm({ initialSchema })
      const nextFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      Object.entries(nextFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.reset(renderResult.testForm)

      initialSchemaFieldNames.forEach(fieldName => {
        const currentSchemaField = renderResult.current.currentSchema[fieldName]
        const initialSchemaField = initialSchema[fieldName]

        expect(currentSchemaField.value).toBe(initialSchemaField.value)

        if (initialSchemaField.valid === undefined) {
          const expected = initialSchemaField.validator
            ? initialSchemaField.validator(initialSchemaField.value)
            : true

          expect(currentSchemaField.valid).toBe(expected)
        } else {
          expect(currentSchemaField.valid).toBe(!!initialSchemaField.valid)
        }
      })
    })

    it('SHOULD call `onReset` if `onReset` callback is set', async () => {
      const onReset = jest.fn()
      const renderResult = renderTextAndNumberForm({
        initialSchema,
        onReset,
      })
      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.reset(renderResult.testForm)

      await waitFor(() => {
        expect(onReset).toHaveBeenCalledWith(expectedFieldValues)
      })
    })
  })

  describe('Submit Event', () => {
    it('MUST call event.preventDefault() method', () => {
      const renderResult = renderTextAndNumberForm({ initialSchema })

      expect(fireEvent.submit(renderResult.testForm)).toBe(false)
    })

    it('SHOULD call `onInvalid` if `onInvalid` callback is set and the field values are invalid', async () => {
      const onInvalid = jest.fn()
      const renderResult = renderTextAndNumberForm({
        initialSchema,
        onInvalid,
      })
      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 0,
        username: '',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.submit(renderResult.testForm)

      await waitFor(() => {
        expect(onInvalid).toHaveBeenCalledWith({
          fieldValues: expectedFieldValues,
        })
      })
    })

    it('SHOULD NOT call `onInvalid` if `onInvalid` callback is set and the field values are valid', async () => {
      const onInvalid = jest.fn()
      const renderResult = renderTextAndNumberForm({
        initialSchema,
        onInvalid,
      })
      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.submit(renderResult.testForm)

      await waitFor(() => {
        expect(onInvalid).not.toHaveBeenCalled()
      })
    })

    it('SHOULD call `onValid` if `onValid` callback is set and the field values are valid', async () => {
      const onValid = jest.fn()
      const renderResult = renderTextAndNumberForm({
        initialSchema,
        onValid,
      })

      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 100,
        username: 'foo',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.submit(renderResult.testForm)

      await waitFor(() => {
        expect(onValid).toHaveBeenCalledWith({
          fieldValues: expectedFieldValues,
          setSubmitting: expect.any(Function),
        })
      })
    })

    it('SHOULD NOT call `onValid` if `onValid` callback is set and the field values are invalid', async () => {
      const onValid = jest.fn()
      const renderResult = renderTextAndNumberForm({
        initialSchema,
        onValid,
      })

      const expectedFieldValues: TextAndNumberFormData = {
        ticketNumber: 0,
        username: '',
      }

      Object.entries(expectedFieldValues).forEach(([fieldName, value]) => {
        const input = renderResult[
          `${fieldName}Input` as keyof RenderTextAndNumberFormResult
        ] as HTMLInputElement

        fireEvent.change(input, {
          target: {
            value,
          },
        })
      })

      fireEvent.submit(renderResult.testForm)

      await waitFor(() => {
        expect(onValid).not.toHaveBeenCalled()
      })
    })
  })
})
