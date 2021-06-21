import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | to-review-project-card', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('check that hearings list appears when user has submitted hearings', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    const hearingDate = new Date('2020-10-21T18:30:00');

    this.server.create('assignment', {
      id: 1,
      tab: 'to-review',
      project: this.server.create('project', 'withMilestones', {
        dispositions: [
          this.server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '341 Yellow Avenue',
            dcpDateofpublichearing: hearingDate,
            dcpIspublichearingrequired: '',
            dcpProjectaction: 1,
          }),
          this.server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '890 Purple Street',
            dcpDateofpublichearing: hearingDate,
            dcpIspublichearingrequired: '',
            dcpProjectaction: 2,
          }),
          this.server.create('disposition', {
            id: 3,
            dcpPublichearinglocation: '124 Green Boulevard',
            dcpDateofpublichearing: hearingDate,
            dcpIspublichearingrequired: '',
            dcpProjectaction: 3,
          }),
        ],
        actions: [
          this.server.create('action', { id: 1, dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          this.server.create('action', { id: 2, dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          this.server.create('action', { id: 3, dcpName: 'Business Improvement District', dcpUlurpnumber: 'N905588TLM' }),
        ],
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    const assignments = await store.query('assignment', {
      tab: 'to-review',
      include: 'project,project.milestones,project.dispositions,project.actions,dispositions,dispositions.project',
    });

    this.set('assignment', assignments.firstObject);

    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('341 Yellow Avenue'), 'saw 341 Yellow Avenue');
    assert.ok(card.includes('890 Purple Street'), 'saw 890 Purple Street');
    assert.ok(card.includes('124 Green Boulevard'), 'saw 124 Green Boulevard');
  });

  test('check that opt out of hearings BUTTON appears when dcpIspublichearinglocation is empty string', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    const store = this.owner.lookup('service:store');

    this.server.create('assignment', {
      id: 1,
      tab: 'to-review',
      dcpLupteammemberrole: 'CB',
      project: this.server.create('project', {
        id: 2,
        dispositions: [
          this.server.create('disposition', {
            id: 1,
            dcpRepresenting: 'Community Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: '',
            dcpProjectaction: '1',
          }),
          this.server.create('disposition', {
            id: 2,
            dcpRepresenting: 'Community Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: '',
            dcpProjectaction: '2',
          }),
          this.server.create('disposition', {
            id: 3,
            dcpRepresenting: 'Community Board',
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: '',
            dcpProjectaction: '3',
          }),
        ],
        actions: [
          this.server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          this.server.create('action', { id: '2', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          this.server.create('action', { id: '3', dcpName: 'Business Improvement District', dcpUlurpnumber: 'N905588TLM' }),
        ],
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    const assignments = await store.query('assignment', {
      tab: 'to-review',
      include: 'project,project.milestones,project.dispositions,project.actions,dispositions,dispositions.project',
    });

    this.set('assignment', assignments.firstObject);

    // Template block usage:
    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes('Post Community Board Hearing Notice'));
    assert.ok(card.includes('Opt Out'));
  });

  test('check that opt out of hearings MESSAGE appears when dcpIspublichearingrequired is No', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    this.server.create('assignment', {
      id: 1,
      tab: 'to-review',
      project: this.server.create('project', {
        id: 2,
        dispositions: [
          this.server.create('disposition', {
            id: 1,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: 717170001, // No
            dcpProjeaction: '1',
          }),
          this.server.create('disposition', {
            id: 2,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: 717170001, // No
            dcpProjeaction: '2',
          }),
          this.server.create('disposition', {
            id: 3,
            dcpPublichearinglocation: '',
            dcpDateofpublichearing: null,
            dcpIspublichearingrequired: 717170001, // No
            dcpProjeaction: '3',
          }),
        ],
        actions: [
          this.server.create('action', { id: '1', dcpName: 'Zoning Special Permit', dcpUlurpnumber: 'C780076TLK' }),
          this.server.create('action', { id: '2', dcpName: 'Zoning Text Amendment', dcpUlurpnumber: 'N860877TCM' }),
          this.server.create('action', { id: '3', dcpName: 'Business Improvement District', dcpUlurpnumber: 'N905588TLM' }),
        ],
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    const store = this.owner.lookup('service:store');

    const assignments = await store.query('assignment', {
      tab: 'to-review',
      include: 'project,project.milestones,project.dispositions,project.actions,dispositions,dispositions.project',
    });

    this.set('assignment', assignments.firstObject);

    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const card = this.element.textContent.trim();

    assert.ok(card.includes("You've opted out of posting a hearing"));
    assert.notOk(card.includes('Opt out'));
    assert.notOk(card.includes('Post Community Board Hearing Notice'));
  });
});
