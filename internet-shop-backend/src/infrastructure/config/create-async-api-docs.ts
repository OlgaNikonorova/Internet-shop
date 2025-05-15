import { INestApplication } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

export async function createAsyncApiDocs(app: INestApplication<any>) {
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('AsyncAPI online-shop docs')
    .setDescription('The online shop async API description')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addBearerAuth()
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);

  await AsyncApiModule.setup('async-api', app, asyncapiDocument);
}
