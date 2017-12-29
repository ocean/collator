import hapiPagination from 'hapi-pagination';

module.exports.register = (server, options, next) => {
  server.register(
    {
      register: hapiPagination,
      options: {
        routes: {
          include: [],
          exclude: ['/documentation'],
        },
      },
    },
    (err) => {
      if (err) throw err;
    }
  );

  next();
};

module.exports.register.attributes = {
  name: 'pagination',
};
