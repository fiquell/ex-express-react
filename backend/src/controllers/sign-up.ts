import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import prisma from '../config/db.js'

interface SignUpRequest extends Request {
  body: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'password'>
}

const signUp = async (req: SignUpRequest, res: Response) => {
  const { email, name, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already in use',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)

    return res.status(500).json({
      message: 'An error occurred while creating the user',
    })
  }
}

export { signUp }
