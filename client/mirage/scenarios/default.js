import { camelize } from '@ember/string';
import ENV from '../../config/environment';

export default function(server) {
  const { MIRAGE_SCENARIO = 'community-board' } = ENV;
  const scenario = server._config.scenarios[camelize(MIRAGE_SCENARIO)];

  if (scenario) {
    scenario(server);
  }
}
