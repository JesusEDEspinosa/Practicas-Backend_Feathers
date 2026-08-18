// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ProductsService } from './products.class'

// Main data model schema
export const productsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String({ minLength: 3 }),
    description: Type.String({ minLength: 10 }),
    price: Type.Number({ minimum: 0 }),
    imgUrl: Type.String({ pattern: '^(http|https)://' }),
    categories: Type.Array(Type.String({ minLength: 3 })),
    options: Type.Array(Type.String({ minLength: 3 })),
  },
  { $id: 'Products', additionalProperties: false }
)
export type Products = Static<typeof productsSchema>
export const productsValidator = getValidator(productsSchema, dataValidator)
export const productsResolver = resolve<ProductsQuery, HookContext<ProductsService>>({})

export const productsExternalResolver = resolve<Products, HookContext<ProductsService>>({})

// Schema for creating new entries
export const productsDataSchema = Type.Pick(
  productsSchema, ['name', 'description', 'price', 'imgUrl', 'categories', 'options'], {
  $id: 'ProductsData'
})
export type ProductsData = Static<typeof productsDataSchema>
export const productsDataValidator = getValidator(productsDataSchema, dataValidator)
export const productsDataResolver = resolve<ProductsData, HookContext<ProductsService>>({})

// Schema for updating existing entries
export const productsPatchSchema = Type.Partial(productsSchema, {
  $id: 'ProductsPatch'
})
export type ProductsPatch = Static<typeof productsPatchSchema>
export const productsPatchValidator = getValidator(productsPatchSchema, dataValidator)
export const productsPatchResolver = resolve<ProductsPatch, HookContext<ProductsService>>({})

// Schema for allowed query properties
export const productsQueryProperties = Type.Pick(
  productsSchema, ['_id', 'name', 'description', 'price', 'imgUrl', 'categories', 'options'])
export const productsQuerySchema = Type.Intersect(
  [
    querySyntax(productsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProductsQuery = Static<typeof productsQuerySchema>
export const productsQueryValidator = getValidator(productsQuerySchema, queryValidator)
export const productsQueryResolver = resolve<ProductsQuery, HookContext<ProductsService>>({})
