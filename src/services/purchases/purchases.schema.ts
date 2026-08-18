// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PurchasesService } from './purchases.class'

const productItemSchema = Type.Object({
  _id: ObjectIdSchema(),
  quantity: Type.Number()
})


// Main data model schema
export const purchasesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    UserID: ObjectIdSchema(),
    Products: Type.Array(productItemSchema),
    Date: Type.String(),
  },
  { $id: 'Purchases', additionalProperties: false }
)
export type Purchases = Static<typeof purchasesSchema>
export const purchasesValidator = getValidator(purchasesSchema, dataValidator)
export const purchasesResolver = resolve<PurchasesQuery, HookContext<PurchasesService>>({})

export const purchasesExternalResolver = resolve<Purchases, HookContext<PurchasesService>>({})

// Schema for creating new entries
export const purchasesDataSchema = Type.Pick(
  purchasesSchema, ['UserID', 'Products'], {
  $id: 'PurchasesData'
})
export type PurchasesData = Static<typeof purchasesDataSchema>
export const purchasesDataValidator = getValidator(purchasesDataSchema, dataValidator)
export const purchasesDataResolver = resolve<Purchases, HookContext<PurchasesService>>({
  Date: async () => {
    const date = new Date();

    return date.toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
})

// Schema for updating existing entries
export const purchasesPatchSchema = Type.Partial(purchasesSchema, {
  $id: 'PurchasesPatch'
})
export type PurchasesPatch = Static<typeof purchasesPatchSchema>
export const purchasesPatchValidator = getValidator(purchasesPatchSchema, dataValidator)
export const purchasesPatchResolver = resolve<PurchasesPatch, HookContext<PurchasesService>>({})

// Schema for allowed query properties
export const purchasesQueryProperties = Type.Pick(
  purchasesSchema, ['_id', 'UserID', 'Products', 'Date'])
export const purchasesQuerySchema = Type.Intersect(
  [
    querySyntax(purchasesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PurchasesQuery = Static<typeof purchasesQuerySchema>
export const purchasesQueryValidator = getValidator(purchasesQuerySchema, queryValidator)
export const purchasesQueryResolver = resolve<PurchasesQuery, HookContext<PurchasesService>>({})
