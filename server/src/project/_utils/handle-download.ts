import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { parse } from 'json2csv';
import { rollupActionTypes } from './transform-actions';

/* GET /projects/download.:filetype */
/* Downloads a file of projects that match the current query params and filetype */
export async function handleDownload(filetype, data) {
  try {
    if (filetype === 'csv') {
      if (data.length) {
        data.map(row => rollupActionTypes(row));

        return parse(data, { highWaterMark: 16384, encoding: 'utf-8' });
      } else {
        throw new HttpException({ error: 'No results' }, HttpStatus.NO_CONTENT);
      }
    } 
  } catch (error) {
    console.log('Error downloading project data:', error); // eslint-disable-line
    throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
