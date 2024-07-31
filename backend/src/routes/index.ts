import express from 'express'
import auth from './auth.js'
import user from './user.js'

const router = express.Router()

router.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Success',
    method: req.method,
  })
})

router.use('/auth', auth)
router.use(['/user', '/users'], user)

export default router
