// utility functions for creating OData queries
export function extractMeta(projects = []) {
  const [{ total_projects: total = 0 } = {}] = projects;
  const { length: pageTotal = 0 } = projects;

  return { total, pageTotal };
}

export function coerceToNumber(numericStrings) {
  return (
    numericStrings
      // filter out blank strings and undefined, which aren't meaningfully
      // coercible in CRM
      .filter(stringish => stringish !== '' && stringish !== undefined)
      .map(stringish => {
        // smelly; but let's prefer actual null
        // coercing 'null' turns to 0, which we don't
        // want in the API query
        if (stringish === null) return stringish;

        // Coercing an empty string into a number returns
        // NaN, which, although a number, is a Double in CRM
        // which typically expects an Int
        if (stringish === '') return stringish;

        return Number(stringish);
      })
  );
}

export function coerceToDateString(epoch) {
  const date = new Date(epoch * 1000);

  return date;
}

export function mapInLookup(arrayOfStrings, lookupHash) {
  return arrayOfStrings.map(string => lookupHash[string]);
}

export function all(...statements): string {
  const femaFloodZoneFilters = statements.filter(statement => {
    if (statement.includes('femafloodzone') && statement.includes('true'))
      return statement;
  });
  const filters = statements.filter(statement => {
    if (!statement.includes('femafloodzone')) return statement;
  });

  if (femaFloodZoneFilters.length > 0) {
    const femaFilterString = femaFloodZoneFilters.join(' and ');
    const filterString = filters.filter(Boolean).join(' and ');

    const allStatements = filterString.concat(
      ' and ',
      `((${femaFilterString}))`
    );
    return allStatements;
  }

  return statements.filter(Boolean).join(' and ');
}

export function any(...statements): string {
  return `(${statements.join(' or ')})`;
}

export function comparisonOperator(propertyName, operator, value) {
  let typeSafeValue = value;

  if (typeof value === 'string') {
    if (value !== 'false' && value !== 'true') {
      typeSafeValue = `'${value}'`;
    }
  }

  // most likely means it's a date. we want the date formatting that
  // json stringify provides.
  if (typeof value === 'object') {
    const stringyDate = JSON.stringify(value).replace(/"/g, "'");

    typeSafeValue = `${stringyDate}`;
  }

  return `(${propertyName} ${operator} ${typeSafeValue})`;
}

export function containsString(propertyName, string) {
  return `contains(${propertyName}, '${string}')`;
}

export function equalsAnyOf(propertyName, strings = []) {
  const querySegment = strings
    .map(string => comparisonOperator(propertyName, 'eq', string))
    .join(' or ');

  // Empty parenthases are invalid
  return querySegment ? `(${querySegment})` : '';
}

export function containsAnyOf(propertyName, strings = [], options?) {
  const { childEntity = '', comparisonStrategy = containsString, not = false } =
    options || {};

  const containsQuery = strings
    .map((string, i) => {
      // in odata syntax, this character o is a variable for scoping
      // logic for related entities. it needs to only appear once.
      const lambdaScope = childEntity && i === 0 ? `${childEntity}:` : '';
      const lambdaScopedProperty = childEntity
        ? `${childEntity}/${propertyName}`
        : propertyName;

      return `${lambdaScope}${comparisonStrategy(
        lambdaScopedProperty,
        string
      )}`;
    })
    .join(' or ');
  const lambdaQueryPrefix = childEntity ? `${childEntity}/any` : '';

  return `(${not ? 'not ' : ''}${lambdaQueryPrefix}(${containsQuery}))`;
}

export const dateParser = function(key, value) {
  if (typeof value === 'string') {
    // YYYY-MM-DDTHH:mm:ss.sssZ => parsed as UTC
    // YYYY-MM-DD => parsed as local date

    if (value != '') {
      const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(
        value
      );

      if (a) {
        const s = parseInt(a[6]);
        const ms = Number(a[6]) * 1000 - s * 1000;
        return new Date(
          Date.UTC(
            parseInt(a[1]),
            parseInt(a[2]) - 1,
            parseInt(a[3]),
            parseInt(a[4]),
            parseInt(a[5]),
            s,
            ms
          )
        );
      }

      const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

      if (b) {
        return new Date(
          parseInt(b[1]),
          parseInt(b[2]) - 1,
          parseInt(b[3]),
          0,
          0,
          0,
          0
        );
      }
    }
  }

  return value;
};

const COMMUNITY_DISPLAY_TOKEN = '@OData.Community.Display.V1.FormattedValue';

// CRM provides numeric codes for picklist types
// for example, "yes" might appear as "1"
// This function maps those values with appropriate labels
// TODO: Make this return new objects instead of in-place reassignment
export function overwriteCodesWithLabels(records, targetFields) {
  return records.map(record => {
    const newRecord = record;

    // parent record
    Object.keys(record)
      .filter(key => key.includes(COMMUNITY_DISPLAY_TOKEN))
      .map(key => key.replace(COMMUNITY_DISPLAY_TOKEN, ''))
      .forEach(key => {
        if (targetFields.includes(key)) {
          newRecord[key] = record[`${key}${COMMUNITY_DISPLAY_TOKEN}`];
        }
      });

    // child records
    // etag here is used to filter for entities
    // we need keys whos values are arrays
    Object.entries(record)
      .filter(([, value]) => Array.isArray(value))
      .forEach(([, collection]) => {
        collection
          // @ts-ignore
          .filter(Boolean)
          .map(record => {
            const newRecord = record;

            Object.keys(record)
              .filter(key => key.includes(COMMUNITY_DISPLAY_TOKEN))
              .map(key => key.replace(COMMUNITY_DISPLAY_TOKEN, ''))
              .forEach(key => {
                if (targetFields.includes(key)) {
                  newRecord[key] = record[`${key}${COMMUNITY_DISPLAY_TOKEN}`];
                }
              });
          });
      });

    return newRecord;
  });
}
