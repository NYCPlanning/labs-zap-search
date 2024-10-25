import { Injectable, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Client } from "@sendgrid/client";
import crypto from 'crypto';
import * as Sentry from "@sentry/browser";


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
    const id = crypto.randomUUID();
    const addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [list],
        "contacts": [{"email": email, "anonymous_id": id}]
      }
    }

    // If successful, this will add the request to the queue and return a 202
    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
    try {
      const result = await this.client.request(addRequest);
      return {isError: false, result: result, anonymous_id: id};
    } catch(error) {
      console.error(error, addRequest.body)
      Sentry.captureException({error, email, id, list})
      return {isError: true, ...error, request_body: addRequest.body};
    }
  }

  async checkCreate(importId: string, @Res() response, counter: number = 0, checksBeforeFail: number, pauseBetweenChecks: number, list: string, errorInfo: any) {
    if(counter >= checksBeforeFail) {
      console.error({
        code: 408,
        message: `Polling limit of ${checksBeforeFail} checks with a ${pauseBetweenChecks/1000} second delay between each has been reached.`,
        job_id: importId,
        errorInfo
      })
      Sentry.captureException({
        code: 408,
        message: `Polling limit of ${checksBeforeFail} checks with a ${pauseBetweenChecks/1000} second delay between each has been reached.`,
        job_id: importId,
        errorInfo
      })
      return { isError: true, code: 408, errorInfo }
    }

    await delay(pauseBetweenChecks);

    const confirmationRequest = {
      url: `/v3/marketing/contacts/imports/${importId}`,
      method:<HttpMethod> 'GET',
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/import-contacts-status
    try {
      const user = await this.client.request(confirmationRequest);
      if(user[1].status === "pending") {
        return await this.checkCreate(importId, response, counter + 1, checksBeforeFail, pauseBetweenChecks, list, errorInfo);
      } else if (["errored", "failed"].includes(user[1].status)) {
        console.error(user, errorInfo);
        Sentry.captureException(user, errorInfo);
        return {isError: true, user, errorInfo};
      }
      return {isError: false, status: user[1].status, ...user};
    } catch(error) {
      console.error(error, errorInfo);
      Sentry.captureException(error, errorInfo);
      return {isError: true, ...error, errorInfo};
    }
  }

}
