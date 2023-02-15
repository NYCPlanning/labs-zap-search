import { helper } from '@ember/component/helper';

function bblDemux(bbl) {
  const boro = bbl.substring(0, 1);
  const block = parseInt(bbl.substring(1, 6), 10);
  const lot = parseInt(bbl.substring(6), 10);

  return { boro, block, lot };
}


// TODO:  Find more elegant way than hardcoding these URLs,
// and a better way to link the user to the Zoning Resolution Online portal (rather than directing them to search).
function zoningResolution(value) {
  // Appendix searches come up blank, so better to bring the user directly to these URLs
  const appendixUrls = {
    AppendixA: 'https://zr.planning.nyc.gov/appendix-index-uses',
    AppendixB: 'https://zr.planning.nyc.gov/appendix-b-index-special-purpose-districts',
    AppendixC: 'https://zr.planning.nyc.gov/appendix-c-table-1-city-environmental-quality-review-ceqr-environmental-requirements-e-designations',
    AppendixD: 'https://zr.planning.nyc.gov/appendix-d-zoning-map-amendment-d-restrictive-declarations',
    AppendixE: 'https://zr.planning.nyc.gov/appendix-e-design-requirements-plazas-residential-plazas-and-urban-plazas-developed-prior-october',
    AppendixF: 'https://zr.planning.nyc.gov/appendix-f-inclusionary-housing-designated-areas-and-mandatory-inclusionary-housing-areas',
    AppendixG: 'https://zr.planning.nyc.gov/appendix-g-radioactive-materials',
    AppendixH: 'https://zr.planning.nyc.gov/appendix-h-arterial-highways',
    AppendixI: 'https://zr.planning.nyc.gov/appendix-i-transit-zone',
    AppendixJ: 'https://zr.planning.nyc.gov/appendix-j-designated-areas-within-manufacturing-districts',
  };

  const romanNumerals = {
    1: 'i',
    2: 'ii',
    3: 'iii',
    4: 'iv',
    5: 'v',
    6: 'vi',
    7: 'vii',
    8: 'viii',
    9: 'ix',
    10: 'x',
    11: 'xi',
    12: 'xii',
    13: 'xiii',
    14: 'xiv',
  };

  // Return the hardcoded URL if "value" is one of the appendices (searching "AppendixA" returns no results)
  if (appendixUrls[value]) {
    return appendixUrls[value];
  }

  const val = value.split('-');

  if (val[0].length === 2) {
    const articleNum = val[0][0];
    return `https://zr.planning.nyc.gov/article-${romanNumerals[articleNum]}/chapter-${val[0][1]}/${value}}`;
  }

  if (val[0].length === 3) {
    const articleNum = val[0].substring(0, 2);
    return `https://zr.planning.nyc.gov/article-${romanNumerals[articleNum]}/chapter-${val[0][2]}/${value}}`;
  }

  return '';
}

function zola(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `https://zola.planning.nyc.gov/lot/${boro}/${block}/${lot}`;
}

function bisweb(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `http://a810-bisweb.nyc.gov/bisweb/PropertyBrowseByBBLServlet?allborough=${boro}&allblock=${block}&alllot=${lot}&go5=+GO+&requestid=0`;
}

function cpcReport(ulurpNumber, cpcUrl) {
  const serverRelativeFolderUrl = cpcUrl.replace('https://nyco365.sharepoint.com', '');

  // Some ulurp numbers have extra letter and overall 11 characters compared to the usual 10
  // They have an extra letter at the end of the 6 numbers.
  // It represents the version (ex. the "A" in C18005AZMX)
  if (ulurpNumber.length === 11) {
    // pull 6 numbers AND next character after the last number
    const ulurpNumberWithLetter = (ulurpNumber.match(/(\d+)./g)[0]).toLowerCase();
    return `${serverRelativeFolderUrl}/${ulurpNumberWithLetter}.pdf`;
  }

  // else assume ulurp has 10 characters, and no extra letter after first 6 numbers.
  // e.g. pull 100149 from C100149ZSM
  const ulurpNumberWithoutLetter = ulurpNumber.match(/\d+/g)[0];
  return `${serverRelativeFolderUrl}/${ulurpNumberWithoutLetter}.pdf`;
}

function acris(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${boro}&block=${block}&lot=${lot}`;
}

function LowerCaseBorough(borough) {
  if (borough) {
    return borough.replace(/\s/g, '-').toLowerCase();
  }
  return '';
}

function CommProfiles(boro, cd) {
  const LowerBoro = LowerCaseBorough(boro);
  return `http://communityprofiles.planning.nyc.gov/${LowerBoro}/${cd}`;
}

export function buildUrl([type, value, option]) {
  if (type === 'zoningResolution') return zoningResolution(value);
  if (type === 'zola') return zola(value);
  if (type === 'bisweb') return bisweb(value);
  if (type === 'cpcReport') return cpcReport(value, option);
  if (type === 'acris') return acris(value);
  if (type === 'CommProfiles') return CommProfiles(value, option);


  throw new Error('invalid type passed to build-url helper');
}

export default helper(buildUrl);
