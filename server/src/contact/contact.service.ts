import {
  Injectable,
} from '@nestjs/common';
import {
  CrmService,
} from '../crm/crm.service';
import {
  all,
  comparisonOperator,
} from '../crm/crm.utilities';

@Injectable()
export class ContactService {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  async findOne(contactid: any): Promise<any> {
    const { records: [contact] } = await this.crmService.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        comparisonOperator('contactid', 'eq', contactid)
      ),
    });

    return contact;
  }

  async findByEmail(email): Promise<any> {
    const { records: [contact] } = await this.crmService.queryFromObject('contacts', {
      $filter: all(
        comparisonOperator('statuscode', 'eq', 1),
        `startswith(emailaddress1, '${email}')`,
      ),
    });

    return contact;
  }
}
