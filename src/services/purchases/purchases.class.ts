// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Purchases, PurchasesData, PurchasesPatch, PurchasesQuery } from './purchases.schema'

export type { Purchases, PurchasesData, PurchasesPatch, PurchasesQuery }

export interface PurchasesParams extends MongoDBAdapterParams<PurchasesQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class PurchasesService<ServiceParams extends Params = PurchasesParams> extends MongoDBService<
  Purchases,
  PurchasesData,
  PurchasesParams,
  PurchasesPatch
> {}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('purchases'))
  }
}
