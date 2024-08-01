import { NextFunction, Response } from 'express'
import { DecodedJwtPayload, Roles, UserRequest } from '../types/user.js'
import { verifyToken } from '../utils/jwt.js'

const authorization = (roles: Roles | Roles[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      })
    }

    try {
      const decoded = verifyToken(token) as DecodedJwtPayload
      const allowedRoles = Array.isArray(roles) ? roles : [roles]

      if (!allowedRoles.includes(decoded.role as Roles)) {
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
