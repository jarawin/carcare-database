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
  
  async function getOneEmployee(con, req, res) {
      const employee_idme = req.query.employee_idme;
      const employee_idwho = req.query.employee_idwho;
      const sql1 = `SELECT * FROM employee WHERE employee_id = "${employee_idwho}"`;
      const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_idme}"`;
      
      con.connect(async (err) => {
        if (err) throw err;
        console.log("\nConnected!");
  
  
        if (!(await haveEmployeeId(con, sqlEmployee))) {
          res.status(501).send({ msg: "Invalid employee id" });
          return 0;
        }
  
        con.query(sql1, (err, result) => {
          if (err) throw err;
          if (result[0] == undefined){//? Not have account
              res.status(501).send({msg : "Account does not exists"});
              console.log("Account does not exists");
          }else{//? Have account
            res.status(200).send({msg:"OK",data:result[0]});
            console.log("Get employee success");
          }
        });
      });
    }
    
    export { getOneEmployee };