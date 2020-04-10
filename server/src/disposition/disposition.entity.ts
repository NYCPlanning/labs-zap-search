import { Entity, Column, PrimaryColumn } from 'typeorm';

export const KEYS = [
  'dcp_publichearinglocation',
  'dcp_ispublichearingrequired',
  'dcp_dateofpublichearing',
  'dcp_recommendationsubmittedby',
  'dcp_boroughpresidentrecommendation',
  'dcp_boroughboardrecommendation',
  'dcp_communityboardrecommendation',
  'dcp_consideration',
  'dcp_votelocation',
  'dcp_datereceived',
  'dcp_dateofvote',
  'dcp_nameofpersoncompletingthisform',
  'fullname',
  'statecode',
  'statuscode',
  'dcp_docketdescription',
  'dcp_votinginfavorrecommendation',
  'dcp_votingagainstrecommendation',
  'dcp_votingabstainingonrecommendation',
  'dcp_totalmembersappointedtotheboard',
  'dcp_wasaquorumpresent',
  'dcp_projectaction',
  'dcp_representing',
  '_dcp_recommendationsubmittedby_value',
  '_dcp_projectaction_value',
];

@Entity('dcp_communityboarddisposition')
export class Disposition {
  @PrimaryColumn({ name: 'dcp_communityboarddispositionid' })
  id: string;

  @Column()
  dcp_nameofpersoncompletingthisform: string

  @Column()
  dcp_publichearinglocation: string;

  @Column()
  dcp_dateofpublichearing: string;

  @Column()
  dcp_ispublichearingrequired: string;

  @Column()
  dcp_recommendationsubmittedby: string;

  @Column()
  dcp_boroughpresidentrecommendation: string;

  @Column()
  dcp_boroughboardrecommendation: string;

  @Column()
  dcp_communityboardrecommendation: string;

  @Column()
  dcp_consideration: string;

  @Column()
  dcp_votelocation: string;

  @Column()
  dcp_datereceived: string;

  @Column()
  dcp_dateofvote: string;

  @Column()
  statecode: string;

  @Column()
  statuscode: string;

  @Column()
  dcp_docketdescription: string;

  @Column()
  dcp_votinginfavorrecommendation: string;

  @Column()
  dcp_votingagainstrecommendation: string;

  @Column()
  dcp_votingabstainingonrecommendation: string;

  @Column()
  dcp_totalmembersappointedtotheboard: string;

  @Column()
  dcp_wasaquorumpresent: string;

  @Column()
  dcp_projectaction: string;
}
