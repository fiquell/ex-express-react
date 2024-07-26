import { Request, Response } from 'express'
import { signIn } from './sign-in.js'
import { signUp } from './sign-up.js'

const getRoot = (req: Request, res: Response) => {
  return res.status(200).json({
    message: 'Success',
  })
}

export { getRoot, signIn, signUp }
