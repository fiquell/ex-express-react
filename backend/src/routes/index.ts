import express from 'express'
import { getRoot, signIn, signUp } from '../controllers/index.js'

const route = express.Router()

route.get('/', getRoot)
route.post('/sign-in', signIn)
route.post('/sign-up', signUp)

export default route
