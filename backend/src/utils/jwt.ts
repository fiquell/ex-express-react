import jwt from 'jsonwebtoken'

const generateToken = (name: string, role: string) => {
  return jwt.sign({ name, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })
}

export { generateToken }
