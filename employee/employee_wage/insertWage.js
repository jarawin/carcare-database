const checkDup = (con, res, wage_type, result, sql2) => {
  for (let i = 0; i < result.length; i++) {
    if (wage_type == result[i].wage_type) {
      res.status(501).send(`${wage_type} is duplicate`);
      console.log(`${wage_type} is duplicate`);
      con.end();
      return 0;
    }
  }
  addWage(con, res, sql2);
};

const addWage = (con, res, sql2) => {
  con.query(sql2, (err, result) => {
    if (err) throw err;
    res.status(200).send("insert wage success");
    console.log("insert wage success");
  });
};

function insertWage(con, req, res) {
  const wage_type = req.body.wage_type;
  const wage_amount = req.body.wage_amount;
  const sql1 = `SELECT wage_type FROM employee_wage`;
  const sql2 = `INSERT INTO employee_wage
                  VALUES("${wage_type}","${wage_amount}");`;

  con.connect((err) => {
    if (err) throw err;
    console.log("\nConnected!");

    con.query(sql1, (err, result) => {
      if (err) throw err;
      if (result != undefined) {
        checkDup(con, res, wage_type, result, sql2);
      } else {
        addWage(con, res, sql2);
      }
    });
  });
}

export { insertWage };
