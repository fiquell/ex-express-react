import { Request, Response } from 'express'
import prisma from '../config/db.js'

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()

    return res.status(200).json({
      users,
      total: users.length,
    })
  } catch (error) {
    console.error('Error fetching users:', error)

    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

export { getUsers }
