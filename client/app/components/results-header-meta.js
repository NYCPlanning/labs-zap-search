import Component from '@ember/component';
import { computed } from '@ember/object';
import queryString from 'qs';
import ENV from 'labs-zap-search/config/environment';

const MAX_RESULT_COUNT = 5000;

export default class ResultsHeaderMeta extends Component {
  tagName = '';

  queryParams = {};

  totalResults;

  isRunning;

  cachedProjectsLength;

  @computed('totalResults')
  get hasAllowedResults() {
    return this.totalResults > 0 && this.totalResults < MAX_RESULT_COUNT;
  }

  @computed('totalResults')
  get exceedsAllowedResults() {
    return this.totalResults >= MAX_RESULT_COUNT;
  }

  @computed('queryParams')
  get downloadLocations() {
    // construct query object only with applied params
    const href = `${ENV.host}/projects`;
    const { queryParams } = this;

    return {
      csv: `${href}.csv?${queryString.stringify(queryParams, { arrayFormat: 'bracket' })}`,
      geojson: `${href}.geojson?${queryString.stringify(queryParams, { arrayFormat: 'bracket' })}`,
      shp: `${href}.shp?${queryString.stringify(queryParams, { arrayFormat: 'bracket' })}`,
    };
  }
}
