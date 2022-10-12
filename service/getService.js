const haveEmployeeId = async (con, sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result[0] == undefined) {
        //? Not duplicate
        resolve(false);
        console.log("Invalid employee id");
      } else {
        //? duplicate
        resolve(true);
        console.log("Valid employee id");
      }
    });
  });
};

function getSerivecByc(con, req, res) {
    const service_id = req.query.service_id;
    const employee_id = req.query.employee_id;
    const sql1 = `SELECT * FROM service WHERE service_id = "${service_id}"`;
    const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;

    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");

      if (!(await haveEmployeeId(con, sqlEmployee))) {
        res.status(501).send({ msg: "Invalid employee id" });
        return 0;
      }
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not have Service
            res.status(501).send({msg : "Service does not exists"});
            console.log("Service does not exists");
        }else{//? Have Service
          res.status(200).send({msg:"Ok",data:result[0]});
          console.log("Get customer success");
        }
      });
    });
  }
  
  export { getSerivecByc };