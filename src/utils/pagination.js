const options = {
  meta: {
    location: "header"
  },
  routes: {
    include: ["api/v1/census/employees/all"]
  }
};

module.exports.register = (server, options, next) => {
  server.register(
    { register: require("hapi-pagination"), options: options },
    err => {
      if (err) throw err;
    }
  );

  next();
};

module.exports.register.attributes = {
  name: "pagination"
};
