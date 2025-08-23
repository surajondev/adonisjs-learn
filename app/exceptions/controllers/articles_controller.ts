import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import { createArticleValidator } from '#validators/create_article'
// import { updateArticleValidator } from '#validators/update_article_validator'

export default class ArticlesController {
  // GET /articles
  async index({ response }: HttpContext) {
    // .includes(:author) => .preload('author')
    const articles = await Article.query().preload('author').orderBy('createdAt', 'desc')
    return response.ok(articles)
}

  // POST /articles
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createArticleValidator)
    const article = await Article.create(payload)
    await article.load('author') // Load the relationship to return it
    return response.created(article)
  }

  // GET /articles/:id
  async show({ params, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await article.load('author')
    return response.ok(article)
  }

  // GET /articles/slug/:slug (Custom Route)
  async showBySlug({ params, response }: HttpContext) {
    const article = await Article.query().where('slug', params.slug).preload('author').first()

    if (!article) {
      return response.notFound({ error: 'Article not found' })
    }
    return response.ok(article)
  }

  // GET /authors/:author_id/articles (Custom Route)
  async byAuthor({ params, response }: HttpContext) {
    const articles = await Article.query().where('authorId', params.author_id).preload('author')
    return response.ok(articles)
  }

  // PUT /articles/:id
  async update({ params, request, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    // Ideally, use an updateArticleValidator here
    const payload = request.all() // VALIDATE THIS!
    article.merge(payload)
    await article.save()
    await article.load('author')
    return response.ok(article)
  }

  // DELETE /articles/:id
  async destroy({ params, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)
    await article.delete()
    return response.noContent()
  }
}
