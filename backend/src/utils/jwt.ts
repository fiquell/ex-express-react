import jwt from 'jsonwebtoken'

const generateToken = (id: number, name: string, role: string) => {
  return jwt.sign({ id, name, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })
}

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

export { generateToken, verifyToken }
