# @hotform/react

[![GitHub license](https://img.shields.io/github/license/hotform/hotform?color=blue)](https://github.com/hotform/hotform/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@hotform/react)](https://www.npmjs.com/package/@hotform/react)

`@hotform/react` is a JavaScript library for building React custom forms.

## Installation

```shell
npm i @hotform/react
```

## Using TypeScript

```shell
npm i --save-dev @hotform/types
```

## Example

The following code demonstrates a basic usage example.

```jsx
import { useHotForm } from '@hotform/react';

const BasicForm = () => {
  const { currentSchema, handleChange, handleSubmit, submitting } = useHotForm({
    initialSchema: {
      password: {
        value: '',
        validator: value => !!value.length
      },
      username: {
        value: '',
        validator: value => !!value.length
      }
    },
    onInvalid(){
      console.log('Invalid!');
    },
    async onValid({ fieldValues, setSubmitting }){
      await new Promise(resolve => setTimeout(resolve, 750));
      setSubmitting(false);
      console.log(JSON.stringify(fieldValues, null, 2));
    }
  });
  return (
    <form onSubmit={ handleSubmit }>
      <input
        name="username"
        onChange={ handleChange }
        placeholder="Enter your username"
        value={ currentSchema.username.value }
      />
      <input
        name="password"
        onChange={ handleChange }
        placeholder="Enter your password"
        value={ currentSchema.password.value }
      />
      <button
        disabled={ submitting }
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

export default BasicForm;
```

## Reference

### useHotForm

`useHotForm: <T>(props: UseHotFormProps<T>) => UseHotFormReturnType<T>`

#### Properties (object)

- [hotField](#hotfield) (boolean)
- [initialSchema](#initialschema) (object)
- [onInvalid](#oninvalid) (function)
- [onReset](#onreset) (function)
- [onValid](#onvalid) (function)

#### hotField

`hotField?: boolean`

If set to `true`, the field that changes its value will be validated. By default `true` is used.

#### initialSchema

`initialSchema: HotFormSchema<T>`

Simple examples:

**JavaScript**

```js
const userSchema = {
  password: {
    valid: true,
    validator: value => !!value.length,
    value: ''
  },
  username: {
    valid: true,
    validator: value => !!value.length,
    value: ''
  }
};
```

**TypeScript**

```ts
interface UserData{
  password: string;
  username: string;
}

const userSchema: HotFormSchema<UserData> = {
  password: {
    valid: true,
    validator: (value: string) => !!value.length,
    value: ''
  },
  username: {
    valid: true,
    validator: (value: string) => !!value.length,
    value: ''
  }
};
```

#### onInvalid

`onInvalid?: HotFormValidityEventHandler<T>`

The `onInvalid` callback is executed when the field values are invalid and the form is submitted.

#### onReset

`onReset?: Events.HotFormResetEventHandler<T>`

The `onReset` callback is executed when the form is reset.

#### onValid

`onValid?: Events.HotFormValidityEventHandler<T>`

The `onValid` callback is executed when the field values are valid and the form is submitted.

### License

Licensed under the [MIT license](https://github.com/hotform/hotform/blob/master/LICENSE).
