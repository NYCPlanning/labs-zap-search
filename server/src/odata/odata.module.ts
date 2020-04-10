import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { OdataService } from './odata.service';

@Module({
  imports: [ConfigModule],
  exports: [OdataService],
  providers: [OdataService],
})
export class OdataModule {}

// utility functions for creating OData queries
export function extractMeta(projects = []) {
  const [{ total_projects: total = 0 } = {}] = projects;
  const { length: pageTotal = 0 } = projects;

  return { total, pageTotal };
}

export function coerceToNumber(numericStrings) {
  return numericStrings.map(stringish => {
    // smelly; but let's prefer actual null
    // coercing 'null' turns to 0, which we don't
    // want in the API query
    if (stringish === null) return stringish;

    return Number(stringish);
  });
}

export function coerceToDateString(epoch) {
  const date = new Date(epoch * 1000);

  return date;
}

export function mapInLookup(arrayOfStrings, lookupHash) {
  return arrayOfStrings.map(string => lookupHash[string]);
}

export function all(...statements): string {
  return statements
    .filter(Boolean)
    .join(' and ');
}

export function any(...statements): string {
  return `(${(statements.join(' or '))})`;
}

export function comparisonOperator(propertyName, operator, value) {
  let typeSafeValue = value

  if ((typeof value === 'string') && value !== 'false' && value !== 'true') {
    typeSafeValue = `'${value}'`;
  }

  // most likely means it's a date. we want the date formatting that
  // json stringify provides.
  if ((typeof value === 'object') && value !== 'false' && value !== 'true') {
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

  return `(${querySegment})`;
}

export function containsAnyOf(propertyName, strings = [], options?) {
  const {
    childEntity = '',
    comparisonStrategy = containsString,
    not = false,
  } = options || {};

  const containsQuery = strings
    .map((string, i) => {
      // in odata syntax, this character o is a variable for scoping
      // logic for related entities. it needs to only appear once.
      const lambdaScope = (childEntity && i === 0) ? `${childEntity}:` : '';
      const lambdaScopedProperty = childEntity ? `${childEntity}/${propertyName}` : propertyName;

      return `${lambdaScope}${comparisonStrategy(lambdaScopedProperty, string)}`;
    })
    .join(' or ');
  const lambdaQueryPrefix = childEntity ? `${childEntity}/any` : '';

  return `(${not ? 'not ': ''}${lambdaQueryPrefix}(${containsQuery}))`;
}
