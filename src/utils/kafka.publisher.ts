import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'], 
});

const producer = kafka.producer();

// Connect the Kafka producer
export const connectKafka = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('✅ Kafka connected successfully.');
  } catch (error: any) {
    console.error('❌ Failed to connect to Kafka:', error.message);
    throw error;
  }
};

// Publish an event to a Kafka topic
export const publishEvent = async (topic: string, message: object): Promise<void> => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`📤 Event published to topic "${topic}":`, message);
  } catch (error: any) {
    console.error('❌ Failed to publish event:', error.message);
    throw error;
  }
};
