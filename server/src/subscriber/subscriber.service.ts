import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import crypto from 'crypto';


type HttpMethod = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'delete'|'DELETE';

function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

@Injectable()
export class SubscriberService {
  constructor(
    private readonly config: ConfigService,
    private client: Client
  ) {
    this.client.setApiKey(this.config.get("SENDGRID_API_KEY"));
  }

  async findByEmail(email: string) {
    const searchRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method:<HttpMethod> 'POST',
      body: {
        "emails": [email]
      }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/get-contacts-by-emails
    try {
      const user = await this.client.request(searchRequest);
      return {isError: false, code: user[0].statusCode, ...user};
    } catch(error) {
      return {isError: true, ...error};
    }
  }
  async create(email: string, list: string, environment: string, subscriptions: object, @Res() response) {
    const custom_fields = Object.entries(subscriptions).reduce((acc, curr) => ({...acc, [`zap_${environment}_${curr[0]}`]: curr[1]}), {[`zap_${environment}_confirmed`]: 0})

    const addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [list],
        "contacts": [{
          "email": email,
          "anonymous_id": crypto.randomUUID(),
          custom_fields
        }]
      }
    }

    // If successful, this will add the request to the queue and return a 202
    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
    try {
      const result = await this.client.request(addRequest);
      return {isError: false, result: result};
    } catch(error) {
      return {isError: true, ...error};
    }
  }
}
