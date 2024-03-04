# Welcome to Tamam!

The motive behind this library is to enable validating properties of TS classes using the TS experimental decorators.

### Setup

To add validation to your typescript class, simply add the `@v ` decorator before your class.
this will in turn populate a local map inside your class named `v` of type `TValidationMap`

To validate a property: use the `validatorFactory` before your property, this can be composed as you wish.

```
// import the factory
import { validatorFactory } from  'tamam';

//define a not validator..
const not = (param:  number) =>
	validatorFactory({
		not: (val:  number) => {
			const  isOk  =  val  !=  param
			return { isOk, message:  isOk  ?  ''  :  `validation.not.error` }
		},
		// you can use as many validator functions here..
	})

// following is a parameterless decorator..
const positive = validatorFactory({
		positive: (val:  number) => {
			const  isOk  =  val  >0
			return { isOk, message:  isOk  ?  ''  :  `validation.positive.error` }
		},
		//...other validation functions if needed
	})
```

```
import {v} from 'tamam'
@v
class Human {
	 // the lib will auto-add the following local v prop (not required) , but can enhance intellisense
	 v!:  TValidationMap<Human ,'not'|'positive'>

	 // you can appply more than one validator here..
	 // age is valid if not n
	 @not(10) // with param
	 @positive // parameterless..
	 age!:number
	//...
}
```

> **Note:** In your **ts-config** make sure to enable the experimental decorators.

### Typing

To acquire information about your validation map, you can add a local property to your class named `v` of `TValidationMap` type

```
@v
class Human {
v!:  TValidationMap<Human ,'not'|'positive'>
//...
}
```

The validation map will contain information about properties marked with validators as follows:

```
const someone = new Human()
someone.age = -10
console.log(someone.v.age.result) // specific prop v info
console.log(someone.v) // the full v map
```
