import connection from "../../config/database";

module.exports.register = (server, options, next) => {

  // AIAM? check for manager status....

  async function managerCheck(id) {
    const status = await connection
      .table("employees")
      .filter({ supervisor_userid: id.toUpperCase() })
      .count()
    
    return await status > 0 ? true : false;
  }
  
    
  async function getTeam(id, next) {
    try {
      const field = await managerCheck(id) ? 'userid' : 'supervisor_userid';
      const team = await connection
        .table("employees")
        .filter({ userid: id.toUpperCase() }) // Find requested employee.
        .innerJoin(
          connection
            .table("employees")
            // Filter out any employees on "Secondment". This is from a combination
            // of "actingOrHDAFlag" and "HDA_termination_date".
            .filter(document =>
              connection
                .and(document("actingOrHDAFlag").eq("N"))
                .and(document("HDA_termination_date").ne(""))
                .not()
            )
            // Filter out the requested employee from the team.
            .filter(document =>
              connection
                .expr([id.toUpperCase()])
                .contains(document("userid"))
                .not()
            ),
          (staff, team) => {
            
            // Equvilent of a self join to return all employees with the same "Manager"
            return staff(field).eq(team("supervisor_userid"));
          }
        )
        .zip()
        .run();
        if (team) next(null, team);
        else next("error");
      } catch (error) {
        next(error);
      }
  }

  server.method("db.getTeam", getTeam, {});

  next();
};

module.exports.register.attributes = {
  name: "method.db.getTeam"
};