import {
  Controller,
  Patch,
  Body,
  Param,
  Session,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Deserializer } from "jsonapi-serializer";
import { pick } from "underscore";
import { ConfigService } from "../config/config.service";
import { CrmService } from "../crm/crm.service";
import { defaultValueDispositionPipe as defaultValuePipe } from "./defaultValue.disposition.pipe";

const STATUSCODES_LABEL_TO_VALUE = {
  Draft: 1,
  Saved: 717170000,
  Submitted: 2,
  Deactivated: 717170001,
  "Not Submitted": 717170002
};

const STATECODES_LABEL_TO_VALUE = {
  Active: 0,
  Inactive: 1
};

// Only attrs in the whitelist get posted
const ATTRS_WHITELIST = [
  "dcp_publichearinglocation",
  "dcp_dateofpublichearing",
  "dcp_nameofpersoncompletingthisform",
  "dcp_title",
  "dcp_dateofvote",
  "dcp_votelocation",
  "dcp_ispublichearingrequired",

  // the sum of the other vote types must be equal to the
  // number in this column:
  "dcp_totalmembersappointedtotheboard",
  "dcp_wasaquorumpresent",
  "dcp_boroughboardrecommendation",
  "dcp_communityboardrecommendation",
  "dcp_boroughpresidentrecommendation",
  "dcp_votingagainstrecommendation",
  "dcp_votinginfavorrecommendation",
  "dcp_votingabstainingonrecommendation",
  "dcp_consideration",
  "dcp_datereceived",
  "statecode",
  "statuscode"
];
const { deserialize } = new Deserializer({
  keyForAttribute: "underscore_case"
});

// todo: auth (decorator)
// auth that user is assigned to dispo
@Controller("dispositions")
export class DispositionController {
  constructor(private readonly crmService: CrmService) {}

  @Patch("/:id")
  async update(
    @Body(defaultValuePipe) body,
    @Param("id") id,
    @Session() session
  ) {
    if (!session)
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

    const { contactid } = session;
    const attributes = await deserialize(body);
    let whitelistedAttrs = pick(attributes, ATTRS_WHITELIST);

    // todo: throw error for non whitelisted keys
    // update CRM first
    // then, update the database
    try {
      const {
        records: [
          {
            _dcp_recommendationsubmittedby_value: dcp_recommendationsubmittedby
          }
        ]
      } = await this.crmService.queryFromObject(
        "dcp_communityboarddispositions",
        {
          $filter: `dcp_communityboarddispositionid eq ${id}`
        }
      );

      // check that the person updating the disposition is the person who submitted the dispo
      // also check if it's imposter_id enabled
      if (dcp_recommendationsubmittedby !== contactid) {
        throw new Error("Not authorized to edit this record.");
      }

      // These values are provided to the frontend as _labels_ (instead of the integer codes).
      // However, the disposition model in the frontend defines these as strings (there are also duplicate entries as _numbers_ but that's another story)
      // Because of this madness, whenever user submits the disposition, the frontend correctly provides the integer-based code
      // for the values, HOWEVER, they are represented as strings ('12345' instead of 12345). This causes CRM to kick it back.
      // This code here is a temporary stopgap to parse those stringified integers as numeric types so that CRM is happy with them.
      // TODO: avoid backfilling values with labels. remove duplicate keys for these recommendation values in the disposition.
      //   check that this doesn't break anything in zap project profile and the LUP frontend. finally, remove this code.
      whitelistedAttrs = {
        ...whitelistedAttrs,
        ...{
          dcp_communityboardrecommendation: whitelistedAttrs.dcp_communityboardrecommendation
            ? parseInt(whitelistedAttrs.dcp_communityboardrecommendation, 10)
            : null,
          dcp_boroughpresidentrecommendation: whitelistedAttrs.dcp_boroughpresidentrecommendation
            ? parseInt(whitelistedAttrs.dcp_boroughpresidentrecommendation, 10)
            : null,
          dcp_boroughboardrecommendation: whitelistedAttrs.dcp_boroughboardrecommendation
            ? parseInt(whitelistedAttrs.dcp_boroughboardrecommendation, 10)
            : null,
          statecode: STATECODES_LABEL_TO_VALUE[whitelistedAttrs.statecode],
          statuscode: STATUSCODES_LABEL_TO_VALUE[whitelistedAttrs.statuscode]
        }
      };

      await this.crmService.update(
        "dcp_communityboarddispositions",
        id,
        whitelistedAttrs
      );
    } catch (e) {
      const message = await e;
      console.log(message);

      throw new HttpException(
        {
          errors: [message]
        },
        400
      );
    }

    return body;
  }
}
