import { Controller, Param, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { SendUpdateService } from "./send-update.service";
import { ProjectService } from "../project/project.service";
import { ListservAuthService } from "../listserv/listserv-auth.service";
import { UseGuards } from "@nestjs/common";
import { ListservAuthGuard } from "src/listserv/listserv-auth.guard";
import { Request } from "express";

@Controller()
@UseGuards(ListservAuthGuard)
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
    const project = await this.projectService.findOneByName(params.id);
    // If no project is found, projectService returns HTTP error automatically, and this function does not continue

    // Production names use underscores, staging use dashes
    var segments = project["data"]["attributes"]["dcp-borough"] === "Citywide" ? [{ name: "CW", envSegment: `zap${this.sendgridEnvironment === "production" ? "_production_" : "-staging-"}CW`, segmentId: "" }] : [];

    if(project["data"]["attributes"]["dcp-validatedcommunitydistricts"]) {
      project["data"]["attributes"]["dcp-validatedcommunitydistricts"].split(",").forEach(element => { 
        segments.push({ name: element, envSegment: `zap${this.sendgridEnvironment === "production" ? "_production_" : "-staging-"}${element}`, segmentId: "" })
      });
    }

    if (!segments.length) {
      response.status(400).send({
        isError: true,
        project,
        error: "No associated segments found."
      })
      return;
    }

    for (const segment of segments) {
      const segmentIdResult = await this.sendUpdateService.getSegmentId(segment.envSegment);
      if(segmentIdResult.isError) {
        response.status(500).send(segmentIdResult);
        return;
      }
      segment.segmentId = segmentIdResult.segmentId;
    }

    var creationUpdates = [];
    var sendUpdates = [];

    const boros = {
      K: 'Brooklyn',
      X: 'Bronx',
      M: 'Manhattan',
      Q: 'Queens',
      R: 'Staten Island',
    };

    for (const segment of segments) {
      const emailData = {
        "domain": this.sendgridEnvironment === "production" ? "zap.planning.nyc.gov" : "zap-staging.planninglabs.nyc",
        "id": params.id,
        "name": project["data"]["attributes"]["dcp-projectname"],
        "borocd": segment.name === "CW" ? "Citywide" : `${boros[segment.name.slice(0,1)]} CD ${parseInt(segment.name.slice(1), 10)}`,
        "status": project["data"]["attributes"]["dcp-publicstatus"],
        "date": new Date().toLocaleDateString(),
        "additionalpublicinformation": project["data"]["attributes"]["dcp-additionalpublicinformation"],
        "dcpIsApplicant": project["data"]["attributes"]["dcp-applicant-customer-value"] === "DCP - Department of City Planning (NYC)",
        "spansMoreThanOneCD": (project["data"]["attributes"]["dcp-validatedcommunitydistricts"] && (project["data"]["attributes"]["dcp-validatedcommunitydistricts"].split(",").length > 1))
      }

      const emailHtml = this.sendUpdateService.createProjectUpdateContent(emailData);

      const createUpdate = await this.sendUpdateService.createSingleSendProjectUpdate(params.id, emailHtml, segment.segmentId);

      if (createUpdate.isError) {
        response.status(createUpdate.code).send({
          isError: true,
          project,
          createUpdate
        })
        return;
      }

      const sendUpdate = await this.sendUpdateService.scheduleSingleSendProjectUpdate(createUpdate["0"]["body"]["id"]);

      if (sendUpdate.isError) {
        response.status(sendUpdate.code).send({
          isError: true,
          project,
          createUpdate,
          sendUpdate
        })
        return;
      }

      creationUpdates.push(createUpdate);
      sendUpdates.push(sendUpdate);
    }

    response.status(201).send({
      isError: false,
      project,
      creationUpdates,
      sendUpdates
    });
    return;
  }
}