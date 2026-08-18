// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Purchases,
  PurchasesData,
  PurchasesPatch,
  PurchasesQuery,
  PurchasesService
} from './purchases.class'

export type { Purchases, PurchasesData, PurchasesPatch, PurchasesQuery }

export type PurchasesClientService = Pick<
  PurchasesService<Params<PurchasesQuery>>,
  (typeof purchasesMethods)[number]
>

export const purchasesPath = 'purchases'

export const purchasesMethods: Array<keyof PurchasesService> = ['find', 'get', 'create', 'patch', 'remove']

export const purchasesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(purchasesPath, connection.service(purchasesPath), {
    methods: purchasesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [purchasesPath]: PurchasesClientService
  }
}
