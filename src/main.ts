import { Service, inject } from './decorators/service';

import { IInjectable } from './core/utils';
import { ioc } from './decorators/di';

@Service({tag:'Pet'})
class Pet {
  
  @inject({tag:'Person',domain:1} ) person!: Person
  walk() {
    console.log('PET IS WALKING')
  }
  dispose() {}
}


ioc.add(Pet)
interface IPerson extends IInjectable {
  hello?:string
  semsem:Pet
}
 
@Service({tag:'Person'})
class Person implements IPerson {
  
  @inject({domain:1,tag:'Pet'}) semsem!: Pet
  dispose() {}
}
//This class will be enforced in level 0
@Service({tag:'Person', enforce:{domain:0}})
class Person1 extends Person{
  hello:string= "Some String.."
  @inject({domain:100,tag:'Pet'}) semsem2!: Pet
  dispose() {}

}
ioc.add(Person) 
ioc.add(Person1)

//Person1 will replace Person because of the enforce
const person1 =  ioc.construct<Person1>('Person',1)
person1.semsem2.walk() 
console.log(person1)
