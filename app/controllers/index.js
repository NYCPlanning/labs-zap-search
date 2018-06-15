import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import { dasherize } from '@ember/string';
import { lookupCommunityDistrict } from '../helpers/lookup-community-district';

export default class IndexController extends Controller {
  @action
  selectSearchResult({ communityDistricts }, { geometry }) {
    const foundDistrict = lookupCommunityDistrict([communityDistricts, geometry]);
    
    this.transitionToRoute('show-geography', dasherize(foundDistrict), { queryParams: { 'community-district': dasherize(foundDistrict) } });
  }
}
