import { Class, Dto, DtoBase } from 'corello'
import { Validator, v, validatorFactory, type IValidated } from 'tamam'

import { PropValidationResult } from 'tamam'
import { User } from './user'
import { reactive } from 'vue'

//define a not validator..
const not = (param: number) =>
  validatorFactory({
    not: new Validator(
      (val: number) =>
        new Promise((r, _x) => {
          const isOk = val != param

          setTimeout(() => {
            console.log('DONE ', val)
            r({ isOk, message: isOk ? 'NOT 10' : `validation.not.error` })
          }, 1000)
        })
    )

    // you can use as many validator functions here..
  })
const firstNot0 = validatorFactory({
  not: new Validator(
    (val: number[]) =>
      new Promise((r, _x) => {
        const isOk = val.length ? val[0] != 0 : true

        setTimeout(() => {
          r({ isOk, message: isOk ? 'First Element is not a zero yes!' : `validation.firstNot0.error` })
        }, 1000)
      })
  )

  // you can use as many validator functions here..
})
const not1 = (param: number) =>
  validatorFactory({
    not: new Validator((val: number) => {
      const isOk = val != param
      return { isOk, message: isOk ? '' : `validation.not.error` }
    })

    // you can use as many validator functions here..
  })

// following is a parameterless decorator..
const positive = validatorFactory({
  positive: new Validator(
    (val: number) =>
      new Promise(r => {
        const isOk = val > 0
        setTimeout(() => r({ isOk, message: isOk ? '' : `validation.positive.error` }), 2000)
      }),
    false
  )
  //...other validation functions if needed
})
const parentNameStartsWithAEndswithX = validatorFactory({
  startsWithA: new Validator(
    (val: User) =>
      new Promise(r => {
        const isOk = !!val?.name?.length && val?.name?.charAt(0) === 'A'
        setTimeout(() => r({ isOk, message: isOk ? 'STARTS WITH A' : `validation.startsWithA.error` }), 1000)
      }),
    true
  ),
  startsEndsWithX: new Validator(
    (val: User) =>
      new Promise(r => {
        const isOk = !!val?.name?.length && val?.name.charAt(val?.name?.length - 1) === 'X'
        setTimeout(() => r({ isOk, message: isOk ? 'ENDS WITH X' : `validation.startsWithX.error` }), 1000)
      }),
    false
  )
  //...other validation functions if needed
})
class XYZ extends PropValidationResult {
  get isOk() {
    debugger
    return false
  }
}

@Dto
@v({ vMapFactory: () => reactive({}), propValidationResultClass: XYZ })
export class Human extends DtoBase<Human> implements IValidated<Human> {
  // the lib will auto-add the following local v prop (not required) , but can enhance intellisense

  // you can appply more than one validator here..
  // age is valid if not n
  @not(10) //with param
  @positive //parameterless..
  age!: number

  @firstNot0 //parameterless..
  arr: number[] = []

  name: string = 'unnamed'
  parent = new Parent()
  @parentNameStartsWithAEndswithX
  @Class(() => User)
  semsem!: User
  validate(props?: (keyof Human)[] | undefined): Promise<Record<keyof Human, { value: any; result: any }>> {
    return this.validate(props)
  }

  get X() {
    return 'Hello'
  }
  //...
}

@v()
export class Parent {
  // the lib will auto-add the following local v prop (not required) , but can enhance intellisense

  // you can appply more than one validator here..
  // age is valid if not n
  @not(100) //with param
  // @positive //parameterless..
  height!: number
}
