import { Controller, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { SubscriberService } from "./subscriber.service";
import { Request } from "express";
import validateEmail from "../_utils/validate-email";

@Controller()
export class SubscriberController {
  apiKey = "";
  list = "";

  constructor(
    private readonly config: ConfigService,
    private readonly subscriberService: SubscriberService
  ) {
    this.apiKey = this.config.get("SENDGRID_API_KEY");
    this.list = this.config.get("SENDGRID_LIST");
  }

  @Post("/subscribers")
  async subscribe(@Req() request: Request, @Res() response) {
    if (!validateEmail(request.body.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
      return;
    }

    const existingUser = await this.subscriberService.findByEmail(request.body.email)
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
    const addToQueue = await this.subscriberService.create(request.body.email, this.list, response)

    if(addToQueue.isError) { 
      response.status(addToQueue.code).send({errors: addToQueue.response.body.errors})
      return;
    }

    response.status(200).send({
      status: "success",
    })
    return;

  }
}