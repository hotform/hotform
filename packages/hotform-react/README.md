# HotForm

[![GitHub license](https://img.shields.io/github/license/hotform/hotform?color=blue)](https://github.com/hotform/hotform/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@hotform/react)](https://www.npmjs.com/package/@hotform/react)

HotForm is a JavaScript library for building React custom forms.

## Contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [Peer Dependencies](#peer-dependencies)
- [Usage](#usage)
  - [Quickstart](#quickstart)
  - [Examples](#examples)
- [Documentation](#documentation)
- [License](#license)

## Installation

Run one of the following commands to add HotForm to your project:

### npm

```shell
npm i @hotform/react
```

### yarn

```shell
yarn add @hotform/react
```

### Peer Dependencies

[`react`](https://www.npmjs.com/package/react) >= 16.0.0 is a peer dependency.

## Usage

Learn the basics of working with HotForm.

### Quickstart

Create a new component that uses the hook from `@hotform/react`. To start with, add the initial schema and the validity event handler to the hook argument.

```jsx
import { useHotForm } from '@hotform/react'

const BasicForm = () => {
  const { currentSchema, handleChange, handleSubmit } = useHotForm({
    initialSchema: {
      firstName: {
        validator: value => !!value,
        value: '',
      },
      lastName: {
        validator: value => !!value,
        value: '',
      },
    },
    async onValid({ fieldValues }) {
      await new Promise(resolve => setTimeout(resolve, 500))
      alert(JSON.stringify(fieldValues, null, 2))
    },
  })
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          onChange={handleChange}
          placeholder="Enter your first name"
          value={currentSchema.firstName.value}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          onChange={handleChange}
          placeholder="Enter your last name"
          value={currentSchema.lastName.value}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BasicForm
```

### Examples

Visit the [examples](https://hotform.org/examples/) page to see how we recommend implementing HotForm with various React packages like Material UI, Yup and more.

## Documentation

The official documentation website is [hotform.org](https://hotform.org/).

## License

Licensed under the [MIT license](https://github.com/hotform/hotform/blob/master/LICENSE).
