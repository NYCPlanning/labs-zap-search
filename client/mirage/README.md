
## Mock Data with Mirage

If the app is loaded without a `MIRAGE_SCENARIO` environment variable specified, it loads with a stale default scenario (`mirage/scenarios/default.js`). It's considered "stale" because it loads a static JSON representation of the mock data, which should be infrequently changed.

*NOTE:* This default scenario is also not updated to use assignments. Thus no assignments load in the `/my-projects` view.

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


# Scenarios

Below is the table of scenarios that the `db-data/default.js` fixture / `scenarios/generate.js` scenario file represents:

participant|tab|In Public Review?|CB Hearing scheduled?|CB Rec submitted?|BB Hearing?|BB Rec?|BP Hearing?|BP Rec?|CB Review|BB Review|BP Review|Post Review
-----------|---|-----------------|---------------------|-----------------|-----------|-------|-----------|-------|---------|---------|---------|-----------
CB|Upcoming|No|No|No|No|No|No|No|Not Started|Not Started|Not Started|
CB|To Review|Yes|No|No|No|No|No|No|In Progress|Not Started|Not Started|
CB|To Review|Yes|Yes|No|No|No|No|No|In Progress|Not Started|Not Started|
CB|Reviewed|Yes|Yes|Yes|Yes|No|No|No|Completed|In Progress|Not Started|
CB|Reviewed|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Completed|Completed|Completed|
BB|Upcoming|Yes|No|No|||||Completed|Not Started|Not Started|
BP|Upcoming|No|No|No|No|No|No|NO|Not Started|Not Started|Not Started|
BP|Upcoming|Yes|No|No|No|No|No|No|In Progress|Not Started|Not Started|
BP|Upcoming|Yes|Yes|Yes|No|No|No|No|Completed|In Progress|No started|
BP|To Review|Yes|Yes|Yes|Yes|No|No|No|Completed|In progress|In Progress|
BP|To Review|Yes|Yes|Yes|Yes|Yes|Yes|No|Completed|Completed|In Progress|
BP|To Review|Yes|Yes|Yes|Yes|Yes|Yes|No|Completed|Completed|In Progress|
BP|Reviewed|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Completed|Completed|Completed| Some complete
BP|Archive|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Completed|Completed|Completed| All complete