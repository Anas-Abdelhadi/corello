import { TProps } from '../core/utils';

type TValidatorExec = (...args: any[]) => TValidatorResult
type TValidatorResult = { isOk: boolean; message: string }
type TValidator<T extends object, TName extends keyof TProps<T> = keyof TProps<T>> = {
  [name in TName]: TValidatorExec
}
type TValidationMap<T extends object, TValidatorName extends string> = {
  [k in keyof Omit<T, 'v'>]?: { validators: TValidator<T>; value: T[k]; result: { isOk: boolean; messages: string[] } & { [u in TValidatorName]?: TValidatorResult } }
}

function v<T extends new (...args: any[]) => any>(C: T) {
  return class extends C {
    setVal(instance: T & { v: any }, context: { prop: keyof T; value: any }) {
      const { prop, value } = context
      const { $validators } = this
      !instance.v && (instance.v = {})
      const result = Object.entries($validators[prop] as TValidator<T>).reduce(
        (p, [name, exec]) => {
          const result = { ...p } as any
          const validatorResult = (exec as TValidatorExec)(value)
          result.isOk = result.isOk && validatorResult.isOk
          validatorResult.message && result.messages.push(validatorResult.message)
          result[name] = validatorResult
          return result
        },
        { isOk: true, messages: [] } as { isOk: boolean; messages: string[] }
      )

      instance.v[prop as keyof T] = { value, validators: $validators, result }
    }
    getVal(instance: T & { v: any }, prop: keyof T) {
      return instance.v[prop]?.value
    }
  }
}

function validatorFactory<T extends object>(validators: TValidator<T>) {
  return function (target: any, prop: string) {
    !target.$validators && (target.$validators = {})
    !target.$validators[prop] && (target.$validators[prop] = {})
    target.$validators[prop] = { ...target.$validators[prop], ...validators }

    Object.defineProperty(target, prop, {
      enumerable: true,
      configurable: true,
      get: function () {
        return this?.getVal?.(this, prop)
      },
      set: function (value: string) {
        this?.setVal?.(this, { prop, value })
      }
    })
  }
}
 
export { v, validatorFactory  }
export type {TValidationMap,TValidator,TValidatorExec,TValidatorResult}