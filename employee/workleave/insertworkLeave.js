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

async function insertWorkLeave(con, req, res) {
  const employee_id = req.body?.employee_id;
  const timestamp = Date.now();
  const description = req.body?.description;
  const workleave_type = req.body?.workleave_type;
  const starttime = req.body?.starttime;
  const endtime = req.body?.endtime;

  const sqlEmployee = `SELECT * FROM employee WHERE employee_id = "${employee_id}"`;
  var sql1 = `INSERT INTO workleave(employee_id, timestamp, description, workleave_type, starttime, endtime) 
  VALUES("${employee_id}", ${timestamp}, "${description}", "${workleave_type}", ${starttime}, ${endtime})`;

  con.connect(async (err) => {
    if (err) throw err;
    console.log("\nConnected!");

    if (!(await haveEmployeeId(con, sqlEmployee))) {
      res.status(501).send({ msg: "Invalid employee id" });
      return 0;
    }

    con.query(sql1, (err, result) => {
      if (err) throw err;
      console.log("insert work leave success");
      res.status(200).send({ msg: "insert work leave success" });
    });
  });
}

export { insertWorkLeave };
