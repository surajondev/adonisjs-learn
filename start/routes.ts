/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const NoteController = () => import('#controllers/note_controller')
const TodoController = () => import('#controllers/todo_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('notes', NoteController)
router
  .group(() => {
    router.resource('todos', TodoController)
  })
  .use(middleware.auth())

router.post('/auth/register', '#controllers/auth_controller.register')
router.post('/auth/login', '#controllers/auth_controller.login')
router.post('/auth/logout', '#controllers/auth_controller.logout')
router.get('/auth/me', '#controllers/auth_controller.me').use(middleware.auth())
