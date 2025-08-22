import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import { createUpdatePostValidator } from '#validators/todo'

export default class TodoController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const user = auth.user
    const todos = await user?.related('todo').query().orderBy('created_at', 'desc')
    return todos
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth }: HttpContext) {
    const user = auth?.user
    const data = request.only(['title', 'description', 'status', 'priority'])
    const payload = await createUpdatePostValidator.validate(data)
    return await user?.related('todo').create(payload)
  }

  /**
   * Show individual record
   */
  async show({ params, auth, response }: HttpContext) {
    const user = auth?.user!
    const todo = await Todo.query().where('id', params.id).where('user_id', user?.id).first()
    if (!todo) {
      return response.notFound({ message: 'Not found' })
    }
    return todo
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth, response }: HttpContext) {
    const user = auth?.user!
    const todo = await Todo.query().where('id', params.id).where('user_id', user?.id).first()
    if (!todo) {
      return response.notFound({ message: 'Cannot perform edit' })
    }
    const data = request.only(['title', 'description', 'status', 'priority'])
    const payload = await createUpdatePostValidator.validate(data)
    todo.merge(payload)
    await todo.save()
    return todo
  }

  /**
   * Delete record
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth?.user!
    const todo = await Todo.query().where('id', params.id).where('user_id', user?.id).first()
    if (!todo) {
      return response.notFound({ message: 'Not Delete' })
    }
    await todo.delete()
    return { message: 'Todo deleted successfully!' }
  }
}
