import { action, computed } from '@ember-decorators/object';
import { restartableTask } from 'ember-concurrency-decorators';
import GeographyParachuteController from './query-parameters/show-geography';

export default class ShowGeographyController extends GeographyParachuteController {
  setup() {
    this.get('fetchData').perform();
  }

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get('fetchData').perform();
    }
  }

  @restartableTask
  fetchData = function*() {
    const params = this.get('allQueryParams');
    const {
      // pagination
      page = 1,

      // filter values
      'community-districts': communityDistricts = [],
      'action-types': actionTypes = [],
      'action-reasons': actionReasons = [],
      dcp_publicstatus,
      dcp_ceqrtype,
      dcp_ulurp_nonulurp,
      dcp_femafloodzonea,
      dcp_femafloodzonecoastala,
      dcp_femafloodzoneshadedx,
      dcp_femafloodzonev,

      // toggle filters
      status = true,
      cds = false,
      ceqr = false,
      fema = false,
      ulurp = false,
      'action-type': actionType = false,
      'action-reason': actionReason = false,
    } = params;

    const queryOptions = {
      page,
    }

    // only add to the api call if set to true
    if (fema) {
      if (dcp_femafloodzonea) queryOptions.dcp_femafloodzonea = true;
      if (dcp_femafloodzonecoastala) queryOptions.dcp_femafloodzonecoastala = true;
      if (dcp_femafloodzoneshadedx) queryOptions.dcp_femafloodzoneshadedx = true;
      if (dcp_femafloodzonev) queryOptions.dcp_femafloodzonev = true;
    }

    if (actionType) queryOptions['action-types'] = actionTypes;
    if (actionReason) queryOptions['action-reasons'] = actionReasons;
    if (status) queryOptions.dcp_publicstatus = dcp_publicstatus;
    if (cds) queryOptions['community-districts'] = communityDistricts;
    if (ceqr) queryOptions.dcp_ceqrtype = dcp_ceqrtype;
    if (ulurp) queryOptions.dcp_ulurp_nonulurp = dcp_ulurp_nonulurp;

    // fetch any new projects
    const projects = yield this.store.query('project', queryOptions);
    const meta = projects.get('meta');

    // include the entire, un-paginated response
    const allProjects = this.store.peekAll('project');
    this.set('projects', allProjects);
    this.set('meta', meta);
  }

  @computed('meta.{total,pageTotal}', 'page')
  get noMoreRecords() {
    const pageTotal = this.get('meta.pageTotal');
    const total = this.get('meta.total');
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
  mutateArray(key, value) {
    const values = this.get(key);
    this.resetPagination();

    if (values.includes(value)) {
      values.removeObject(value);
    } else {
      values.pushObject(value);
    }

    this.set(key, values)
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
  resetAll() {
    this.resetQueryParams();
  }
}
