import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUpdateUserValidator } from '#validators/auth'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])
    const payload = await createUpdateUserValidator.validate(data)
    return await User.create(payload)
  }

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
    } catch (error) {
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

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
