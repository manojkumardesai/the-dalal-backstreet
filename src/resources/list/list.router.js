import { Router } from 'express'
import controllers from './list.controllers'

const router = Router()

// /api/list
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)

// /api/list/:id
router
  .route('/:id')
  .get(controllers.getOneStock)
  .put(controllers.updateStockPrice)
  .delete(controllers.removeOne)

export default router
