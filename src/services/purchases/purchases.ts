// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from "@feathersjs/authentication"
import { BadRequest } from '@feathersjs/errors'
import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  purchasesDataValidator,
  purchasesPatchValidator,
  purchasesQueryValidator,
  purchasesResolver,
  purchasesExternalResolver,
  purchasesDataResolver,
  purchasesPatchResolver,
  purchasesQueryResolver
} from './purchases.schema'

import type { Application } from '../../declarations'
import { PurchasesService, getOptions } from './purchases.class'
import { purchasesPath, purchasesMethods } from './purchases.shared'

export * from './purchases.class'
export * from './purchases.schema'

const validateUser = async (context: any) => {
  const data = context.data;
  const { app } = context;

  if (data.UserID) {
    try {
      await app.service('users').get(data.UserID);
    } catch (error: any) {
      if (error.name === 'NotFound') {
        throw new BadRequest('El Usuario no existe en la base de datos');
      }
      throw error;
    }
  }
  return context;
};

const validateProduct = async (context: any) => {
  const data = context.data;
  const { app } = context;

  if (data.Products) {
    if (data.Products.length === 0) {
      throw new BadRequest('La compra debe incluir al menos un producto');
    }
    try {
      for (const item of data.Products) {
        await app.service('products').get(item._id);
      }
    } catch (error: any) {
      if (error.name === 'NotFound') {
        throw new BadRequest('Algun producto no existe en la base de datos');
      }
      throw error;
    }
  }
  return context;
};

// A configure function that registers the service and its hooks via `app.configure`
export const purchases = (app: Application) => {
  // Register our service on the Feathers application
  app.use(purchasesPath, new PurchasesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: purchasesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(purchasesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(purchasesExternalResolver),
        schemaHooks.resolveResult(purchasesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(purchasesQueryValidator),
        schemaHooks.resolveQuery(purchasesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(purchasesDataValidator),
        schemaHooks.resolveData(purchasesDataResolver),
        validateUser,
        validateProduct,
      ],
      patch: [
        schemaHooks.validateData(purchasesPatchValidator),
        schemaHooks.resolveData(purchasesPatchResolver),
        validateUser,
        validateProduct
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [purchasesPath]: PurchasesService
  }
}
