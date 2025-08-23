import type { HttpContext } from '@adonisjs/core/http'
import Author from '#models/author'
import { createAuthorValidator } from '#validators/create_author'
// import { updateAuthorValidator } from '#validators/update_author_validator' // if you create it

export default class AuthorsController {
  // GET /authors
  async index({ response }: HttpContext) {
    const authors = await Author.all()
    return response.ok(authors)
  }

  // POST /authors
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAuthorValidator)
    const author = await Author.create(payload)
    return response.created(author)
  }

  // GET /authors/:id
  async show({ params, response }: HttpContext) {
    const author = await Author.findOrFail(params.id)
    return response.ok(author)
  }

  // PUT /authors/:id
  async update({ params, request, response }: HttpContext) {
    const author = await Author.findOrFail(params.id)
    // Here you would use an update validator
    const payload = request.all() // Be sure to validate this!
    author.merge(payload)
    await author.save()
    return response.ok(author)
  }

  // DELETE /authors/:id
  async destroy({ params, response }: HttpContext) {
    const author = await Author.findOrFail(params.id)
    await author.delete()
    return response.noContent()
  }
}
