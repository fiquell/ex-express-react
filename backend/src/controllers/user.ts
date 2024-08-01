import { Request, Response } from 'express'
import prisma from '../config/db.js'
import { BodyRequest, UserRequest } from '../types/user.js'

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

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    return res.status(400).json({
      message: 'Invalid user ID',
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching users:', error)

    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

const updateUserById = async (req: BodyRequest, res: Response) => {
  const { id } = req.params
  const { name } = req.body

  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    return res.status(400).json({
      message: 'Invalid user ID',
    })
  }

  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    return res.status(403).json({
      message: 'Access denied. You can only update your own account.',
    })
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    })

    return res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching users:', error)

    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

const deleteUserById = async (req: UserRequest, res: Response) => {
  const { id } = req.params

  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    return res.status(400).json({
      message: 'Invalid user ID',
    })
  }

  if (req.user?.role !== 'admin' && req.user?.id !== userId) {
    return res.status(403).json({
      message: 'Access denied. You can only delete your own account.',
    })
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return res.status(200).json({
      user,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error fetching users:', error)

    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

export { deleteUserById, getUserById, getUsers, updateUserById }
