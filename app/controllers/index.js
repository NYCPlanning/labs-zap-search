import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import formatParam from '../utils/format-cd-param';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';

export default class IndexController extends Controller {
  @action
  selectSearchResult({ communityDistricts }, { geometry }) {
    const foundDistrict = lookupCommunityDistrict([communityDistricts, geometry]);
    
    this.transitionToRoute('show-geography', { queryParams: { 'community-districts': [formatParam(foundDistrict)] } });
  }
}
