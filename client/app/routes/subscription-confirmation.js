import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'labs-zap-search/config/environment';

export default Route.extend({
  convertSubscriptionsToHandlebars(subscriptions) {
    var handlebars = { "citywide": false, "boroughs": [] }
    const boros = {
      "K": "Brooklyn",
      "X": "Bronx",
      "M": "Manhattan",
      "Q": "Queens",
      "R": "Staten Island"
    }
    for (const [key, value] of Object.entries(subscriptions)) {
      if (value === 1) {
        if (key === "CW") {
          handlebars.citywide = true;
        } else if (boros[key[0]]) {
          const i = handlebars.boroughs.findIndex((boro) => boro.name === boros[key[0]]);
            if (i === -1) {
              handlebars.boroughs.push({
                "name": boros[key[0]],
                "communityBoards": [parseInt(key.slice(-2))]
              })
            } else {
              handlebars.boroughs[i]["communityBoards"].push(parseInt(key.slice(-2)))
            }
        }
      }
    }
    return handlebars;
  },
  
  async model({ id }) {
    // No need to await for this to finish before making the next request
    fetch(`${ENV.host}/subscribers/${id}`, {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptions: { confirmed: 1 } }),
    })

    // Go directly into getting the subscriptions
    const response = await fetch(`${ENV.host}/subscribers/${id}`);

    const body = await response.json();
    if (!response.ok) throw await response.json();

    return this.convertSubscriptionsToHandlebars(body);
  }
});
