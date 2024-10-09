import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";

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

  async create(email: string, list: string, @Res() response) {
    const addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [list],
        "contacts": [{"email": email}]
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

  async checkCreate(email: string, @Res() response, counter: number = 0, checksBeforeFail: number, pauseBetweenChecks: number, list: string) {
    if(counter >= checksBeforeFail) {
      return { isError: true, code: 408 }
    }
    
    await delay(pauseBetweenChecks);

    const existingUser = await this.findByEmail(email);
    
    if(![200, 404].includes(existingUser.code)) {
      console.error(existingUser.code, existingUser.message);
      return { isError: true, code: existingUser.code, message: existingUser.message }
    }
    
    if(existingUser[0] && existingUser[0].body.result[email].contact["list_ids"].includes(list)) {
      // Success!
      return { isError: false, code: 200, ...existingUser };
    }

    return await this.checkCreate(email, response, counter + 1, checksBeforeFail, pauseBetweenChecks, list);
  }
}
