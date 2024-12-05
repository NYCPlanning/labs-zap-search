import { Controller, Param, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { SendUpdateService } from "./send-update.service";
import { ProjectService } from "../project/project.service";
import { ListservAuthService } from "../listserv/auth.service";
import { Request } from "express";

@Controller()
export class SendUpdateController {
  apiKey = "";
  list = "";
  sendgridEnvironment = "";

  constructor(
    private readonly config: ConfigService,
    private readonly sendUpdateService: SendUpdateService,
    private readonly projectService: ProjectService,
    private readonly listservAuthService: ListservAuthService
  ) {
    this.apiKey = this.config.get("SENDGRID_API_KEY");
    this.list = this.config.get("SENDGRID_LIST");
    this.sendgridEnvironment = this.config.get("SENDGRID_ENVIRONMENT")
  }

  @Post("/projects/:id/send-update")
  async sendUpdate(@Param() params, @Req() request: Request, @Res() response) {
    const validatedUser = await this.listservAuthService.validateUser(request.headers.authorization)
    if (!validatedUser) {
      response.status(401).send();
      return;
    }

    const project = await this.projectService.findOneByName(params.id);
    // If no project is found, projectService returns HTTP error automatically, and this function does not continue

    const createUpdate = await this.sendUpdateService.createSingleSendProjectUpdate(params.id);

    if (createUpdate.isError) {
      response.status(createUpdate.code).send({
        isError: true,
        project,
        createUpdate
      })
      return;
    }

    const sendUpdate = await this.sendUpdateService.scheduleSingleSendProjectUpdate(createUpdate["0"]["body"]["id"]);

    response.status(201).send({
      isError: false,
      project,
      createUpdate,
      sendUpdate
    });
    return;
  }
}