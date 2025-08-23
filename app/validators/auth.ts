import vine from '@vinejs/vine'

export const createUpdateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(6),
    email: vine.string().email(),
    password: vine.string(),
  })
)
