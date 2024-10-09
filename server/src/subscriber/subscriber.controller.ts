import { Controller, Get, Post, Param, Query, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { Request } from "express";
import validateEmail from "../_utils/validate-email";
import client from "@sendgrid/client";

type HttpMethod = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'delete'|'DELETE';

const PAUSE_BETWEEN_CHECKS = 3000;
const CHECKS_BEFORE_FAIL = 10;

function delay(milliseconds){
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

@Controller()
export class SubscriberController {
  apiKey = "";
  list = "";

  constructor(
    private readonly config: ConfigService
   
  ) {
    this.apiKey = this.config.get("SENDGRID_API_KEY");
    this.list = this.config.get("SENDGRID_LIST");
  }

  @Post("/subscribers")
  async subscribe(@Req() request: Request, @Res() response) {
    const searchRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method:<HttpMethod> 'POST',
      body: {
        "emails": [request.body.email]
      }
    }
    const addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [this.list],
        "contacts": [{"email": request.body.email}]
      }
    }
      
    if (!validateEmail(request.body.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
      return;
    }
    
    client.setApiKey(this.apiKey);

    const existingUser = await this.searchByEmail(request.body.email)
    if(![200, 404].includes(existingUser.code)) {
      console.error(existingUser.code, existingUser.message);
      response.status(existingUser.code).send({ error: existingUser.message })
      return;
    }

    // If the id is already in the list_ids, then they are also already on the list
    if(existingUser[0] && existingUser[0].body.result[request.body.email].contact["list_ids"].includes(this.list)) {
      response.status(409).send({
        status: "error",
        error: "A user with that email address already exists, and they are already in the desired list.",
      })
      return;
    }

    // If we have reached this point, the user either doesn't exist or isn't signed up for the list
    const addToQueue = await this.addSubscriber(request.body.email, response)

    if(addToQueue.isError) { return; }

    // Now we keep checking to make sure the import was successful
    const importConfirmation = await this.checkSuccessfulImport(request.body.email, response, 0)

    if(importConfirmation.isError && (importConfirmation.code === 408)) {
      response.status(408).send({
        status: "error",
        error: `Was not able to receive confirmation user information was updated in within ${PAUSE_BETWEEN_CHECKS * CHECKS_BEFORE_FAIL / 1000} seconds`,
      })
      return;
    } else if (importConfirmation.isError) {
      response.status(importConfirmation.code).send({
        status: "error",
        error: importConfirmation.message
      })
      return;
    }

    response.status(200).send({
      status: "success",
      user: importConfirmation[0].body.result[request.body.email]
    })
    return;

  }

  async searchByEmail(email: string) {
    const searchRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method:<HttpMethod> 'POST',
      body: {
        "emails": [email]
      }
    }

    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/get-contacts-by-emails
    try {
      const user = await client.request(searchRequest);
      return {isError: false, code: user[0].statusCode, ...user};
    } catch(error) {
      return {isError: true, ...error};
    }
  }


  async addSubscriber(email: string, @Res() response) {
    const addRequest = {
      url: "/v3/marketing/contacts",
      method:<HttpMethod> 'PUT',
      body: {
        "list_ids": [this.list],
        "contacts": [{"email": email}]
      }
    }

    // If successful, this will add the request to the queue and return a 202
    // https://www.twilio.com/docs/sendgrid/api-reference/contacts/add-or-update-a-contact
    try {
      const result = await client.request(addRequest);
      return {isError: false, result: result};
    } catch(error) {
      response.status(error.code).send({errors: error.response.body.errors})
      return {isError: true, ...error};
    }
  }


  async checkSuccessfulImport(email: string, @Res() response, counter = 0) {
    if(counter >= CHECKS_BEFORE_FAIL) {
      return { isError: true, code: 408 }
    }
    
    await delay(PAUSE_BETWEEN_CHECKS);

    const existingUser = await this.searchByEmail(email);
    
    if(![200, 404].includes(existingUser.code)) {
      console.error(existingUser.code, existingUser.message);
      return { isError: true, code: existingUser.code, message: existingUser.message }
    }
    

    if(existingUser[0] && existingUser[0].body.result[email].contact["list_ids"].includes(this.list)) {
      // Success!
      return { isError: false, code: 200, ...existingUser };
    }

    return await this.checkSuccessfulImport(email, response, counter + 1);
  }

}