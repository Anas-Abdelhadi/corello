import 'reflect-metadata'

import { extract } from '../core/utils'
import { ioc } from './di'

export const SERVICE_KEY = Symbol()

type TInjectParams = Omit<TInjectionConfig, 'executor'>
type TInjectorExec = (config: TInjectParams) => void

export type TServiceConfig = { tag: string; domain?: number; ctorArgs?: any[]; enforce?: { domain?: number } }
type TInjectionConfig = {
  executor?: TInjectorExec
} & Partial<TServiceConfig>

const getter = Symbol()

const injections = Symbol()
const IoCResolver = (params: TInjectParams) => {
  return ioc.construct(params.tag!, params.domain)
}
function Service(config: TServiceConfig) {
  return function <T extends new (...args: any[]) => any>(C: T) {
    const service = class extends C {
      get info() {
        return { value: `${C.prototype.constructor.name}@${config.domain??0}` }
      }
      constructor(...args: any[]) {
        super(...args)
        const props = extract(this)
        Object.entries(props).forEach(([prop, y]) => {
          const config = (this as any)[injections][prop] as TInjectionConfig
          if (y === undefined && config) {
            Object.defineProperty(this, prop, {
              enumerable: true,
              configurable: false,
              get: function () {
                return this[getter]?.(this, prop)()
              }
            })
          }
        })
      }

      [getter](instance: T, prop: keyof T) {
        const { executor, ...params } = (instance as any)[injections][prop] as TInjectionConfig
        const resolver = executor ?? IoCResolver
        return () => resolver(params)
      }
    }

    Reflect.defineMetadata(SERVICE_KEY, config, service)

    return service
  }
}

function injector(injection?: TInjectParams, executor?: TInjectionConfig['executor']) {
  return function (target: any, prop: string) {
    !target[injections] && (target[injections] = {})
    if (target[injections][prop]) console.warn('Composing multiple injectors on the same property is disallowed! If this is an override, last injection will take effect')
    target[injections][prop] = { tag: prop, ...injection, executor }
  }
}
/**
 * 
 * @param injection 
 * @param __unsafe_executor 
 * @returns defines the property on the class instance
 * @description Use the `@inject` decorator to populate IoC Instances as properties on your classes. By default the name of the class is used as is, however
 * this is customizable, but you will have to indicate the `tag` in the params passed to the decorator. also, you can override from which domain the fetched instance is coming.. 
 */
const inject = (injection?: TInjectParams, __unsafe_executor?: TInjectorExec) => injector(injection, __unsafe_executor)

export { Service, inject }
