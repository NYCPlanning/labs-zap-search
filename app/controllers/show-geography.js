import { action, computed } from '@ember-decorators/object';
import { restartableTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import GeographyParachuteController from './query-parameters/show-geography';
import { isArray } from '@ember/array';

const DEBOUNCE_MS = 500;

export default class ShowGeographyController extends GeographyParachuteController {
  setup() {
    this.get('fetchData').perform();
  }

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get('fetchData').perform();
    }
  }

  page = 1;

  @restartableTask
  debouncedSet = function*(key, value) {
    yield timeout(DEBOUNCE_MS);
    this.resetPagination();
    this.set(key, value);
  }

  @restartableTask
  fetchData = function*() {
    yield {};

    const params = this.get('allQueryParams');
    const {
      'applied-filters': appliedFilters,
    } = params;
    const page = this.get('page');
    const queryOptions = {
      page,
    }

    for (const key of appliedFilters) {
      queryOptions[key] = params[key];
    }

    // fetch any new projects
    const projects = yield this.store.query('project', queryOptions);
    const meta = projects.get('meta');

    // include the entire, un-paginated response
    const allProjects = this.store.peekAll('project');

    return {
      meta,
      projects: allProjects,
    }
  }

  @computed('fetchData', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('fetchData.lastSuccessful.value.meta.pageTotal');
    const total = this.get('fetchData.lastSuccessful.value.meta.total');
    const page = this.get('page');

    return (pageTotal < 30) || ((page * 30) >= total);
  }

  @action
  resetPagination() {
    // reset pagination
    this.set('page', 1);
    this.get('store').unloadAll('project');
  }

  @action
  mutateArray(key, ...values) {
    // BEWARE: binding this to 'onClick=' will insert the mouseEvent
    const targetArray = this.get(key);
    this.resetPagination();

    // ember handlebars can't use spread/rest syntax for actions yet
    // so we check if array is passed
    const unnestedValues = (isArray(values[0]) && values.length === 1) ? values[0] : values;

    for (const value of unnestedValues) {
      if (targetArray.includes(value)) {
        targetArray.removeObject(value);
      } else {
        targetArray.pushObject(value);
      }
    }

    this.set(key, targetArray.sort())
  }

  @action
  replaceProperty(key, value = []) {
    this.resetPagination();
    this.set(key, value.map(({ code }) => code));
  }

  @action
  toggleBoolean(key) {
    this.resetPagination();
    this.set(key, !this.get(key));
  }

  @action
  setDebouncedText(key, { target: { value } }) {
    this.get('debouncedSet').perform(key, value);
  }

  @action
  resetAll() {
    this.resetPagination();
    this.resetQueryParams();
  }
}
