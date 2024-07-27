import jwt from 'jsonwebtoken'

const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: '1h' })
}

export default generateToken
