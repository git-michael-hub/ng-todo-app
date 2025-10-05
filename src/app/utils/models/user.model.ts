import { TStateManagement } from "./common.model"

export interface IAuth extends TStateManagement {
  user?: TUser,
  status: 'login' | 'register' | 'verify-email',
  token?: string,
  isVerifyEmail?: boolean,
  isAuth?: boolean,
}

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
  updatedAt: string,
  status: 'register' | 'login',
  isVerifyEmail?: boolean,
  emailVerificationToken?: string
}

export type TCheckToken = {
  isValid: boolean,
  expiresAt: string,
  timeRemaining: number
}


export interface ILogin {
  email: string,
  password: string
}

export interface IRegister extends ILogin {
  name: string
}


