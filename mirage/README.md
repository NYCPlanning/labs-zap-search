
## Mock Data with Mirage

The app now loads with a stale default scenario (`mirage/scenarios/default.js`). It's considered "stale" because it loads a static JSON representation of the mock data, which should be infrequently changed.

We no longer want to set up and frequently update mock data for all edge cases at once in one file, i.e. have one "universal" scenario. 

Moving forward we will set up focused scenarios -- mock data specific to certain a certain feature and its corresponding acceptance test. 

### Regenerating the default scenario JSON

Not encouraged, but if we really want to update the default scenario with more data:

1. Open `mirage/scenarios/default.js`
2. Comment out `server.db.loadData(rawData)`
2. import the function from `mirage/scenarios/generate`
   - ( This generated function generates data in Mirage's `server`
and then dumps it out to the console using `server.db.dump()`).
3. call the imported function from `generated` within `default`'s exported function
4. Run the ember app locally
5. Open the console and copy the logged JSON output. It will be everything following `"Database:"`
6. Paste the output into `mirage/db-data/default.js`, replacing the default export.

### TODO:

  - Set up environment variables that load the app with specific scenarios