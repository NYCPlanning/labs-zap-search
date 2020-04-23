import { helper } from '@ember/component/helper';

export default helper(function pluralize([count, singular, plural]) {
  return (count === 1) ? singular : plural;
});
