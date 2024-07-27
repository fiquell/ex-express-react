import { NextFunction, Request, Response } from 'express'
import { Result, ValidationChain, validationResult } from 'express-validator'

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const result: Result = validationResult(req)

    if (!result.isEmpty()) {
      return res.status(400).json({
        error: result.array(),
      })
    }

    next()
  }
}

export default validate
