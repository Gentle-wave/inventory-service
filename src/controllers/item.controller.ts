import { Request, Response } from 'express';
import Item, { IItem } from '../models/item.model';
import { publishEvent } from '../utils/kafka.publisher';

export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price === undefined || stock === undefined) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    // Create a new item
    const item = new Item({ name, description, price, stock });
    await item.save();

    res.status(201).json({ message: 'Item added successfully.', item });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding item.',
      error: error.message
    });
  }
};

// Update stock for an item
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      res.status(400).json({ message: 'Stock value is required.' });
      return;
    }

    const currentItem = await Item.findById(id);
    if (!currentItem) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }

    const previousStock = currentItem.stock;

    currentItem.stock = stock;
    const updatedItem = await currentItem.save();

    const changeType = stock > previousStock ? 'added' : 'reduced';
    const changeAmount = Math.abs(stock - previousStock);

    await publishEvent('stock_updates', {
      itemId: id,
      previousStock,
      newStock: updatedItem.stock,
      changeType, 
      changeAmount,
      updatedAt: new Date(),
    });

    res.status(200).json({
      message: `Stock ${changeType} successfully.`,
      item: updatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error updating stock.',
      error: error.message,
    });
  }
};


export const getItemStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: 'Item not found.' });
      return;
    }

    res.status(200).json({
      name: item.name,
      description: item.description,
      stock: item.stock,
      price: item.price
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching stock information.',
      error: error.message
    });
  }
};
