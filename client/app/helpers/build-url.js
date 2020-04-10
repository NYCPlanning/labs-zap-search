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

  // Return the hardcoded URL if "value" is one of the appendices (searching "AppendixA" returns no results)
  if (appendixUrls[value]) {
    return appendixUrls[value];
  }

  // Else bring the user to the ZR search page
  return `https://zr.planning.nyc.gov/search?search_term=${value}`;
}

function zola(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `https://zola.planning.nyc.gov/lot/${boro}/${block}/${lot}`;
}

function bisweb(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `http://a810-bisweb.nyc.gov/bisweb/PropertyBrowseByBBLServlet?allborough=${boro}&allblock=${block}&alllot=${lot}&go5=+GO+&requestid=0`;
}

function cpcReport(ulurp) {
  // for ulurp numbers that have a letter at the end of the 6 numbers to represent the version (ex. the "A" in C18005AZMX)
  // pull 6 numbers AND next character after the last number
  const ulurpNumberWithLetter = (ulurp.match(/(\d+)./g)[0]).toLowerCase();
  const ulurpNumberWithoutLetter = ulurp.match(/\d+/g)[0]; // pull 100149 from C100149ZSM

  // the ulurp numbers with that extra letter have overall 11 characters compared to the usual 10
  if (ulurp.length > 10) {
    return `http://www1.nyc.gov/assets/planning/download/pdf/about/cpc/${ulurpNumberWithLetter}.pdf`;
  }

  return `http://www1.nyc.gov/assets/planning/download/pdf/about/cpc/${ulurpNumberWithoutLetter}.pdf`;
}

function acris(bbl) {
  const { boro, block, lot } = bblDemux(bbl);
  return `http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${boro}&block=${block}&lot=${lot}`;
}

function LowerCaseBorough(borough) {
  const boroText = borough.replace(/\s/g, '-');
  return boroText.toLowerCase();
}

function CommProfiles(boro, cd) {
  const LowerBoro = LowerCaseBorough(boro);
  return `http://communityprofiles.planning.nyc.gov/${LowerBoro}/${cd}`;
}

export function buildUrl([type, value, option]) {
  if (type === 'zoningResolution') return zoningResolution(value);
  if (type === 'zola') return zola(value);
  if (type === 'bisweb') return bisweb(value);
  if (type === 'cpcReport') return cpcReport(value);
  if (type === 'acris') return acris(value);
  if (type === 'CommProfiles') return CommProfiles(value, option);


  throw new Error('invalid type passed to build-url helper');
}

export default helper(buildUrl);
