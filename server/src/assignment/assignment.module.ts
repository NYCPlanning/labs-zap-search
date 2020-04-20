import { Module } from '@nestjs/common';
import { ContactModule } from '../contact/contact.module';
import { OdataModule } from '../odata/odata.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [
    ContactModule,
    OdataModule,
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
