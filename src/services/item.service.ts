import Item from '../models/item.model';

/**
 * Create a new item in the inventory.
 * @param name - The name of the item.
 * @param description - The description of the item.
 * @param stock - The stock quantity of the item.
 */
export const createItem = async (name: string, description: string, stock: number) => {
  const item = new Item({ name, description, stock });
  return await item.save();
};

/**
 * Update the stock level for an existing item.
 * @param id - The ID of the item to update.
 * @param stock - The new stock quantity.
 */
export const updateItemStock = async (id: string, stock: number) => {
  const item = await Item.findByIdAndUpdate(
    id,
    { $set: { stock } },
    { new: true, runValidators: true }
  );
  return item;
};

/**
 * Retrieve an item by its ID.
 * @param id - The ID of the item to retrieve.
 */
export const getItemById = async (id: string) => {
  return await Item.findById(id);
};

/**
 * Get all items in the inventory.
 */
export const getAllItems = async () => {
  return await Item.find();
};
