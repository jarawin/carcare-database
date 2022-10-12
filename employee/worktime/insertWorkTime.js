const haveEmployeeId = async (con, sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
          resolve(false)
          console.log("Invalid employee id");
        }else{//? duplicate
          resolve(true)
          console.log("Valid employee id");
        }
      });
    })
  }
  
  async function insertWorkTime(con, req, res) {
    const employee_id = req.body?.employee_id;
    const starttime = Date.now();
    const endtime = req.body?.endtime;
    const location_start = req.body?.location_start;
    const location_end = req.body?.location_end;
    
    const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    var sql1 = `INSERT INTO workTime(employee_id, starttime, location_start)
    VALUES("${employee_id}", ${starttime},"${location_start}")`;
  
  
    con.connect(async (err) => {
      if (err) throw err;
      console.log("\nConnected!");
  
      if (!(await haveEmployeeId(con, sqlEmployee))){
          res.status(501).send({msg:"Invalid employee id"});
          return 0;
      }
  
      con.query(sql1,(err, result) => {
          if (err) throw err;
          console.log("insert work time success");
          res.status(200).send({msg:"insert work time success"})
          });
      })
  }
  
  export {insertWorkTime};