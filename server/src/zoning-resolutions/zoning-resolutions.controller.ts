import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrmService } from '../crm/crm.service';

const ACTIVE_STATUSCODE = 1;
const ACTIVE_STATECODE = 0;

@Controller('zoning-resolutions')
export class ZoningResolutionsController {
  constructor(
    private readonly crmService: CrmService,
  ) {}

  // Extract the raw Express instance and pass to the query method
  @Get('/')
  async zoningResolutions() {
    console.log('are we running');
    try {
      const { records } = await this.crmService.get('dcp_zoningresolutions',
        `$select=dcp_zoningresolution
        &$filter=
        statuscode eq ${ACTIVE_STATUSCODE}
        and statecode eq ${ACTIVE_STATECODE}
    `);
      return records;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      } else {
        throw new HttpException({
          code: 'FIND_ZONINGRESOLUTIONS_FAILED',
          title: 'Failed getting zoning resolutions',
          detail: `An unknown server error occured while getting zoning resolutions. ${e.message}`,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
