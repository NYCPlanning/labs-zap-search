import * as fetch from 'node-fetch';
import * as moment from 'moment';

// why is this here
// https://api.airtable.com/v0/app5fwvDYGjqdMv3B/project%20timestamps?maxRecords=10&view=Grid%20view&filterByFormula=(projectid = 'P2013X0187')&api_key=key76Ljv28U2j8srw

const timeout = (resolve) => {
  return setTimeout(() => {
    resolve([{ error: 'Request timed out' }]);
  }, 1000);
};

const getVideoLookup = function(api_key, rows): Promise<any> {
  const promises = rows.map((row) => {
    const id = row.hearing_video[0];
    const api_call = `https://api.airtable.com/v0/app5fwvDYGjqdMv3B/hearing%20videos/${id}?api_key=${api_key}`;

    return fetch(api_call)
      .then(d => d.json())
      .then((d) => {
        const {
          youtube_link,
          date,
          hearing_type,
        } = d.fields;

        return {
          youtube_link,
          date,
          hearing_type,
        };
      });
  });

  return Promise.all(promises);
};

// main function, takes a projectid, returns a promise that resolves to an array of objects with youtube_link, date, and hearing_type
export const getVideoLinks = (api_key, projectid) => new Promise(async (resolve, reject) => {
  const api_call = `https://api.airtable.com/v0/app5fwvDYGjqdMv3B/project%20timestamps?maxRecords=10&view=Grid%20view&filterByFormula=(projectid = '${projectid}')&api_key=${api_key}`;

  const videoTimeout = timeout(resolve);

  try {
    // get the timestamps and video ids associated with this projectid
    const timestamps = await fetch(api_call)
      .then(d => d.json())
      .then(({ records = [] }) => records.map((record) => {
        clearTimeout(videoTimeout);
        const { fields } = record;
        const { hearing_video, video_timestamp } = fields;

        return {
          hearing_video,
          video_timestamp,
        };
      }));

    // for each object in timestamps
    const video_lookup = await getVideoLookup(api_key, timestamps) || [{}];

    const combined = timestamps.map(({ video_timestamp }, i) => {
      const {
        youtube_link,
        date,
        hearing_type,
      } = video_lookup[i];

      // concatenate the youtube link with the timestamp
      const seconds = moment.duration(video_timestamp).asSeconds();
      const video_link = `${youtube_link}&t=${seconds}s`;
      return {
        date,
        hearing_type,
        video_link,
      };
    });

    resolve(combined);
  } catch (e) {
    reject(e);
  }
});
