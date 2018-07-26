import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { buildUrl } from '../helpers/build-url';

export default class BBLComponent extends Component {
  tagName = 'span';

  @computed('bbl')
  get tooltip() {
    const { bbl } = this;

    let boro = bbl.substring(0, 1);
    if (boro === 1) { boro = 'Manhattan'; }
    if (boro === 2) { boro = 'Brooklyn'; }
    if (boro === 3) { boro = 'Queens'; }
    if (boro === 4) { boro = 'Bronx'; }
    if (boro === 5) { boro = 'Staten Island'; }

    const block = parseInt(bbl.substring(1, 6), 10);
    const lot = parseInt(bbl.substring(6), 10);

    return `
      <div class="text-center">
        <p class="header-small">${boro}, Block ${block}, Lot ${lot}</p>
        <p class="header-tiny">View lot in&hellip;</p>
        <p class="">
          <a class="button secondary small no-margin" href="${buildUrl(['zola', bbl])}" target="_blank">ZoLa</a>
          <a class="button secondary small no-margin" href="${buildUrl(['bisweb', bbl])}" target="_blank">BISWeb</a>
          <a class="button secondary small no-margin" href="${buildUrl(['acris', bbl])}" target="_blank">ACRIS</a>
        </p>
      </div>
    `;
  }

  @argument bbl;
}
