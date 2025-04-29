import { Controller, Get, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { SubscriberService, ValidSubscriptionSet } from "./subscriber.service";
import { Request } from "express";
import validateEmail from "../_utils/validate-email";
import * as Sentry from "@sentry/nestjs";
import crypto from 'crypto';
import { isElement } from "underscore";

const PAUSE_BETWEEN_CHECKS = 30000;
const CHECKS_BEFORE_FAIL = 20;

@Controller()
export class SubscriberController {
  apiKey = "";
  list = "";
  sendgridEnvironment = "";

  constructor(
    private readonly config: ConfigService,
    private readonly subscriberService: SubscriberService
  ) {
    this.apiKey = this.config.get("SENDGRID_API_KEY");
    this.list = this.config.get("SENDGRID_LIST");
    this.sendgridEnvironment = this.config.get("SENDGRID_ENVIRONMENT")
  }

  @Post("/subscribers")
  async subscribe(@Req() request: Request, @Res() response) {
    if (!validateEmail(request.body.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
      return;
    }

    if (!this.subscriberService.validateSubscriptions(request.body.subscriptions)) {
      response.status(400).send({
        error: "Invalid list of subscriptions."
      })
      return;
    }

    const existingUser = await this.subscriberService.findByEmail(request.body.email)
    if (![200, 404].includes(existingUser.code)) {
      console.error(existingUser.code, existingUser.message);
      Sentry.captureException(existingUser)
      response.status(existingUser.code).send({ error: existingUser.message })
      return;
    }

    // If the id is already in the list_ids, then they are also already on the list
    if (existingUser[0] && existingUser[0].body.result[request.body.email].contact["list_ids"].includes(this.list)) {
      response.status(409).send({
        status: "error",
        error: "A user with that email address already exists, and they are already in the desired list.",
      })
      console.error({...existingUser, message: "A user with that email address already exists, and they are already in the desired list."})
      Sentry.captureException({...existingUser, message: "A user with that email address already exists, and they are already in the desired list."})
      return;
    }

    // If we have reached this point, the user either doesn't exist or isn't signed up for the list
    const id = crypto.randomUUID();
    const addToQueue = await this.subscriberService.create(request.body.email, this.list, this.sendgridEnvironment, request.body.subscriptions, id, response)

    if (addToQueue.isError) {
      response.status(addToQueue.code).send({ errors: addToQueue.response.body.errors })
      return;
    }

    response.status(200).send({
      status: "success",
    })

    const errorInfo = {
      email: request.body.email,
      anonymous_id: addToQueue.anonymous_id,
      lists: this.list
    }

    // Now we keep checking to make sure the import was successful
    const importConfirmation = await this.subscriberService.checkCreate(addToQueue.result[1]["job_id"], response, 0, CHECKS_BEFORE_FAIL, PAUSE_BETWEEN_CHECKS, errorInfo);
    
    // Send the confirmation email
    if (!importConfirmation.isError) { 
      await this.subscriberService.sendConfirmationEmail(request.body.email, this.sendgridEnvironment, request.body.subscriptions, id);
    }
    
    return;

  }

  @Get("/subscribers/:id")
  async subscriptions(@Param() params, @Res() response) {
    const userData = await this.subscriberService.getSubscriptions(params.id);
    response.status(userData.code).send(userData.isError ? userData : { email: userData.email, subscriptions: userData["subscription_list"] })
    return;
  }

  @Patch("/subscribers/:id")
  async update(@Req() request: Request, @Param("id") id, @Res() response) {
    const email = await this.subscriberService.getUserById(id);

    if (email.isError) {
      response.status(email.code).send({ errors: email.response.body.errors })
      return;
    }

    if (!this.subscriberService.validateSubscriptions(request.body.subscriptions)) {
      response.status(400).send({
        error: "Invalid list of subscriptions."
      })
      return;
    }

    const updatedContact = await this.subscriberService.update(
      this.sendgridEnvironment,
      email.email,
      request.body.subscriptions,
    );

    response.send(updatedContact);
  }

  @Post("/subscribers/:email/modify")
  async modifySubscriptions(@Param() params, @Res() response) {
    const existingUser = await this.subscriberService.findByEmail(params.email);
    if (existingUser.code === 404) {
      response.status(404).send({
        error: "User not found."
      })
      return;
    }

    const userId = existingUser['1'].result[params.email].contact.custom_fields[`zap_${this.sendgridEnvironment}_id`];

    // Send the modify email
    await this.subscriberService.sendModifySubscriptionEmail(params.email, this.sendgridEnvironment, userId);
    response.status(201).send({
      message: "Modify subscription email sent"
    });
    return;
  }

  @Post("/subscribers/:email/resend-confirmation")
  async resendConfirmation(@Param() params, @Res() response) {
    const existingUser = await this.subscriberService.findByEmail(params.email);
    if (existingUser.code === 404) {
      response.status(404).send({
        error: "User not found."
      })
      return;
    }

    const userId = existingUser['1'].result[params.email].contact.custom_fields[`zap_${this.sendgridEnvironment}_id`];
    var subscriptions = <ValidSubscriptionSet>{}

    for (const [key, value] of Object.entries(existingUser['1'].result[params.email].contact.custom_fields)) {
      if(((key.includes(this.sendgridEnvironment)) && !(key.endsWith("_confirmed") || key.endsWith("_id")))) {
        subscriptions[key.split("_")[2]] = value;
      }
    }

    // Send the confirmation email
    await this.subscriberService.sendConfirmationEmail(params.email, this.sendgridEnvironment, subscriptions, userId);
    response.status(201).send({
      message: "Confirmation email sent"
    });
    return;
  }

  @Get("/subscribers/email/:email")
  async getEmail(@Param() params, @Res() response) {
    if (!validateEmail(params.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
      return;
    }

    const existingUser = await this.subscriberService.findByEmail(params.email);
    if (existingUser.code === 404) {
      response.status(404).send({
        error: "User not found."
      })
      return;
    }

    const userExistsInCurrentList = existingUser['1'].result[params.email].contact.list_ids.includes(this.list);
    const existingUserListConfirmed = existingUser['1'].result[params.email].contact.custom_fields[`zap_${this.sendgridEnvironment}_confirmed`];

    if (userExistsInCurrentList && existingUserListConfirmed) {
      response.status(201).send({
        confirmed: true,
        message: "User already subscribed."
      })
      return;
    }

    if (existingUserListConfirmed === 0) {
      response.status(201).send({
        confirmed: false,
        message: "User is subscribed but must confirm."
      })
      return;
    }

    response.status(404).send({
      error: "Not found."
    })
    return;
  }
}