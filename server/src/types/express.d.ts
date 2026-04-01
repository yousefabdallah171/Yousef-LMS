declare namespace Express {
  interface Request {
    user?: {
      id: string
      role: 'admin' | 'student'
    }
  }
}
