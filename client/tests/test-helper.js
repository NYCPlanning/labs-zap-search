import Application from 'labs-zap-search/app';
import config from 'labs-zap-search/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
