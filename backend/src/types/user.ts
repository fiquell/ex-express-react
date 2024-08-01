import { User } from '@prisma/client'
import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

type Roles = 'user' | 'admin'
type DecodedJwtPayload = JwtPayload & User

interface UserRequest extends Request {
  user?: User
}

interface BodyRequest extends UserRequest {
  body: User
}

export { BodyRequest, DecodedJwtPayload, Roles, UserRequest }
