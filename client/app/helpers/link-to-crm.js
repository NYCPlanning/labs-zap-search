import { helper } from '@ember/component/helper';
import ENV from '../config/environment';

export default helper(function linkToCrm([type, id]) {
  const { environment } = ENV;
  let host;

  if (environment === 'development') {
    host = 'https://dcppfsuat2.crm9.dynamics.com';
  } else {
    host = 'https://nycdcppfs.crm9.dynamics.com';
  }

  return `${host}/main.aspx?etn=${type}&id={${id}}&pagetype=entityrecord`;
});
