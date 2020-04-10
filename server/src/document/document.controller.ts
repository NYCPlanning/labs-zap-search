import { Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Session,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CRMWebAPI } from '../_utils/crm-web-api';
const eol = require('eol');

@Controller('document')
export class DocumentController {
  constructor(
    private readonly config: ConfigService,
  ) {}

  /** Uploads a single document
    * The incoming POST request should have form-data with...
    * two body fields:
    *   entityName - name of a CRM entity. Currently only accepts  `dcp_communityboarddisposition`.
    *   instanceId - (required) a 32 character id for an instance of type `entityName`.
    *                Format should be xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    * and a `file` field assigned a buffer of data representing a single file.
  */
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async index(@UploadedFile() file, @Req() request: Request, @Res() response, @Session() session) {
    if (!session) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const {
      body: {
        instanceId,
        entityName
      },
    } = request;

    const headers = {
      MSCRMCallerID: this.config.get('CRM_ADMIN_SERVICE_USER')
    };

    // encode base64
    const encodedBase64File = Buffer.from(file.buffer).toString('base64');

    let uploadDocResponse = {};

    if ( entityName === 'dcp_communityboarddisposition' ) {
      const dispositionGUID = instanceId;

      const dispositionRecord = (await CRMWebAPI.get(`dcp_communityboarddispositions?$select=dcp_name&$filter=dcp_communityboarddispositionid eq '${dispositionGUID}'&$top=1`))['value'][0];

      const dispositionID = dispositionRecord.dcp_name;
      // Note that some disposition names have multiple trailing whitespace characters.
      // We leave them in because CRM SHOULD* adhere to the convention of dcp_name + dcp_communityboarddispositionid
      // *Should because we still need to more thoroughly verify this.
      const folderName = `${dispositionID}_${dispositionGUID.replace(/\-/g,'').toUpperCase()}`;

      uploadDocResponse = await CRMWebAPI.uploadDocument('dcp_communityboarddisposition', dispositionGUID, folderName, file.originalname, encodedBase64File, true, headers);
      response.status(200).send({"message": uploadDocResponse});
    } else {
      response.status(400).send({ "error": 'You can only upload files to dcp_communityboarddisposition at this time' });
    }
  }
}
