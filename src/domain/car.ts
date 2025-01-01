import { Class, Dto, DtoBase } from "corello";
import type { ICar, IUser } from "./meta";

import { User } from "./user";

@Dto
class Car extends DtoBase<ICar> implements ICar   {
  make!:ICar['make']
  @Class(()=>User)
  owner!: IUser
}

 export {Car}

  