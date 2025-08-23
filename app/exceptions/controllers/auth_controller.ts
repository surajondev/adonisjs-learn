// app/Controllers/Http/AuthController.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
export default class AuthController {
  /**
   * Register new user
   */
  public async register({ request, response }: HttpContext) {
    const data = request.only(['email', 'password', 'first_name', 'second_name', 'role'])
    const user = await User.create(data)
    return response.json({ user })
  }

  /**
   * Login user and create session
   */
  public async login({ request, auth, response }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      return response.json({
        message: 'Login successful',
        user: user,
      })
    } catch {
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

  /**
   * Logout user and destroy session
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.json({ message: 'Logged out' })
  }

  /**
   * Get authenticated user (session check)
   */
  public async me({ auth, response }: HttpContext) {
    return response.json({ user: auth.user })
  }
}
