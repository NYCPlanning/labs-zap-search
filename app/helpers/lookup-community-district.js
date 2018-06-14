import { helper } from '@ember/component/helper';
import isPointInPolylgon from '@turf/boolean-point-in-polygon';
import { get } from '@ember/object';

export function lookupCommunityDistrict([communityDistricts, point]) {
  const foundDist = communityDistricts.features.find(district => isPointInPolylgon(point, district));

  return get(foundDist, 'properties.displaynam');
}

export default helper(lookupCommunityDistrict);
