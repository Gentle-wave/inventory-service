import supertest from 'supertest';
import app from '../../index'; // Assuming index.ts is the entry point
import mongoose from 'mongoose';
import Item from '../../models/item.model';
import connectDB from '../../config/db'

const request = supertest(app);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Item.deleteMany({});
});

describe('End-to-End Inventory Flow', () => {
  it('should create an item, update stock, and publish event', async () => {
    // Create item
    const res = await request.post('/api/items/add').send({
      name: 'Test Item',
      description: 'Test Description',
      price: 10,
      stock: 100,
    });

    expect(res.status).toBe(201);
    expect(res.body.item.name).toBe('Test Item');

    const createdItem = res.body.item;

    // Update stock
    const updateRes = await request.patch(`/api/items/update-stock/${createdItem._id}`).send({
      stock: 200,
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.item.stock).toBe(200);
    
    // Check event was published (mocked in the integration test)
  });

  it('should fail if there is insufficient stock', async () => {
    const res = await request.post('/api/items/add').send({
      name: 'Test Item',
      description: 'Test Description',
      price: 10,
      stock: 10,
    });

    const createdItem = res.body.item;

    const updateRes = await request.patch(`/api/items/update-stock/${createdItem._id}`).send({
      stock: 15,
    });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.message).toBe('Insufficient stock for the item');
  });
});
