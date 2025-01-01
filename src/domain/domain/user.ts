import { Class, Dto, DtoBase } from "../decorators/dto";
import { Car, type ICar } from "./car";

export interface IUser {
    name: string
    car:ICar
  }
   
  @Dto
  class WithName extends DtoBase<WithName>  {
    name!: string
    
  }
  @Dto
  export class User extends WithName {
    
    @Class(()=>(Car)) car!:ICar
  
  }