import {
  Injectable,
} from '@nestjs/common';
import { OdataService } from '../odata/odata.service';
import { all, comparisonOperator } from '../odata/odata.module';

@Injectable()
export class ContactService {
  constructor(
    private readonly odata: OdataService,
  ) {}

  async findOne(contactid: any): Promise<any> {
    const { records: [contact] } = await this.odata.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        comparisonOperator('contactid', 'eq', contactid)
      ),
    });

    return contact;
  }

  async findByEmail(email): Promise<any> {
    const { records: [contact] } = await this.odata.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        `startswith(emailaddress1, '${email}')`,
      ),
    });
    console.log(contact, email);
    return contact;
  }
}
