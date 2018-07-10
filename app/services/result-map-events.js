import Service from '@ember/service';
import Evented from '@ember/object/evented';

const EventedService = Service.extend(Evented);

export default class ResultMapEventsService extends EventedService {}
