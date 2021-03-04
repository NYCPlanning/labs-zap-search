import { Module } from '@nestjs/common';
import { ContactModule } from '../contact/contact.module';
import { CrmModule } from '../crm/crm.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  imports: [
    ContactModule,
    CrmModule,
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
