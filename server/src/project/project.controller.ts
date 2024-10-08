import { Controller, Get, Post, Param, Query, Req, Res } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "../config/config.service";
import { ProjectService } from "./project.service";
import { RecaptchaV2 } from "express-recaptcha";
import { GeometryService } from "./geometry/geometry.service";

@Controller()
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly config: ConfigService,
    private readonly geometryService: GeometryService
  ) {}

  @Get("/projects/sync/:id")
  async syncProjectGeoms(@Param("id") id) {
    try {
      await this.geometryService.synchronizeProjectGeometry(id);

      return {
        success: true
      };
    } catch (e) {
      console.log("something went wrong...", e.message);
      return {
        success: false
      };
    }
    // 1. lookup projectbbls by project id
    // 2. connect to carto and union them
    // 3. post data back to project record
  }

  // Extract the raw Express instance and pass to the query method
  @Get("/projects/")
  async index(@Query() query, @Query("skipTokenParams") skipTokenParams) {
    try {
      if (skipTokenParams) {
        return await this.projectService.paginate(skipTokenParams);
      }

      return await this.projectService.queryProjects(query);
    } catch (e) {
      console.log(e);

      return {
        errors: [`Something went wrong. ${e.message}`]
      };
    }
  }

  @Get("/projects/:name")
  async show(@Param() params) {
    return this.projectService.findOneByName(params.name);
  }

  @Get("/projects.csv")
  async download(@Query() query, @Req() request: Request, @Res() response) {
    // renable for now; enable other formats soon
    const filetype = "csv";
    const csv = await this.projectService.handleDownload(query, filetype);

    response.setHeader("Content-type", "text/csv");
    response.send(csv);
  }

  @Post("/projects/feedback")
  async receiveFeedback(@Req() request: Request, @Res() response) {
    const recaptcha = new RecaptchaV2(
      this.config.get("RECAPTCHA_SITE_KEY"),
      this.config.get("RECAPTCHA_SECRET_KEY")
    );

    recaptcha.verify(request, async (error, data) => {
      if (!error) {
        const { projectid, projectname, text } = request.body;
        try {
          // sendFeedbackToGithubIssue uses octokit to create issues on our dcp-zap-data-feedback repository
          await this.projectService.sendFeedbackToGithubIssue(
            projectid,
            projectname,
            text
          );
          response.status(201).send({
            status: "success"
          });
        } catch (error) {
          console.log("Error submitting feedback", error);
          response.status(500).send({
            status: "error",
            error
          });
        }
      } else {
        response.status(403).send({
          status: "captcha invalid"
        });
      }
    });
  }
}
