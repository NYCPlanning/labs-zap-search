import { Injectable } from '@nestjs/common';
import * as fetch from 'node-fetch';

@Injectable()
export class CartoService {
  cartoUsername = 'planninglabs';

  buildSqlUrl(cleanedQuery, format = 'json', method) { // eslint-disable-line
    let url = `https://${this.cartoUsername}.carto.com/api/v2/sql`;
    url += method === 'get' ? `?q=${cleanedQuery}&format=${format}` : '';

    return url;
  };

  async fetchCarto(query, format = 'json', method = 'get') {
    const cleanedQuery = query.replace('\n', '');
    const url = this.buildSqlUrl(cleanedQuery, format, method);

    let fetchOptions = {};

    if (method === 'post') {
      fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `q=${cleanedQuery}&format=${format}`,
      };
    }

    let cartoResponse = await fetch(url, fetchOptions);

    if (cartoResponse.ok) {
      cartoResponse = await cartoResponse.json();

      if (format === 'json')
        return cartoResponse.rows;

      return cartoResponse;
    }

    throw new Error('Request to carto failed.');
  };
}
