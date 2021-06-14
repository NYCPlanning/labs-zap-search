import { Injectable } from "@nestjs/common";
import { CrmService } from "../crm/crm.service";
import buildQuery from "odata-query";

@Injectable()
export class ContactService {
  constructor(private readonly crmService: CrmService) {}

  async findOne(contactId: any): Promise<any> {
    const {
      records: [contact]
    } = await this.crmService.query(
      "contacts",
      buildQuery({
        filter: [{ statuscode: 1 }, { contactid: contactId }]
      })
    );

    return contact;
  }

  async findByEmail(email: string): Promise<any> {
    const {
      records: [contact]
    } = await this.crmService.query(
      "contacts",
      buildQuery({
        filter: [{ statuscode: 1 }, `startswith(emailaddress1, '${email}')`]
      })
    );
    return contact;
  }
}
