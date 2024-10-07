import { Controller, Get, Post, Param, Query, Req, Res } from "@nestjs/common";
import { Request } from "express";


@Controller()
export class SubscriptionController {
  constructor(
   
  ) {}


  @Post("/subscribers")
  async addSubscriber(@Req() request: Request, @Res() response) {

    console.log(request.body);

    response.status(201).send({
      status: "success",
    });

  }
}
