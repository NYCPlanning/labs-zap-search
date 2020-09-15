import {
  Controller,
  Patch,
  Body,
  Param,
  Session,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Deserializer } from 'jsonapi-serializer';
import { pick } from 'underscore';
import { ConfigService } from '../config/config.service';
import { OdataService } from '../odata/odata.service';
import {
    defaultValueDispositionPipe as defaultValuePipe
  } from './defaultValue.disposition.pipe';

// Only attrs in the whitelist get posted
const ATTRS_WHITELIST = [
  'dcp_publichearinglocation',
  'dcp_dateofpublichearing',
  'dcp_nameofpersoncompletingthisform',
  'dcp_title',
  'dcp_dateofvote',
  'dcp_votelocation',

  // the sum of the other vote types must be equal to the
  // number in this column:
  'dcp_totalmembersappointedtotheboard',
  'dcp_wasaquorumpresent',
  'dcp_boroughboardrecommendation',
  'dcp_communityboardrecommendation',
  'dcp_boroughpresidentrecommendation',
  'dcp_votingagainstrecommendation',
  'dcp_votinginfavorrecommendation',
  'dcp_votingabstainingonrecommendation',
  'dcp_consideration',
  'dcp_datereceived',

  // these are computed from the
  // other values on the model
  'statuscode',
  'statecode',
];
const { deserialize } = new Deserializer({
  keyForAttribute: 'underscore_case',
});

// todo: auth (decorator)
// auth that user is assigned to dispo
@Controller('dispositions')
export class DispositionController {
  constructor(
    private readonly dynamicsWebApi:OdataService,
    private readonly config: ConfigService,
  ) {}

  @Patch('/:id')
  async update(@Body(defaultValuePipe) body, @Param('id') id, @Session() session) {
    if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const { contactid } = session;
    const attributes = await deserialize(body);
    const whitelistedAttrs = pick(attributes, ATTRS_WHITELIST);

    // todo: throw error for non whitelisted keys
    // update CRM first
    // then, update the database
    try {
      const { records: [{ _dcp_recommendationsubmittedby_value: dcp_recommendationsubmittedby }] } = await this.dynamicsWebApi
        .queryFromObject('dcp_communityboarddispositions', {
          $filter: `dcp_communityboarddispositionid eq ${id}`,
        });

      // check that the person updating the disposition is the person who submitted the dispo
      // also check if it's imposter_id enabled
      if ((dcp_recommendationsubmittedby !== contactid) && !this.config.get('CRM_IMPOSTER_ID')) {
        throw new Error('Not authorized to edit this record.');
      }

      await this.dynamicsWebApi.update('dcp_communityboarddispositions', id, whitelistedAttrs);
    } catch (e) {
      const message = await e; 
      console.log(message);

      throw new HttpException({
        errors: [message],
      }, 400);
    }

    return body;
  }
}
