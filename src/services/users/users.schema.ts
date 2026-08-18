// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UsersService } from './users.class'

// Main data model schema
export const usersSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    password: Type.String({ minLength: 6 }),
    first_name: Type.String({ minLength: 3 }),
    last_name: Type.String({ minLength: 3 }),
    username: Type.String({ minLength: 3 }),
    email: Type.String({ format: 'email' }),
    gender: Type.String({ enum: ['Masculino', 'Femenino'] }),
  },
  { $id: 'Users', additionalProperties: false }
)
export type Users = Static<typeof usersSchema>
export const usersValidator = getValidator(usersSchema, dataValidator)
export const usersResolver = resolve<UsersQuery, HookContext<UsersService>>({})

export const usersExternalResolver = resolve<Users, HookContext<UsersService>>({
  password: async () => '********'
})

// Schema for creating new entries
export const usersDataSchema = Type.Pick(
  usersSchema, ['password', 'first_name', 'last_name', 'username', 'email', 'gender'], {
  $id: 'UsersData'
})
export type UsersData = Static<typeof usersDataSchema>
export const usersDataValidator = getValidator(usersDataSchema, dataValidator)
export const usersDataResolver = resolve<UsersData, HookContext<UsersService>>({})

// Schema for updating existing entries
export const usersPatchSchema = Type.Partial(usersSchema, {
  $id: 'UsersPatch'
})
export type UsersPatch = Static<typeof usersPatchSchema>
export const usersPatchValidator = getValidator(usersPatchSchema, dataValidator)
export const usersPatchResolver = resolve<UsersPatch, HookContext<UsersService>>({})

// Schema for allowed query properties
export const usersQueryProperties = Type.Pick(
  usersSchema, ['_id', 'first_name', 'last_name', 'username', 'email', 'gender'])
export const usersQuerySchema = Type.Intersect(
  [
    querySyntax(usersQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type UsersQuery = Static<typeof usersQuerySchema>
export const usersQueryValidator = getValidator(usersQuerySchema, queryValidator)
export const usersQueryResolver = resolve<UsersQuery, HookContext<UsersService>>({})
