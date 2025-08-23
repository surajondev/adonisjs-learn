import vine from '@vinejs/vine'

export const createUpdatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    description: vine.string().trim().minLength(6),
    status: vine.string().trim().in(['pending', 'in-progress', 'completed']),
    priority: vine.number().in([1, 2, 3]),
  })
)
