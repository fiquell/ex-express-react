import express from 'express'
import { body } from 'express-validator'
import { signIn, signUp } from '../controllers/auth.js'
import validate from '../middlewares/validate.js'

const router = express.Router()

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

router.post('/signup', validate(validateSignUp), signUp)
router.post('/signin', validate(validateSignIn), signIn)

export default router
