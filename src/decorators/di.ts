import '@abraham/reflection'

import type { IInjectable, TClass, TGuess, THashMap, TOptional } from '../core/utils'
import { SERVICE_KEY, TServiceConfig } from './service'

const sym_DI = Symbol('DI Private Instance')

type TDependency<T extends IInjectable = IInjectable> = { Cls: TClass<T> } & TServiceConfig
type TContainer = { [key: number]: THashMap<TDependency> }
type TAppContextContainer = Record<string, TContainer> & { global: Partial<TContainer> }
// type TAppContextContainer<T extends string ='global'  > = {[k in Exclude<T,'global'>]?: TContainer } & {global:Partial<TContainer>}

class IoC {
  private static [sym_DI]: IoC
  private _activeDomain: number = 0
  private _activeAppContext: string = 'global'
  private registry: TAppContextContainer = { global: {} }

  private constructor(level: number = 0) {
    this._activeDomain = level
  }

  /**
   *  @Summary  The Single Instance of  Dependency Injector.
   * @returns Dependecy Injector
   *
   */
  static DI(level: number = 0): IoC {
    if (IoC[sym_DI]) {
      return IoC[sym_DI]
    }
    IoC[sym_DI] = new IoC(level) // only once at first run
    return IoC[sym_DI]
  }

  setAppContext(appName: string) {
    this._activeAppContext = appName
    return this
  }
  setContainerDomain(domain: number) {
    this._activeDomain = domain
    return this
  }
  
  register<K extends IInjectable>(Cls: TClass<K>, meta: TServiceConfig) {
    const domain = meta.domain === undefined ? 0 : meta.domain
    if (domain < 0) throw Error(`:: Invalid Domain ${domain}. IoC minimum domain is Zero`)
    //global
    const targetContext = meta.tag.endsWith('@global') ? 'global' : this._activeAppContext
    const alreadyThere = this.registry[targetContext] && this.registry[targetContext][domain] && Object.keys(this.registry[targetContext][meta.domain ?? 0]).find(y => y == meta.tag)

    !this.registry[targetContext] && (this.registry[targetContext] = {})
    if (!this.registry[targetContext][domain]) this.registry[targetContext][domain] = { [meta.tag]: { Cls, ...meta } }
    else !alreadyThere && (this.registry[targetContext]![domain][meta.tag] = { Cls, ...meta })
    if (alreadyThere) {
      if (meta.enforce?.domain !== undefined && meta.enforce?.domain !== domain) {
        console.warn(`:: You're attempting to enforce Service [${meta.tag}] for context [${targetContext}] as domain ${domain}\n However domain [${domain}] does not include this service!`)
      } else if (meta.enforce?.domain == domain) this.registry[targetContext]![domain][meta.tag] = { Cls, ...meta }
      else
        console.warn(
          `:: You're attempting to re-register Service [${meta.tag}] in domain [${domain}] for context [${targetContext}]\nIoC has skipped this, if you wish to allow this overrite pass 'enforce' in your service config.`
        )
    }
  }

  getFirstAvailableDomain(identifier: string, _domain?: number): TOptional<{ dependency: TDependency; domain: number }> | Function {
    let targetDomain = _domain === undefined ? this._activeDomain : _domain
    if (targetDomain < 0) throw Error(`Invalid Domain ${targetDomain}. IoC minimum domain is Zero`)
    const targetContext = identifier.endsWith('@global') ? 'global' : this._activeAppContext
    const found =
      this.registry[targetContext] && this.registry[targetContext][targetDomain] && this.registry[targetContext][targetDomain][identifier]
        ? this.registry[targetContext][targetDomain][identifier]
        : false
    if (found) return { dependency: found, domain: targetDomain }
    else if (--targetDomain >= 0) return this.getFirstAvailableDomain(identifier, targetDomain)
    return undefined
  }

  construct<T extends IInjectable>({ Cls, ctorArgs = [] }: TDependency<TGuess<T>>) {
    return Reflect.construct(Cls, ctorArgs) as TGuess<T>
  }

  resolve(identifier: string, _domain?: number) {
    const result = this.getFirstAvailableDomain(identifier, _domain)

    if (result === undefined)
      throw new Error(`::IoC:${identifier} @ domain [${_domain ?? this._activeDomain}] was not found in ${identifier.endsWith('@global') ? 'global' : this._activeAppContext},\nDid you register it ?`)
    const { dependency, domain } = result as { dependency: TDependency; domain: number }
    if (domain !== _domain)
      console.warn(
        `:: IoC:${identifier} @ domain [${_domain ?? this._activeDomain}] was not found in ${
          identifier.endsWith('@global') ? 'global' : this._activeAppContext
        },Dependency Injector fetch this from [${domain}]`
      )

    return dependency as TDependency
  }

  /**
   *
   * @param collection of services exported in your module/service package
   * @summary this will auto load and register the services in the container.
   */
  loadServices(collection: any, exclude: string[] = []) {
    collection.keys().forEach((fileName: string) => {
      const exports = collection(fileName)
      for (const m in exports) {
        if (typeof exports[m] === 'function') {
          const metadata = Reflect.getMetadata(SERVICE_KEY, exports[m]) as TServiceConfig
          if (metadata) {
            // register
            exclude.find(x => x === metadata.tag) ? console.log(`Ioc will exclude ${metadata.tag}`) : this.register(exports[m], metadata)
          }
        }
      }
    })
    return this
  }
}

class IoCBuilder {
  instance!: IoC

  constructor() {
    this.instance = IoC.DI()
  }
  /**
   * 
   * @param service the class to be registered, should be prefixed with the `@Service` decorator
   * @returns void
   * @description This will add the service to the registery making this available for IoC resolution
   */
  add<T extends IInjectable>(service: TClass<TGuess<T>>) {
    const metadata = Reflect.getMetadata(SERVICE_KEY, service) as TServiceConfig
    this.instance.register(service, metadata)
    return this
  }
  /**
   * 
   * @param tag 
   * @param d `Optional` domain, by default the IoC will use the activeDomain to determine from which to fetch your instance.
   * you can pass an explicit domain to target a preferred instance at runtime. 
   * @returns an constructed Instance of your class.. 
   */
  construct<T extends IInjectable>(tag: string, d?: number): TGuess<T> {
    const dependecy = this.instance.resolve(tag, d) as TDependency<TGuess<T>>
    return this.instance.construct(dependecy)
  }

  build() {
    return this.instance
  }
}

const ioc = new IoCBuilder()

export { ioc }
