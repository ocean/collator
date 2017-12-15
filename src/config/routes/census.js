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
  getEmployees,
  getEmployeesBySurname,
  getPaginatedEmployees
} from "../../handlers/census/employees";

import { orgHandler } from "../../handlers/census/organisation";
import { statsHandler } from "../../handlers/census/statistics";
import { searchHandler } from "../../handlers/census/search";


module.exports.register = (server, options, next) => {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/census/employees/import',
      config: {
        payload: {
          output: 'stream',
          allow: 'multipart/form-data',
        },
        handler: importEmployee,
        description: "Import",
        notes: "Import employee spreadsheet.",
        tags: ["api", "Employees"]
      }
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
        handler: searchHandler,
        description: "Search",
        notes: "Search for employees.",
        tags: ["api", "Employees"]
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/all',
      config: {
        validate: {
          query: Joi.object({
            bran: Joi.string(),
            div: Joi.string(),
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
        description: "Filterable",
        notes: "Filterable list of employees (Paginated!).",
        tags: ["api", "Employees"]
      }
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/all/{letter}',
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
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/{employeeID}',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getEmployee,
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/{employeeID}/manager',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getManager,
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/{employeeID}/team',
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getTeam,
      },
    },
    {
      method: 'GET',
      path: '/api/v1/census/employees/{employeeID}/avatar',
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
              .regex(/^[A-z]+$/)
              .required(),
          },
        },
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: getAvatar,
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
      },
    },
    {
      method: 'POST',
      path: '/api/v1/census/avatar',
      config: {
        payload: {
          output: 'stream',
          allow: 'multipart/form-data',
          parse: true,
        },
        handler: importAvatar
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/statistics",
      config: {
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: statsHandler
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/organisation",
      config: {
        plugins: {
          pagination: {
            enabled: false,
          },
        },
        handler: orgHandler
      }
    }    
  ]);

  next();
};

module.exports.register.attributes = {
  name: 'routes.census',
};
