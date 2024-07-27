import express from 'express'
import router from './routes/router.js'

const app = express()
const port = 5174

app.use(express.json())
app.use(router)

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Success',
  })
})

app.listen(port, () => {
  console.log('Server is running on port:', port)
})
