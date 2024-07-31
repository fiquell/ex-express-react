import { Prisma } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken } from '../utils/jwt.js'

interface AuthorizationRequest extends Request {
  user?: Prisma.UserCreateInput
}

type Roles = 'user' | 'admin'
type DecodedJwtPayload = JwtPayload & Prisma.UserCreateInput

const authorization = (roles: Roles) => {
  return (req: AuthorizationRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      })
    }

    try {
      const decoded = verifyToken(token) as DecodedJwtPayload

      if (roles.length && !roles.includes(decoded.role!)) {
        return res.status(403).json({
          message: 'Access denied. Insufficient permissions.',
        })
      }

      req.user = decoded

      next()
    } catch (error) {
      console.error('Authorization error:', error)

      return res.status(400).json({
        message: 'Invalid token',
      })
    }
  }
}

export default authorization
