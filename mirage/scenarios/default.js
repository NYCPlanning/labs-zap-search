import { camelize } from '@ember/string';
import rawData from '../db-data/default';
import ENV from '../../config/environment';

export default function(server) {
  const { MIRAGE_SCENARIO = '' } = ENV;
  const scenario = server._config.scenarios[camelize(MIRAGE_SCENARIO)];

  if (scenario) {
    scenario(server);
  } else {
    server.db.loadData(rawData);
  }
}
