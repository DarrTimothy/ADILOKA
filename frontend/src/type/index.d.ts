export interface AuthRoot {
  success: boolean
  message: string
  result: AuthResult
}

export interface AuthResult {
  id: number
  username: string
  email: string
  role: string
  access_token: string
  expires_in: number
}
