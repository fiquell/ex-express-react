import { Prisma } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { body } from 'express-validator'
import prisma from '../config/db.js'
import generateToken from '../utils/generate-token.js'

interface SignUpRequest extends Request {
  body: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'password'>
}

interface SignInRequest extends Request {
  body: Pick<Prisma.UserCreateInput, 'email' | 'password'>
}

const validateSignUp = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
]

const validateSignIn = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
]

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

const signIn = async (req: SignInRequest, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    return res.status(200).json({
      message: 'Sign in successful',
      token: generateToken(user.id, user.email),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Error signing in:', error)

    return res.status(500).json({
      message: 'An error occurred while signing in',
    })
  }
}

export { signIn, signUp, validateSignIn, validateSignUp }
