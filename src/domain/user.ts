import { Class, Dto, DtoBase } from "corello";
import type { ICar, IUser } from "./meta";

import { Car } from "./car";

@Dto
class User extends DtoBase<User> implements IUser   {
  name!: string;
  @Class(()=>Car) 
  car!: ICar;
}

 export {User}

  