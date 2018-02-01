import Joi from 'joi';

import {
  getAvatar,
  getMissing,
  importAvatar,
} from '../../handlers/census/avatar';

import {
  getEmployee,
  getManager,
  getTeam,
  importEmployee,
} from '../../handlers/census/employee';

import {
  getEmployeesBySurname,
  getPaginatedEmployees,
} from '../../handlers/census/employees';

import { orgHandler } from '../../handlers/census/organisation';
import { statsHandler } from '../../handlers/census/statistics';
import searchEmployees from '../../handlers/census/search/searchEmployees';
import searchBusinessUnits from '../../handlers/census/search/searchBusinessUnits';

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/census/employees/import',
      config: {
        auth: 'simple-token',
        payload: {
          output: 'stream',
          allow: 'multipart/form-data',
        },
        handler: importEmployee,
        description: 'Import',
        notes: 'Import employee spreadsheet.',
        tags: ['api', 'Employees'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/search',
      config: {
        validate: {
          query: {
            q: Joi.string().required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: searchEmployees,
        description: 'Search',
        notes: 'Search for employees.',
        tags: ['api', 'Employees'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees',
      config: {
        validate: {
          query: Joi.object({
            bran: Joi.string(),
            div: Joi.string(),
            directorate: Joi.string(),
            sect: Joi.string(),
            location_name: Joi.string(),
            sort: Joi.string(),
            page: Joi.number().integer(),
            limit: Joi.number().integer(),
          }).options({ allowUnknown: false }),
        },
        plugins: {
          pagination: {
            enabled: true,
          },
        },
        handler: getPaginatedEmployees,
        description: 'Filterable',
        notes: 'Filterable list of employees (Paginated!).',
        tags: ['api', 'Employees'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/{letter}',
      config: {
        validate: {
          params: {
            letter: Joi.string()
              .regex(/^[A-z]+$/)
              .max(1)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: true,
          },
        },
        handler: getEmployeesBySurname,
        description: 'Surname',
        notes: 'Get a paginated list of employees grouped by the first letter of their surname.',
        tags: ['api', 'Employees'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employee/{employeeID}',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z-]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getEmployee,
        description: 'Employee',
        notes: 'Returns information for the requested employeeID',
        tags: ['api', 'Employee'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employee/{employeeID}/manager',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z-]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getManager,
        description: 'Manager',
        notes: 'Returns the manager for the requested employeeID',
        tags: ['api', 'Employee'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employee/{employeeID}/team',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z-]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getTeam,
        description: 'Team',
        notes: 'Returns the team for the requested employeeID',
        tags: ['api', 'Employee'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employee/{employeeID}/avatar',
      config: {
        validate: {
          query: {
            size: Joi.number()
              .integer()
              .min(50)
              .max(500),
          },
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z-]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getAvatar,
        description: 'Avatar',
        notes: 'Returns an avatar for the supplied employeeID if available. A default avatar is shown if the avatar is missing.',
        tags: ['api', 'Employee'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/avatar/missing',
      config: {
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getMissing,
        description: 'Missing',
        notes: 'Returns userids of unused avatars. However, this is not a list of employees with missing avatars.',
        tags: ['api', 'Avatar'],
      },
    },
    {
      method: 'POST',
      path: '/api/v1/census/avatar',
      config: {
        auth: 'simple-token',
        payload: {
          output: 'stream',
          allow: 'multipart/form-data',
          parse: true,
        },
        handler: importAvatar,
        description: 'Import',
        notes: 'Import an avatar. Filename needs to be userid_date.jpg...e.g. AAlain_20170420.jpg',
        tags: ['api', 'Avatar'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/organisation/search',
      config: {
        validate: {
          query: {
            q: Joi.string().required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: searchBusinessUnits,
        description: 'Search',
        notes: 'Search for business units.',
        tags: ['api', 'Organisation'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/organisation/statistics',
      config: {
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: statsHandler,
        description: 'Statistics',
        notes: 'Returns the count of groups, divisions, directorates, branches, employees and locations',
        tags: ['api', 'Organisation'],
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/organisation/structure',
      config: {
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: orgHandler,
        description: 'Structure',
        notes: 'Returns a nested organisation structure.',
        tags: ['api', 'Organisation'],
      },
    },
  ]);

  next();
};

module.exports.register.attributes = {
  name: 'routes.census',
};
