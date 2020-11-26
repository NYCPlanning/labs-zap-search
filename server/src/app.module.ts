import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieparser from 'cookie-parser';
import * as compression from 'compression';
import { AuthMiddleware } from './auth.middleware';
import { ConfigModule } from './config/config.module';
import { ProjectModule } from './project/project.module';
import { AppController } from './app.controller';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { DispositionModule } from './disposition/disposition.module';
import { OdataModule } from './odata/odata.module';
import { AssignmentModule } from './assignment/assignment.module';
import { DocumentModule } from './document/document.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [
    ProjectModule,
    ContactModule,
    ConfigModule,
    CrmModule,
    AuthModule,
    DispositionModule,
    OdataModule,
    AssignmentModule,
    DocumentModule,
   ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieparser())
      .forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');

    consumer
      .apply(bodyParser.json({
        type: 'application/vnd.api+json'
      }))
      .forRoutes('*');

    consumer
      .apply(compression())
      .forRoutes('*');
  }
}
