import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

const MAX_RESULT_COUNT = 5000;

export default class ResultsHeaderMeta extends Component {
  // required ember-concurrency task object
  fetchData;

  tagName = '';

  @alias('fetchData.lastSuccessful.value.meta.total') totalResults;

  @computed('totalResults')
  get hasAllowedResults() {
    return this.totalResults > 0 && this.totalResults < MAX_RESULT_COUNT;
  }

  @computed('totalResults')
  get exceedsAllowedResults() {
    return this.totalResults >= MAX_RESULT_COUNT;
  }
}
