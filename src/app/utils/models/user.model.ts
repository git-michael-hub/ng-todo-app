export type TUser = {
  id?: string,
  name: string,
  email: string,
  isEmailVerified: string,
  lastLoginAt: string,
  role:  "admin" | "user",
  position: string[],
  team: string[],
  createdAt: string,
  updatedAt: string
}


export interface ILogin {
  email: string,
  password: string
}

export interface IRegister extends ILogin {
  name: string
}
