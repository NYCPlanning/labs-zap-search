import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { CrmService } from "../crm/crm.service";
import { Serializer } from "jsonapi-serializer";
import { dasherize } from "inflected";
import buildQuery from "odata-query";

const ACTIVE_STATUSCODE = 1;
const ACTIVE_STATECODE = 0;

const ZONING_RESOLUTION_KEYS = ["dcp_zoningresolution"];

@Controller("zoning-resolutions")
export class ZoningResolutionsController {
  constructor(private readonly crmService: CrmService) {}

  @Get("/")
  async zoningResolutions() {
    try {
      const { records } = await this.crmService.get(
        "dcp_zoningresolutions",
        buildQuery({
          select: "dcp_zoningresolution",
          filter: [
            { statuscode: ACTIVE_STATUSCODE },
            { statecode: ACTIVE_STATECODE }
          ]
        })
      );
      return this.serialize(records);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException(
          {
            code: "FIND_ZONINGRESOLUTIONS_FAILED",
            title: "Failed getting zoning resolutions",
            detail: `An unknown server error occured while getting zoning resolutions. ${
              e.message
            }`
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  // Serializes an array of objects into a JSON:API document
  serialize(records, opts?: object): Serializer {
    const ZoningResolutionSerializer = new Serializer("zoning-resolutions", {
      attributes: ZONING_RESOLUTION_KEYS,
      id: "dcp_zoningresolutionid",
      meta: { ...opts },
      keyForAttribute(key) {
        let dasherized = dasherize(key);

        if (dasherized[0] === "-") {
          dasherized = dasherized.substring(1);
        }

        return dasherized;
      }
    });

    return ZoningResolutionSerializer.serialize(records);
  }
}
