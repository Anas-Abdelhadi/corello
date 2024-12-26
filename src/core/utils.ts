export type TClass<T> = { new (...args: any[]): T }
export type THashMap<T = {}> = Record<PropertyKey,T>
export type TOptional<T> = T | undefined
export type TClassDecorator<T> = (t: T) => void | T
export type TGuess<T> = T extends infer R ? R : never
export interface IInjectable  {
 // id: string
  dispose(): void
}
 
export const isFn = (val: any) => typeof val === 'function'
export const extract  = <T >(instance: T, isMethods = false): Readonly<{[key in keyof TProps<T>]:TProps<T>[key]}|TPickStartsWith<TMethods<T>, 'on'>> => {
  const result = {} as TPickStartsWith<TMethods<T>, 'on'> | {} as {[k in keyof T]:any}
  const check = (target: any) => {
    const props = Object.getOwnPropertyNames(target)
    props.forEach(x => {
        const cacheGet = target[x]
        if(isMethods){
            if (x.startsWith('on') && isFn(cacheGet)) {
                result[x as keyof TPickStartsWith<TMethods<T>, 'on'>] = cacheGet
            }
        }
        else{
            if (!isFn(cacheGet)) {
                result[x as keyof T ] = cacheGet
            }
        }
        
    })
    target !== Object.prototype && check(Object.getPrototypeOf(target))
  }
  check(instance)
  return Object.freeze(result)
}

export type TSafeStringKey<K, S extends string> = K extends `${S}${Capitalize<infer _R & string>}` ? K : never
export type TMethods<T = {}> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>
export type TProps<T = {}> = Pick<T, { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]>

export type TPickStartsWith<T, S extends string> = {
  [K in TSafeStringKey<keyof T, S>]: T[K]
}
 
 