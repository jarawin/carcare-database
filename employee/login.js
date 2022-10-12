async function login(con, req, res) {
    const employee_id = req.query.employee_id;
    const sql1 = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
    
    con.connect((err) => {
      if (err) throw err;
      console.log("Connected!");
      
      con.query(sql1, (err, result) => {
        if (err) throw err;
        if (result[0] == undefined){//? Not duplicate
            res.status(501).send({msg: "err",isEmployee: false, 
            data: result[0]});
            console.log("Account already exists");
        }else{//? duplicate
            res.status(200).send({msg: "ok",isEmployee: true, 
            data: result[0]});
            console.log("Account already exists");
        }
      });
    });
  }
  
  export {login};