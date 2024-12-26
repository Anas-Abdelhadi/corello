# Welcome to XIoC!

This Library empowers you with the concept of Dependency Injection. and allows Inversion of control.

## The Concept

Imagine having a library of book shelves (`domain`s), the lowset shelf has number 0 (`domain`)
you can store your books (classes/services) in any shelf, and you can cross-reference those books at runtime, by passing the preferred `domain`

By default the books will be fetched from the current domain ( passed to IoC at construction time). When tagging a book to be used by the shelf you assign a `tag`, and a `domain` i.e shelf to be stored in.

when you try to get a book you tell the ioc to construct and instance of any book, IoC will try to fetch it from currently activeDomain, or by specifying the domain you wish to fetch it explicitly.

you can Invert to Control of your Application and change the constructed class shelf/container by setting `ioc.setContainerDomain`!

### Setup

To make a class Injectable. use `@Service`
To inject a property inside your class use `@inject`

Services should be added to the IoC by calling `IoC.add(ServiceClass)`
Instances can be instantiated dynamically from the IoC by calling `ioc.construct<Type>(TagNameString ,domainNumber?)`

```
import { Service, inject } from './decorators/service';

import { IInjectable } from './core/utils';
import { ioc } from './decorators/di';

// Pet class will be added to IoC, we use @Service here..
// note the tag param; this is used when dealing with the class in the IoC, a unique name (alias)
@Service({tag:'Pet'})
class Pet {
  // the Person class is also injected here, please note that this instance will be fetched from domain/scope 1
  // also note that we had to pass the tag as a param because we decided to customise the property name to person (all lower case in this example..)
  @inject({tag:'Person',domain:1} ) person!: Person
  walk() {
    console.log('PET IS WALKING')
  }
  // all services need to provide an implementation of the dispose method, this is used for any clean up..
  dispose() {}
}

// here we add the Pet Service to the IoC.. will be registered and tagged as `Pet`
ioc.add(Pet)


interface IPerson extends IInjectable {
  hello?:string
  semsem:Pet
}

interface IPerson2 extends IPerson {
 Pet:Pet
}

// another service named Person, and will have a tag `Person`, note that we can pass configuration for service, check the TS Type to learn more..
@Service({tag:'Person'})
class Person implements IPerson {
  hello:string= "Hello!"
  // this property is injected as well, in normal situations this will cause a circular dependency error, but the IoC will solve this for you..
  // note that the Pet property has a custom name `semsem`, also we need it to be specifically fetched from domain 1
  @inject({domain:1,tag:'Pet'}) semsem!: Pet
  dispose() {}
}

//This class will be enforced in level 0 meaning that it will replace any matching services in the same domain
@Service({tag:'Person', enforce:{domain:0}})
class Person2 extends Person implements Person2{

  // this property will by default create an instance from the service with tag `Pet`
  @inject() Pet!: Pet
  dispose() {}

}

ioc.add(Person)
ioc.add(Person2)

//Person2 will replace Person because of the enforce
// also check the console as IoC will warn you about services that were not found where their supposed to be,
// you will be warned also about service overrites, in case it was un-intentional

const person =  ioc.construct<Person1>('Person',100)
person.Pet.walk()
console.log(person)
```

> **Note:** In your **ts-config** make sure to enable the experimental decorators.
