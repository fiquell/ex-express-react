import express from 'express'
import { getUsers } from '../controllers/user.js'
import authorization from '../middlewares/authorization.js'

const router = express.Router()

router.get('/', authorization('admin'), getUsers)

export default router
