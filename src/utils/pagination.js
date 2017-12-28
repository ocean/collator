module.exports.register = (server, options, next) => {
  server.register(
    {
      register: require('hapi-pagination'),
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
