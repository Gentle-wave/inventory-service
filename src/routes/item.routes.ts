import express from 'express';
import {
  addItem,
  updateStock,
  getItemStock,
} from '../controllers/item.controller';

const router = express.Router();

// Route to add a new item
router.post('/add', addItem);

// Route to update stock for an item
router.patch('/update-stock/:id', updateStock);

// Route to get stock information for an item
router.get('/stock/:id', getItemStock);

export default router;
