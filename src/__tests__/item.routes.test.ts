import supertest from 'supertest';
import app from '../index';
import mongoose from 'mongoose';
import Item from '../models/item.model';

const request = supertest(app);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/inventory-test',)
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the test database
  await Item.deleteMany({});
});

describe('Item API Endpoints', () => {
  it('should add a new item', async () => {
    const res = await request.post('/api/items/add').send({
      name: 'Sample Item',
      description: 'A test item',
      price: 10,
      stock: 100,
    });

    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe('Sample Item');
  });

  it('should update stock for an item', async () => {
    const item = await Item.create({
      name: 'Sample Item',
      description: 'A test item',
      price: 10,
      stock: 100,
    });

    const res = await request.patch(`/api/items/update-stock/${item._id}`).send({
      stock: 50,
    });

    expect(res.status).toBe(200);
    expect(res.body.item.stock).toBe(50);
  });

  it('should fetch stock information for an item', async () => {
    const item = await Item.create({
      name: 'Sample Item',
      description: 'A test item',
      price: 10,
      stock: 100,
    });

    const res = await request.get(`/api/items/stock/${item._id}`);
    expect(res.status).toBe(200);
    expect(res.body.stock).toBe(100);
  });
});
