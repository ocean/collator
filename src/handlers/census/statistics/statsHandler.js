// export default function statsHandler(request, reply) {
//   return reply([
//     {
//       organisation: {
//         groups: 3,
//         divisions: 30,
//         branches: 100
//       },
//       employees: {
//         total: 3,
//         employees: 30,
//         contractors: 100
//       },
//       locations: {
//         buildings: 3,
//         divisions: 30,
//         branches: 100
//       }
//     }
//   ]);

//   request.server.methods.db.getEmployees((error, employees) => {
//   // // if (error) reply(error).code(500);
//   // return reply("A message about how you've messed up");
// }


export default function statsHandler(request, reply) {
  request.server.methods.db.getStats((error, employee) => {
    if (error) reply(error).code(500);
    return reply(employee).code(200);
  });
}
