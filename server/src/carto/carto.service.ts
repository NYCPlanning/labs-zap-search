import { Injectable } from '@nestjs/common';
import * as fetch from 'node-fetch';

@Injectable()
export class CartoService {
  cartoUsername = 'planninglabs';

  cartoHost = `https://${this.cartoUsername}.carto.com`;

  buildSqlUrl(cleanedQuery, format = 'json', method) { // eslint-disable-line
    let url = `${this.cartoHost}/api/v2/sql`;
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

    console.log(await cartoResponse.json());

    throw new Error('Request to carto failed.');
  };

  async createAnonymousMap(options) {
    const cartoMapsEndpoint = `${this.cartoHost}/api/v1/map`;
    const result = await fetch(cartoMapsEndpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
    
    const json = await result.json();
    const { metadata: { tilejson: { vector: { tiles } } } } = json;

    return tiles;
  }
}
