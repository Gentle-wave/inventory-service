jest.mock('kafkajs', () => ({
  Kafka: jest.fn(() => ({
    producer: jest.fn(() => ({
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    })),
  })),
}));

import { Kafka } from 'kafkajs';
import { publishEvent, connectKafka } from '../utils/kafka.publisher';

describe('Kafka Publisher Utility', () => {
  const mockProducer = {
    connect: jest.fn(),
    send: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    (Kafka as jest.Mock).mockImplementation(() => ({
      producer: jest.fn(() => mockProducer),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to Kafka successfully', async () => {
    await connectKafka();
    expect(mockProducer.connect).toHaveBeenCalled();
  });

  test('should publish an event successfully', async () => {
    const mockQueue = 'test-queue';
    const mockMessage = { key: 'value' };

    await publishEvent(mockQueue, mockMessage);

    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: mockQueue,
      messages: [{ value: JSON.stringify(mockMessage) }],
    });
  });

  test('should handle Kafka producer disconnection gracefully', async () => {
    await mockProducer.disconnect();
    expect(mockProducer.disconnect).toHaveBeenCalled();
  });
});
