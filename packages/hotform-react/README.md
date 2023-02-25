# @hotform/react

[![GitHub license](https://img.shields.io/github/license/hotform/hotform?color=blue)](https://github.com/hotform/hotform/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@hotform/react)](https://www.npmjs.com/package/@hotform/react)

Hotform is a Javascript library for building React custom forms.

## Installation

```shell
npm i @hotform/react
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

### License

Licensed under the [MIT license](https://github.com/hotform/hotform/blob/master/LICENSE).
