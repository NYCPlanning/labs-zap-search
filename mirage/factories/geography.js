import { Factory, faker } from 'ember-cli-mirage';

const cds =
  `bk-6,bx-4,qn-11,bk-5,qn-10,si-2,
  bk-15,bk-4,mn-3,qn-9,qn-2,bk-8,mn-8,bk-10,si-3,qn-14,bx-10,bx-6,
  bk-17,mn-11,bk-16,mn-5,bx-2,mn-9,mn-7,qn-1,si-1,mn-12,bk-18,mn-2,
  bk-1,bk-12,qn-8,bk-13,qn-6,bx-12,bk-3,qn-4,bk-7,mn-1,qn-3,bx-1,mn-4,bx-3,bk-14,bx-5,qn-5,bx-11,
  bk-9,bx-9,bk-2,bx-8,qn-12,mn-6,bk-11,qn-7,mn-10,bx-7,qn-13,si-95`;

export default Factory.extend({
  afterCreate(geography, server) {
    server.createList('project', 20, { geography });
  },

  type() {
    return ['community-district', 'other'];
  },

  slug() {
    const districts = cds.split(',').map(cd => cd.trim());
    return faker.random.arrayElement(districts);
  },
});

