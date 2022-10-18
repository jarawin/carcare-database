async function getEmployee(con, req, res) {
  const employee_id = req.query.employee_id;
  const sql1 = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
  
  
  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    if(!employee_id){
      con.query("SELECT * FROM employee", (err, result) => {//! get all
        if(err) throw err;
        res.status(200).send({msg: "OK" ,data:result});
      })
    }else{
      con.query(sql1, (err, result) => {//! get one
        if (err) throw err;
        if (result[0] == undefined){//? Not have account
          res.status(200).send({msg: "OK",isEmployee: false, 
          data: result[0]});
          console.log("Account not exists");
        }else{//? Have account
          res.status(200).send({msg: "OK",isEmployee: true, 
          data: result[0]});
          console.log("Account already exists");
        }
      });
    }
  });
}

export { getEmployee };

// "SELECT * FROM employee"
// //TODO get all
// `SELECT * FROM employee WHERE employee_id = "${employee_id}"`
// //TODO get one