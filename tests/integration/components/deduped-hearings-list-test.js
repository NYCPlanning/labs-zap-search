import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { dedupeAndExtract } from 'labs-zap-search/components/deduped-hearings-list';
import EmberObject from '@ember/object';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Integration | Component | deduped-hearings-list', function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  // I would definitely use ember mirage for this because we want the factory feature
  test('check that hearings list renders when user has submitted hearings', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T18:30:00');
    const date_B = new Date('2020-11-12T17:45:00');
    const date_C = new Date('2020-10-21T09:25:00');

    const store = this.owner.lookup('service:store');

    this.server.create('assignment', {
      id: 1,
      tab: 'to-review',
      project: this.server.create('project', 'withMilestones', {
        dispositions: [
          this.server.create('disposition', {
            id: 22,
            dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
            dcpDateofpublichearing: date_A,
            dcpProjectaction: 1,
          }),
          this.server.create('disposition', {
            id: 23,
            dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
            dcpDateofpublichearing: date_A,
            dcpProjectaction: 2,
          }),
          this.server.create('disposition', {
            id: 24,
            dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
            dcpDateofpublichearing: date_B,
            dcpProjectaction: 3,
          }),
          this.server.create('disposition', {
            id: 25,
            dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
            dcpDateofpublichearing: date_B,
            dcpProjectaction: 4,
          }),
          this.server.create('disposition', {
            id: 26,
            dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
            dcpDateofpublichearing: date_A,
            dcpProjectaction: 5,
          }),
          this.server.create('disposition', {
            id: 27,
            dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
            dcpDateofpublichearing: date_B,
            dcpProjectaction: 6,
          }),
          this.server.create('disposition', {
            id: 28,
            dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
            dcpDateofpublichearing: date_C,
            dcpProjectaction: 7,
          }),
        ],
        actions: [
          this.server.create('action', {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          }),
          this.server.create('action', {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          }),
          this.server.create('action', {
            dcpName: 'Business Improvement District',
            dcpUlurpnumber: 'I030148MMQ',
          }),
          this.server.create('action', {
            dcpName: 'Change in City Map',
            dcpUlurpnumber: '200088ZMX',
          }),
          this.server.create('action', {
            dcpName: 'Enclosed Sidewalk Cafe',
            dcpUlurpnumber: '190172ZMK',
          }),
          this.server.create('action', {
            dcpName: 'Large Scale Special Permit',
            dcpUlurpnumber: 'N190257ZRK',
          }),
          this.server.create('action', {
            dcpName: 'Zoning Certification',
            dcpUlurpnumber: '190256ZMK',
          }),
        ],
      }),
      dispositions: this.server.schema.dispositions.all(),
    });

    const assignments = await store.query('assignment', { tab: 'to-review', include: 'project,project.milestones,project.dispositions,project.actions,dispositions,dispositions.project' });

    this.set('assignment', assignments.firstObject);

    await render(hbs`
      {{#to-review-project-card assignment=assignment}}
      {{/to-review-project-card}}
      <div id="reveal-modal-container"></div>
    `);

    const list = this.element.textContent.trim();

    assert.ok(list.includes('121 Bananas Ave'), 'saw 121 Bananas Ave');
    assert.ok(list.includes('186 Alligators Ave'), 'saw 186 Alligators Ave');
    assert.ok(list.includes('144 Piranha Ave'), 'saw 144 Piranha Ave');
    assert.ok(list.includes('456 Crocodiles Ave'), 'saw 456 Crocodiles Ave');

    assert.ok(list.includes('10/21/2020'), 'saw 10/21/2020');
    assert.ok(list.includes('11/12/2020'), 'saw 11/12/2020');

    assert.ok(list.includes('6:30 PM'), 'saw 6:30 PM');
    assert.ok(list.includes('9:25 AM'), 'saw 9:25 AM');
    assert.ok(list.includes('5:45 PM'), 'saw 5:45 PM');

    assert.ok(list.includes('C780076TLK'), 'saw C780076TLK');
    assert.ok(list.includes('N860877TCM'), 'saw N860877TCM');
    assert.ok(list.includes('190172ZMK'), 'saw 190172ZMK');
    assert.ok(list.includes('I030148MMQ'), 'saw I030148MMQ');
    assert.ok(list.includes('200088ZMX'), 'saw 200088ZMX');
    assert.ok(list.includes('N190257ZRK'), 'saw N190257ZRK');
    assert.ok(list.includes('190256ZMK'), 'saw 190256ZMK');
  });

  test('dedupeAndExtract function works', async function(assert) {
    // dates for dcpDateofpublichearing
    const date_A = new Date('2020-10-21T18:30:00');
    const date_B = new Date('2020-11-12T17:45:00');
    const date_C = new Date('2020-10-21T09:25:00');

    // Create 7 disposition objects to put into dispositions array
    const ourDisps = EmberObject.extend({});

    // Disposition 22 ############## DUPLICATE WITH 23 & 26
    const disp22 = ourDisps.create({
      disposition: ourDisps.create({
        id: 22,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_A,
        action: {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Zoning Special Permit',
          dcpUlurpnumber: 'C780076TLK',
        },
      ],
      duplicateDisps: [
        {
          id: 22,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Zoning Special Permit',
            dcpUlurpnumber: 'C780076TLK',
          },
        },
      ],
    });

    // Disposition 23 ############## DUPLICATE WITH 22 & 26
    const disp23 = ourDisps.create({
      disposition: ourDisps.create({
        id: 23,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_A,
        action: {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Zoning Text Amendment',
          dcpUlurpnumber: 'N860877TCM',
        },
      ],
      duplicateDisps: [
        {
          id: 23,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Zoning Text Amendment',
            dcpUlurpnumber: 'N860877TCM',
          },
        },
      ],
    });

    // Disposition 24 ##########################################################
    const disp24 = ourDisps.create({
      disposition: ourDisps.create({
        id: 24,
        dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
        dcpDateofpublichearing: date_B,
        action: {
          dcpName: 'Business Improvement District',
          dcpUlurpnumber: 'I030148MMQ',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Business Improvement District',
          dcpUlurpnumber: 'I030148MMQ',
        },
      ],
      duplicateDisps: [
        {
          id: 24,
          dcpPublichearinglocation: '186 Alligators Ave, Staten Island, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Business Improvement District',
            dcpUlurpnumber: 'I030148MMQ',
          },
        },
      ],
    });

    // Disposition 25 ##########################################################
    const disp25 = ourDisps.create({
      disposition: ourDisps.create({
        id: 25,
        dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
        dcpDateofpublichearing: date_B,
        action: {
          dcpName: 'Change in City Map',
          dcpUlurpnumber: '200088ZMX',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Change in City Map',
          dcpUlurpnumber: '200088ZMX',
        },
      ],
      duplicateDisps: [
        {
          id: 25,
          dcpPublichearinglocation: '144 Piranha Ave, Manhattan, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Change in City Map',
            dcpUlurpnumber: '200088ZMX',
          },
        },
      ],
    });

    // Disposition 26 ############## DUPLICATE WITH 22 & 23
    const disp26 = ourDisps.create({
      disposition: ourDisps.create({
        id: 26,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_A,
        action: {
          dcpName: 'Enclosed Sidewalk Cafe',
          dcpUlurpnumber: '190172ZMK',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Enclosed Sidewalk Cafe',
          dcpUlurpnumber: '190172ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 26,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_A,
          action: {
            dcpName: 'Enclosed Sidewalk Cafe',
            dcpUlurpnumber: '190172ZMK',
          },
        },
      ],
    });

    // Disposition 27 ##########################################################
    const disp27 = ourDisps.create({
      disposition: ourDisps.create({
        id: 27,
        dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
        dcpDateofpublichearing: date_B,
        action: {
          dcpName: 'Large Scale Special Permit',
          dcpUlurpnumber: 'N190257ZRK',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Large Scale Special Permit',
          dcpUlurpnumber: 'N190257ZRK',
        },
      ],
      duplicateDisps: [
        {
          id: 27,
          dcpPublichearinglocation: '456 Crocodiles Ave, Bronx, NY',
          dcpDateofpublichearing: date_B,
          action: {
            dcpName: 'Large Scale Special Permit',
            dcpUlurpnumber: 'N190257ZRK',
          },
        },
      ],
    });


    // Disposition 28 ##########################################################
    const disp28 = ourDisps.create({
      disposition: ourDisps.create({
        id: 28,
        dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
        dcpDateofpublichearing: date_C,
        action: {
          dcpName: 'Zoning Certification',
          dcpUlurpnumber: '190256ZMK',
        },
      }),
      hearingActions: [
        {
          dcpName: 'Zoning Certification',
          dcpUlurpnumber: '190256ZMK',
        },
      ],
      duplicateDisps: [
        {
          id: 28,
          dcpPublichearinglocation: '121 Bananas Ave, Queens, NY',
          dcpDateofpublichearing: date_C,
          action: {
            dcpName: 'Zoning Certification',
            dcpUlurpnumber: '190256ZMK',
          },
        },
      ],
    });

    // mimics each project's array of dispositions
    const dispositions = [disp22, disp23, disp24, disp25, disp26, disp27, disp28];

    // run the dedupeAndExtract function, which...
    // (1) deduplicates array of objects based on a disposition's dcpPublichearinglocation & dcpDateofpublichearing properties
    // and (2) concatenates properties for duplicate objects
    const deduped = dedupeAndExtract(dispositions, 'dcpPublichearinglocation', 'dcpDateofpublichearing', 'action', 'hearingActions', 'duplicateDisps');

    // check that are our duplicateDisps array has the correct duplicate dispositions
    assert.equal(deduped[0].duplicateDisps.map(d => d.id).join(','), '22,23,26'); // disp 22, 23, 26
    assert.equal(deduped[1].duplicateDisps.map(d => d.id).join(','), '24'); // disp 24
    assert.equal(deduped[2].duplicateDisps.map(d => d.id).join(','), '25'); // disp 25
    assert.equal(deduped[3].duplicateDisps.map(d => d.id).join(','), '27'); // disp 27
    assert.equal(deduped[4].duplicateDisps.map(d => d.id).join(','), '28'); // disp 28

    // check that duplicate disposition properties are removed (a duplicate will have the same hearing location and hearing date)
    assert.equal(deduped[0].disposition.dcpPublichearinglocation, '121 Bananas Ave, Queens, NY'); // disp 22, 23, 26
    assert.equal(deduped[1].disposition.dcpPublichearinglocation, '186 Alligators Ave, Staten Island, NY'); // disp 24
    assert.equal(deduped[2].disposition.dcpPublichearinglocation, '144 Piranha Ave, Manhattan, NY'); // disp 25
    assert.equal(deduped[3].disposition.dcpPublichearinglocation, '456 Crocodiles Ave, Bronx, NY'); // disp 27
    assert.equal(deduped[4].disposition.dcpPublichearinglocation, '121 Bananas Ave, Queens, NY'); // disp 28

    // check that hearingActions array has all actions associated with duplicate disposition
    assert.equal(deduped[0].hearingActions.map(d => d.dcpUlurpnumber).join(','), 'C780076TLK,N860877TCM,190172ZMK'); // disp 22, 23, 26
    assert.equal(deduped[1].hearingActions.map(d => d.dcpUlurpnumber).join(','), 'I030148MMQ'); // disp 24
    assert.equal(deduped[2].hearingActions.map(d => d.dcpUlurpnumber).join(','), '200088ZMX'); // disp 25
    assert.equal(deduped[3].hearingActions.map(d => d.dcpUlurpnumber).join(','), 'N190257ZRK'); // disp 27
    assert.equal(deduped[4].hearingActions.map(d => d.dcpUlurpnumber).join(','), '190256ZMK'); // disp 28
  });
});
