import { action, computed } from '@ember-decorators/object';
import { restartableTask, keepLatestTask } from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { isArray } from '@ember/array';
import GeographyParachuteController from './query-parameters/show-geography';
import ENV from 'labs-zap-search/config/environment';
import queryString from 'qs';


const DEBOUNCE_MS = 500;

export default class ShowGeographyController extends GeographyParachuteController {
  init() {
    super.init(...arguments);

    this.set('page', 1);
    this.set('cachedProjects', []);
    this.set('tiles', []);
    this.set('bounds', []);

    this.fetchData.perform({ unloadAll: true });
  }

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.fetchData.perform({ unloadAll: true });
    }
  }

  @computed('fetchData.lastSuccessful.value.meta.{pageTotal,total}', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('fetchData.lastSuccessful.value.meta.pageTotal');
    const total = this.get('fetchData.lastSuccessful.value.meta.total');
    const page = this.page;

    return (pageTotal < 30) || ((page * 30) >= total);
  }

  @computed('allQueryParams', 'page')
  get appliedQueryParams() {
    // construct query object only with applied params
    const params = this.allQueryParams;
    const page = this.page;
    const {
      'applied-filters': appliedFilters,
    } = params;

    const queryOptions = {
      page,
    }

    for (const key of appliedFilters) {
      queryOptions[key] = params[key];
    }

    return queryOptions;
  }

  @computed('allQueryParams')
  get downloadURL() {
    // construct query object only with applied params
    const href = `${ENV.host}/projects/download.csv`;
    let queryParams = this.appliedQueryParams;

    return `${href}?${queryString.stringify(queryParams, {arrayFormat: 'bracket'})}`;
  }

  @restartableTask
  debouncedSet = function*(key, value) {
    yield timeout(DEBOUNCE_MS);
    this.set(key, value);
  }

  @keepLatestTask
  fetchData = function*({ unloadAll = false } = {}) {
    const cachedProjects = this.cachedProjects;
    const queryOptions = this.appliedQueryParams;

    // fetch any new projects
    const projects = yield this.store.query('project', queryOptions);
    const meta = projects.get('meta');

    // include the entire, un-paginated response
    if (unloadAll) {
      this.set('page', 1);
      cachedProjects.clear();
    }

    if (meta.tiles && meta.bounds) {
      this.set('tiles', meta.tiles);
      this.set('bounds', meta.bounds);
    }

    cachedProjects.pushObjects(projects.toArray());

    return {
      meta,
      projects: cachedProjects,
    };
  }

  @action
  setDebouncedText(key, { target: { value } }) {
    this.debouncedSet.perform(key, value);
  }

  @action
  resetAll() {
    this.resetQueryParams();
  }

  /*
    `mutateArray` can accept either multiple parameters of strings, a single string,
    or an array of strings. The rest param coerces it into an array.
  */
  @action
  mutateArray(key, ...values) {
    // BEWARE: binding this to 'onClick=' will insert the mouseEvent
    const targetArray = this.get(key);

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

    this.set(key, targetArray.sort());
  }

  @action
  replaceProperty(key, value = []) {
    this.set(key, value.map(({ code }) => code));
  }

  @action
  toggleBoolean(key) {
    this.set(key, !this.get(key));
  }
}
