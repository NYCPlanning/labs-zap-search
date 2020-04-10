import { 
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from '../_utils/postgres-typeorm-case-insensitive-like';
import { ConfigService } from '../config/config.service';
import { OdataService } from '../odata/odata.service';
import { all, comparisonOperator } from '../odata/odata.module';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    private readonly dynamicsWebApi: OdataService,
    private readonly config: ConfigService,
  ) {}

  async findOne(contactid: any): Promise<any> {
    const { records: [contact] } = await this.dynamicsWebApi.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        comparisonOperator('contactid', 'eq', contactid)
      ),
    });

    return contact;
  }

  async findByEmail(email): Promise<any> {
    const { records: [contact] } = await this.dynamicsWebApi.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        `startswith(emailaddress1, '${email}')`,
      ),
    });

    return contact;
  }
}
