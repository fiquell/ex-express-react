import express from 'express'
import {
  signIn,
  signUp,
  validateSignIn,
  validateSignUp,
} from '../controllers/auth.js'
import validate from '../middlewares/validate.js'

const router = express.Router()

router.post('/signup', validate(validateSignUp), signUp)
router.post('/signin', validate(validateSignIn), signIn)

export default router
