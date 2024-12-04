import Item from '../models/item.model';

describe('Item Model', () => {
  it('should correctly validate a valid item', async () => {
    const validItem = new Item({
      name: 'Sample Item',
      description: 'A test item',
      price: 10,
      stock: 100,
    });

    const savedItem = await validItem.validate();
    expect(savedItem).toBeUndefined();
  });

  it('should throw validation error for missing fields', async () => {
    const invalidItem = new Item({});

    try {
      await invalidItem.validate();
    } catch (error: any) {
      expect(error.errors).toHaveProperty('name');
      expect(error.errors).toHaveProperty('description');
    }
  });
});
