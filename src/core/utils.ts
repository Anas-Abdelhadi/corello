 

export const isFn = (val: any) => typeof val === 'function'
export const extractProps = <T>(instance: T) => {
    const result: Partial<T> = {}
    const check = (target: any) => {
      const props = Object.getOwnPropertyNames(target)
      props.forEach(x => {
        if (!isFn(target[x])) {
          result[x as keyof T] = target[x]
        } else {
          //function prop..
        }
      })
      target !== Object.prototype && check(Object.getPrototypeOf(target))
    }
    check(instance)
    return Object.freeze(result)
  }

export type TSafeStringKey<K, S extends string> = K extends `${S}${Capitalize<infer _R & string>}` ? K : never
export type TMethods<T = {}> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>
export type TProps<T = {}> = Pick<T, { [K in keyof T]: T[K] extends Function ?    never : K }[keyof T]>

export type TPickStartsWith<T, S extends string> = {
  [K in TSafeStringKey<keyof T, S>]: T[K]
}
 
 