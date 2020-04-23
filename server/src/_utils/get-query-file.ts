import * as path from 'path';
import * as pgp from 'pg-promise';
import * as rootPath from 'app-root-path';

// imports a pgp SQL Queryfile
export function getQueryFile(file) {
  const fullPath = path.join(`${rootPath}/queries`, file);
  return new pgp.QueryFile(fullPath, { minify: true });
};
