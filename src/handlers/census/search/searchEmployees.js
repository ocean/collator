import Fuse from 'fuse.js';
import sortBy from 'lodash/sortBy';
import connection from '../../../config/database';

const defaultSearchOptions = {
  shouldSort: true,
  tokenize: true,
  threshold: 0.1,
  location: 0,
  distance: 25,
  maxPatternLength: 32,
  minMatchCharLength: 3,
};
const defaultSearchKeys = {
  keys: [
    // {
    //   name: 'first_name',
    //   weight: 0.5,
    // },
    {
      name: 'preferred_name',
      weight: 1,
    },
    {
      name: 'previous_surname',
      weight: 0.6,
    },
    {
      name: 'surname',
      weight: 1,
    },
    {
      name: 'userid',
      weight: 0.4,
    },
  ],
};

// Combine options objects together with spread operator, woo!
const fullSearchOptions = { ...defaultSearchOptions, ...defaultSearchKeys };

const fnKeys = {
  keys: [
    {
      name: 'preferred_name',
      weight: 1,
    },
  ],
};
const fnOptions = { ...defaultSearchOptions, ...fnKeys };

export default async function searchEmployees(request, h) {
  const { q, fn, sn } = request.query;
  try {
    // Get all employees from the database
    const employees = await connection.table('employees').run();

    // Fields from each entry to extract and return
    const fieldsToExtract = ['first_name', 'preferred_name', 'surname', 'phone', 'position_title', 'userid', 'grp', 'div', 'directorate', 'bran', 'sect', 'location_name', 'sublocation_name'];

    // Generic "q" combined search
    const fuseFullSearch = new Fuse(await employees, fullSearchOptions);
    const fullResults = fuseFullSearch
      .search(q)
      .slice(0, 60)
      .map(result => fieldsToExtract.reduce(
        (a, b) => ((a[b] = result[b]), a),
        {}
      ));
    const results = sortBy(fullResults, ['surname', 'preferred_name']);

    // const fuseFirstName = new Fuse(await employees, fnOptions);
    // const fnResults = fuseFirstName
    //   .search(fn)
    //   .slice(0, 60)
    //   .map(result => fieldsToExtract.reduce(
    //     (a, b) => ((a[b] = result[b]), a),
    //     {}
    //   ));

    // return reply(results).code(200);
    // return reply(fullResults).code(200);
    return h.response(results)
      .code(200);
  } catch (error) {
    return h.response(error)
      .code(500);
  }
}
