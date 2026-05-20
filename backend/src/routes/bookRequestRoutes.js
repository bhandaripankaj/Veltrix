import express from 'express'
import { createBookRequest, getAllBookRequests, getBookRequestById } from '../controllers/bookRequestController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Public: create a new request
router.post('/', createBookRequest)

// Protected: admin list and view
router.get('/', authenticateToken, getAllBookRequests)
router.get('/:id', authenticateToken, getBookRequestById)

export default router
