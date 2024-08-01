import express from 'express'
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '../controllers/user.js'
import authorization from '../middlewares/authorization.js'

const router = express.Router()

router.get('/', authorization('admin'), getUsers)
router.get('/:id', authorization('admin'), getUserById)
router.put('/:id', authorization(['user', 'admin']), updateUserById)
router.patch('/:id', authorization(['user', 'admin']), updateUserById)
router.delete('/:id', authorization(['user', 'admin']), deleteUserById)

export default router
