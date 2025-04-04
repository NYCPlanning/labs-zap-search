import { helper } from '@ember/component/helper';

export const communityDistrictLookup = [
  ['K01', '1', 'Brooklyn'],
  ['K02', '2', 'Brooklyn'],
  ['K03', '3', 'Brooklyn'],
  ['K04', '4', 'Brooklyn'],
  ['K05', '5', 'Brooklyn'],
  ['K06', '6', 'Brooklyn'],
  ['K07', '7', 'Brooklyn'],
  ['K08', '8', 'Brooklyn'],
  ['K09', '9', 'Brooklyn'],
  ['K10', '10', 'Brooklyn'],
  ['K11', '11', 'Brooklyn'],
  ['K12', '12', 'Brooklyn'],
  ['K13', '13', 'Brooklyn'],
  ['K14', '14', 'Brooklyn'],
  ['K15', '15', 'Brooklyn'],
  ['K16', '16', 'Brooklyn'],
  ['K17', '17', 'Brooklyn'],
  ['K18', '18', 'Brooklyn'],
  ['X01', '1', 'Bronx'],
  ['X02', '2', 'Bronx'],
  ['X03', '3', 'Bronx'],
  ['X04', '4', 'Bronx'],
  ['X05', '5', 'Bronx'],
  ['X06', '6', 'Bronx'],
  ['X07', '7', 'Bronx'],
  ['X08', '8', 'Bronx'],
  ['X09', '9', 'Bronx'],
  ['X10', '10', 'Bronx'],
  ['X11', '11', 'Bronx'],
  ['X12', '12', 'Bronx'],
  ['M01', '1', 'Manhattan'],
  ['M02', '2', 'Manhattan'],
  ['M03', '3', 'Manhattan'],
  ['M04', '4', 'Manhattan'],
  ['M05', '5', 'Manhattan'],
  ['M06', '6', 'Manhattan'],
  ['M07', '7', 'Manhattan'],
  ['M08', '8', 'Manhattan'],
  ['M09', '9', 'Manhattan'],
  ['M10', '10', 'Manhattan'],
  ['M11', '11', 'Manhattan'],
  ['M12', '12', 'Manhattan'],
  ['Q01', '1', 'Queens'],
  ['Q02', '2', 'Queens'],
  ['Q03', '3', 'Queens'],
  ['Q04', '4', 'Queens'],
  ['Q05', '5', 'Queens'],
  ['Q06', '6', 'Queens'],
  ['Q07', '7', 'Queens'],
  ['Q08', '8', 'Queens'],
  ['Q09', '9', 'Queens'],
  ['Q10', '10', 'Queens'],
  ['Q11', '11', 'Queens'],
  ['Q12', '12', 'Queens'],
  ['Q13', '13', 'Queens'],
  ['Q14', '14', 'Queens'],
  ['R01', '1', 'Staten Island'],
  ['R02', '2', 'Staten Island'],
  ['R03', '3', 'Staten Island'],
].map(([code, num, boro]) => ({
  code, num, boro, searchField: `${boro} ${num}`,
}));

export function lookupCommunityDistrict() {
  return communityDistrictLookup;
}

export function getCommunityDistrictsByBorough() {
  const communityDistrictsByBorough = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const district of communityDistrictLookup) {
    const { code, num, boro } = district;
    if (boro in communityDistrictsByBorough === false) {
      communityDistrictsByBorough[boro] = [];
    }
    communityDistrictsByBorough[boro].push({ code, num, boro });
  }
  return communityDistrictsByBorough;
}

export default helper(lookupCommunityDistrict);
