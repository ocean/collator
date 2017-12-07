import Joi from "joi";

import {
  getAvatar,
  getMissing,
  importAvatar
} from "../../handlers/census/avatar";

import {
  getEmployee,
  getManager,
  getTeam,
  importEmployee
} from "../../handlers/census/employee";

import {
  getEmployees,
  getEmployeesBySurname
} from "../../handlers/census/employees";

import { searchHandler } from "../../handlers/census/search";

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: "POST",
      path: "/api/v1/census/employees/import",
      config: {
        payload: {
          output: "stream",
          allow: "multipart/form-data"
        },
        handler: importEmployee
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/search",
      config: {
        validate: {
          query: {
            q: Joi.string().required()
          }
        },
        handler: searchHandler
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/all",
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
          }).options({ allowUnknown: false })
        },
        handler: getEmployees
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/all/{letter}",
      config: {
        validate: {
          params: {
            letter: Joi.string()
              .regex(/^[A-z]+$/)
              .max(1)
              .required()
          }
        },
        handler: getEmployeesBySurname
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}",
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required()
          }
        },
        handler: getEmployee
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/manager",
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required()
          }
        },
        handler: getManager
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/team",
      config: {
        validate: {
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required()
          }
        },
        handler: getTeam
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/employees/{employeeID}/avatar",
      config: {
        validate: {
          query: {
            size: Joi.number()
              .integer()
              .min(50)
              .max(500)
          },
          params: {
            employeeID: Joi.string()
              .regex(/^[A-z]+$/)
              .required()
          }
        },
        handler: getAvatar
      }
    },
    {
      method: "GET",
      path: "/api/v1/census/avatar/missing",
      handler: getMissing
    },
    {
      method: "POST",
      path: "/api/v1/census/avatar",
      config: {
        payload: {
          output: "stream",
          allow: "multipart/form-data",
          parse: true
        },
        handler: importAvatar
      }
    }
  ]);

  next();
};

module.exports.register.attributes = {
  name: "routes.census"
};
