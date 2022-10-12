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

function getPromotion(con, req, res) {
  const employee_id = req.query.employee_id;
  var code = req.query?.code ?? null;
  if (code == null) {
    console.log("code is null");
    res.status(404).send("code is null");
    return 0;
  } else {
    const sql1 = `SELECT * FROM promotion WHERE code = "${code}"`;
    const sql2 = `SELECT * 
                  FROM promotion AS p
                  INNER JOIN promotion_by_day AS pd ON p.code = pd.code
                  WHERE pd.code= "${code}";`;
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
        
        if (result[0] == undefined) {
          console.log("Not found code");
          res.status(404).send("{code : Not found}");
        } else {
          if (result[0].dayflag == 1) {
            
            console.log("Join!");
            con.query(sql2, (err, result) => {
              if (err) throw err;
              
              res.status(200).send({msg:"OK",data:result[0]});
              console.log("get promotion success");
            });
          } else {
            res.status(200).send({msg:"OK",data:result[0]});
            console.log("get promotion success");
          }
        }
      });
    });
  }
}

function getAllPromotion(con, req, res) {
  const employee_id = req.query.employee_id;
  const sql1 = `SELECT * FROM promotion`;
  const sql2 = `SELECT * 
                FROM promotion AS p
                LEFT JOIN promotion_by_day AS pd ON p.code = pd.code;`;
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
      res.status(200).send({msg:"OK",data:result});
      console.log("get all promotion success");
    });
  });
}

export { getPromotion, getAllPromotion };
