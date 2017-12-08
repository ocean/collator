module.exports.register = (server, options, next) => {
  server.register(
    { register: require("hapi-pagination")},
    err => {
      if (err) throw err;
    }
  );

  next();
};

module.exports.register.attributes = {
  name: "pagination"
};
