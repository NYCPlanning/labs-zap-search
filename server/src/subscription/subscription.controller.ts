import { Controller, Get, Post, Param, Query, Req, Res } from "@nestjs/common";
import { error } from "console";
import { Request } from "express";
import validateEmail from "../_utils/validate-email";


@Controller()
export class SubscriptionController {
  constructor(
    
   
  ) {}


  @Post("/subscribers")
  async addSubscriber(@Req() request: Request, @Res() response) {

    if (!validateEmail(request.body.email)) {
      response.status(400).send({
        error: "Invalid email address."
      })
    } else {
      response.status(201).send({
        status: "success",
      });
    }

  }
}
