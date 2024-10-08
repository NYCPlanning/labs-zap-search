import {
  Controller,
  Get,
  Query,
  Session,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Serializer } from "jsonapi-serializer";
import { AssignmentService } from "../assignment/assignment.service";
import { ContactService } from "../contact/contact.service";
import { KEYS as ASSIGNMENT_KEYS } from "./assignment.entity";
import { KEYS as DISPOSITION_KEYS } from "../disposition/disposition.entity";
import { KEYS as PROJECT_KEYS } from "../project/project.entity";
import { MILESTONE_KEYS } from "../project/project.entity";
import { ACTION_KEYS } from "../project/project.entity";
import { dasherize } from "inflected";

@Controller("assignments")
export class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly contactService: ContactService
  ) {}

  @Get("/")
  async index(@Query() query, @Session() session) {
    if (!session)
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

    let { contactid } = session;

    const { tab = "to-review", email = "" } = query;

    // we have different queries for LUPP things
    if (tab && contactid) {
      // one of 'archive', 'reviewed', 'to-review', 'upcoming'
      if (!["archive", "reviewed", "to-review", "upcoming"].includes(tab)) {
        throw new Error(
          "Must be one of archive, reviewed, to-review, upcoming"
        );
      }

      let contact;

      // creeper mode handling. if the email param is there, find by email.
      if (email) {
        contact = await this.contactService.findByEmail(email);
      } else {
        contact = await this.contactService.findOne(contactid);
      }

      const records = await this.assignmentService.getAssignments(contact, tab);

      // return records;
      return this.serialize(records);
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const sanitizedRecords = records.map(record => {
      if (!record.dispositions) record.dispositions = [];
      if (!record.milestones) record.milestones = [];

      return record;
    });

    const AssignmentSerializer = new Serializer("assignments", {
      attributes: ASSIGNMENT_KEYS,
      id: "dcp_projectlupteamid",
      project: {
        ref: "dcp_name",
        attributes: PROJECT_KEYS,
        actions: {
          ref: "dcp_projectactionid",
          attributes: ACTION_KEYS
        },
        milestones: {
          ref: "dcp_projectmilestoneid",
          attributes: MILESTONE_KEYS
        },
        dispositions: {
          ref: "dcp_communityboarddispositionid",
          attributes: DISPOSITION_KEYS
        }
      },
      milestones: {
        ref: "dcp_projectmilestoneid",
        attributes: MILESTONE_KEYS
      },

      dispositions: {
        ref: "dcp_communityboarddispositionid",
        attributes: DISPOSITION_KEYS,
        project: {
          ref: "dcp_name",
          attributes: PROJECT_KEYS,
          actions: {
            ref: "dcp_projectactionid",
            attributes: ACTION_KEYS
          }
        }
      },
      meta: { ...opts },
      keyForAttribute(key) {
        let dasherized = dasherize(key);

        if (dasherized[0] === "-") {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      }
    });

    return AssignmentSerializer.serialize(sanitizedRecords);
  }
}
