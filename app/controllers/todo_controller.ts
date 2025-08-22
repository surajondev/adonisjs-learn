import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import { createUpdatePostValidator } from '#validators/todo'

export default class TodoController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Todo.all()
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const data = request.only(['title', 'description', 'status', 'priority'])
    const payload = await createUpdatePostValidator.validate(data)
    return await Todo.create(payload)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return await Todo.findByOrFail('id', params?.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const todo = await Todo.findByOrFail('id', params?.d)
    const data = request.only(['title', 'description', 'status', 'priority'])
    const payload = await createUpdatePostValidator.validate(data)
    todo.merge(payload)
    await todo.save()
    return todo
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const todo = await Todo.findByOrFail('id', params?.id)
    await todo.delete()
    return { message: 'Todo deleted successfully!' }
  }
}
