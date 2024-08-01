import bcrypt from 'bcrypt'
import { Response } from 'express'
import { body } from 'express-validator'
import prisma from '../config/db.js'
import { BodyRequest } from '../types/user.js'
import { generateToken } from '../utils/jwt.js'

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

const signUp = async (req: BodyRequest, res: Response) => {
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
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)

    return res.status(500).json({
      message: 'An error occurred while creating the user',
    })
  }
}

const signIn = async (req: BodyRequest, res: Response) => {
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
      token: generateToken(user.id, user.name, user.role),
      user: {
        name: user.name,
        role: user.role,
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
