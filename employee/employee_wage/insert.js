function insertWage(con, req, res) {
    const wage_type = req.body.wage_type;
    const wage_amount = req.body.wage_amount;
    
    const sql1 = `INSERT INTO employee_wage
                  VALUES("${wage_type}","${wage_amount}");`;

    con.connect((err) => {
      if (err) throw err;
      console.log("\nConnected!");
  
      con.query(sql1, (err, result) => {
        if (err) throw err;
        res.status(200).send("add wage success");
        console.log("add wage success");
      });
    });
  }
  
  export {insertWage};