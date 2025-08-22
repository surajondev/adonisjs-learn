import type { HttpContext } from '@adonisjs/core/http'
import Note from '#models/note'

export default class NoteController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Note.all()
  }

  async store({ request }: HttpContext) {
    const data = request.only(['title', 'content'])
    return await Note.create(data)
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    return Note.findByOrFail('id', params?.id)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const note = await Note.findByOrFail('id', params?.id)
    note.merge(request.only(['title', 'content']))
    note.save()
    return note
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const note = await Note.findByOrFail('id', params?.id)
    note.delete()
    return { message: 'Note deleted successfully' }
  }
}
