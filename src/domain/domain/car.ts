import { Class, Dto, DtoBase } from '../decorators/dto';
import { type IUser, User } from './user';

export interface ICar {
  user: IUser
  wheels: string[]

  passengers: IUser[]
}
@Dto
export class Car extends DtoBase<Car> {
  @Class(() => User)
  user!: unknown
  wheels!: string[]
  get name() {
    return (this.user as any)?.name
  }
  //@Factory((x)=>(new User({...x, name:'sssssss'})))
  @Class(() => User)
  passengers: IUser[] = []
}
