import type { IUser } from "./user"

export interface ICar  {
   make:'Benz'|'BWM'|'AUDI'
   owner?:IUser
  }