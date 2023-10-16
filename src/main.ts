import { NestFactory } from '@nestjs/core';
import { KafkaModule } from './kafka.module';
import { KafkaService } from './kafka.service';

async function bootstrap() {
  const app = await NestFactory.create(KafkaModule);
  await app.listen(3000);

  new KafkaService().onModuleInit()

}
bootstrap();