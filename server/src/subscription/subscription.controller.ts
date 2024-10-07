import { Controller, Get, Post, Param, Query, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { error } from "console";
import { Request } from "express";
import validateEmail from "../_utils/validate-email";
import client from "@sendgrid/client";

type HttpMethod = 'get'|'GET'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'delete'|'DELETE';

@Controller()
export class SubscriptionController {
  apiKey = "";

  constructor(
    private readonly config: ConfigService
   
  ) {
    this.apiKey = this.config.get("SENDGRID_ENVIRONMENT") ==="staging" ? this.config.get("SENDGRID_API_KEY_STAGING") : this.config.get("SENDGRID_API_KEY_PRODUCTION");
  }

  @Post("/subscribers")
  async addSubscriber(@Req() request: Request, @Res() response) {
    const userData = {
      "emails": [
        request.body.email
      ]
    };
    const sendgridRequest = {
      url: "/v3/marketing/contacts/search/emails",
      method:<HttpMethod> 'POST',
      body: userData
    }
      


    if (!validateEmail(request.body.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
    } else {
      client.setApiKey(this.apiKey);
      client.request(sendgridRequest)
        .then(([res, body]) => {
          // If it successfully returns results, that means the user already exists
          response.status(409).send({
            status: "error",
            error: "A user with that email address already exists."
          })
        })
        .catch(error => {
          switch (error.code) {
            case 400:
              response.status(400).send({
                error: "Invalid email address.",
                serverResponse: error
              })
              break;
          
            case 500:
              response.status(500).send({
                error: "Remote server error.",
                serverResponse: error
              })
              break;

            case 404:
              // The email does not exist in the database, we can move on to the next step of adding it
              response.status(200).send({
                message: "User does not exist, now we will move on to the next step."
              })
              break;

            default:
              response.status(error.code).send({
                error: "Unknown error.",
                serverResponse: error
              })
              break;
          }

          
        });
    }

  }
}
