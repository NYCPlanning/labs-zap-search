export default function formatCdParam(communityDistrict) {
  let [ cdBoro, cdNumber ] = communityDistrict.split(' ');
  cdNumber = ("0" + cdNumber).slice(-2);

  return `${cdBoro}${cdNumber}`;
}
