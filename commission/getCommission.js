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
  
  async function getCommissionOne(con, req, res) {
      const commission_id = req.query.commission_id;
      const employee_id = req.query.employee_id;
      const sql1 = `SELECT * FROM commission WHERE commission_id = "${commission_id}"`;
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
          if (result[0] == undefined){//? Not have account
              res.status(501).send({msg : "Commission id does not exists"});
              console.log("Commission id does not exists");
          }else{//? Have account
            res.status(200).send({msg:"OK",data:result[0]});
            console.log("Get commission success");
          }
        });
      });
    }
    
    export { getCommissionOne };