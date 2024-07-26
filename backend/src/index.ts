import express from 'express'
import route from './routes/index.js'

const app = express()
const port = 5174

app.use(express.json())
app.use(route)

app.listen(port, () => {
  console.log('Server is running on port:', port)
})
