import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, logLevel } from 'kafkajs';
import { config } from 'dotenv';
config();



@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly consumer: Consumer;

  constructor() {
    const Array = process.env.BROKERS_CLUSTER.split(",")  // Сделал массив брокеров в зависимости от контура

    const kafka = new Kafka({
      clientId: 'spd-kafka',
      brokers: Array.map(broker => broker.trim()),
      connectionTimeout: 3000,
      logLevel: logLevel.ERROR,
      ssl: {
        rejectUnauthorized: false,
        // ca: fs.readFileSync('./cert-ssl/test/ssl.ca.pem', 'utf-8'),
      },
      sasl: {
        mechanism: "",
        username: "",
        password: ""
      }
    })

    this.consumer = kafka.consumer({ groupId: 'nameGroup.2' })
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'nameTopic', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value?.toString(),
          headers: message.headers,
          key: message.key.toString()
        });
      },
    });
  }
}