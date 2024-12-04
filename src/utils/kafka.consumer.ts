import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });

// Connect Kafka Consumer
export const connectKafkaConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'stock-updates', fromBeginning: true });
    console.log('✅ Kafka consumer connected successfully.');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`📥 Received message:`, {
          topic,
          partition,
          value: message.value?.toString(),
        });
      },
    });
  } catch (error: any) {
    console.error('❌ Failed to connect Kafka consumer:', error.message);
    throw error;
  }
};